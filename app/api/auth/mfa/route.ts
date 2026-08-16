import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

/** GET /api/auth/mfa — is the current user enrolled? */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const supabase = createClient();
  const { data } = await supabase.auth.mfa.listFactors();
  const totp = (data?.totp ?? []).find((f) => f.status === "verified");
  return NextResponse.json({ data: { enrolled: !!totp, factorId: totp?.id ?? null } });
}

/**
 * POST /api/auth/mfa
 *   { action: "enroll" }               → { factorId, qr, secret }
 *   { action: "verify", factorId, code } → confirm enrollment OR pass login challenge (→ aal2)
 *   { action: "disable", factorId }    → remove 2FA
 */
export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const supabase = createClient();
  const body = await request.json().catch(() => ({} as Record<string, unknown>));
  const action = body.action;

  if (action === "enroll") {
    // Clear any half-finished (unverified) factors first so re-enrolling is clean.
    const { data: list } = await supabase.auth.mfa.listFactors();
    for (const f of list?.totp ?? []) {
      if (f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `ComfyClub-${Date.now()}` });
    if (error || !data) return apiError(400, "MFA_ENROLL_FAILED", error?.message ?? "Could not start 2FA setup");
    return NextResponse.json({ data: { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret, uri: data.totp.uri } });
  }

  if (action === "verify") {
    const factorId = String(body.factorId ?? "");
    const code = String(body.code ?? "").replace(/\s/g, "");
    if (!factorId || !code) return apiError(400, "VALIDATION_ERROR", "Enter the 6-digit code from your app");
    const { data: ch, error: cErr } = await supabase.auth.mfa.challenge({ factorId });
    if (cErr || !ch) return apiError(400, "MFA_CHALLENGE_FAILED", cErr?.message ?? "Could not verify. Try again.");
    const { error: vErr } = await supabase.auth.mfa.verify({ factorId, challengeId: ch.id, code });
    if (vErr) return apiError(400, "MFA_INVALID_CODE", "That code is wrong or expired — check your app and try again.");
    return NextResponse.json({ data: { verified: true } });
  }

  if (action === "disable") {
    const factorId = String(body.factorId ?? "");
    if (!factorId) return apiError(400, "VALIDATION_ERROR", "Missing factor id");
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) return apiError(400, "MFA_DISABLE_FAILED", error.message);
    return NextResponse.json({ data: { disabled: true } });
  }

  return apiError(400, "VALIDATION_ERROR", "Unknown action");
}
