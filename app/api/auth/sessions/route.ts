import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

type RawSession = {
  id: string;
  created_at: string;
  updated_at: string | null;
  not_after: string | null;
  ip: string | null;
  user_agent: string | null;
};

/** Turn a User-Agent string into a friendly "Browser on Device" label. */
function parseDevice(ua: string | null): { device: string; browser: string } {
  const s = ua || "";
  let device = "Unknown device";
  if (/iPhone/i.test(s)) device = "iPhone";
  else if (/iPad/i.test(s)) device = "iPad";
  else if (/Android/i.test(s)) device = /Mobile/i.test(s) ? "Android phone" : "Android tablet";
  else if (/Windows/i.test(s)) device = "Windows PC";
  else if (/Macintosh|Mac OS X/i.test(s)) device = "Mac";
  else if (/Linux/i.test(s)) device = "Linux";
  let browser = "Browser";
  if (/Edg\//i.test(s)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(s)) browser = "Opera";
  else if (/Chrome\//i.test(s)) browser = "Chrome";
  else if (/Firefox\//i.test(s)) browser = "Firefox";
  else if (/Safari\//i.test(s)) browser = "Safari";
  return { device, browser };
}

function isPrivateIp(ip: string): boolean {
  return (
    !ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("10.") ||
    ip.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith("fe80") || ip.startsWith("fc") || ip.startsWith("fd")
  );
}

/** Best-effort IP → "City, Region, Country". Never throws. */
async function geolocate(ip: string | null): Promise<string | null> {
  if (!ip || isPrivateIp(ip)) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,city,region,country`, { signal: ctrl.signal });
    clearTimeout(t);
    const j = await res.json().catch(() => null);
    if (!j || j.success === false) return null;
    return [j.city, j.region, j.country].filter(Boolean).join(", ") || null;
  } catch {
    return null;
  }
}

/** Read the `session_id` claim from the current access token. */
function currentSessionId(accessToken: string | undefined): string | null {
  if (!accessToken) return null;
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString("utf8"));
    return payload.session_id ?? null;
  } catch {
    return null;
  }
}

/** GET /api/auth/sessions — the current user's active login sessions. */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const currentId = currentSessionId(session?.access_token);

  const { data, error } = await (supabase as unknown as { rpc: (fn: string) => Promise<{ data: unknown; error: { message: string } | null }> }).rpc("list_my_sessions");
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  const rows = ((data as RawSession[]) ?? []);
  const ips = Array.from(new Set(rows.map((r) => r.ip).filter(Boolean))) as string[];
  const geo = new Map<string, string | null>();
  await Promise.all(ips.map(async (ip) => geo.set(ip, await geolocate(ip))));

  const sessions = rows.map((r) => {
    const { device, browser } = parseDevice(r.user_agent);
    return {
      id: r.id,
      device,
      browser,
      location: r.ip ? geo.get(r.ip) ?? null : null,
      ip: r.ip,
      created_at: r.created_at,
      last_active: r.updated_at ?? r.created_at,
      current: r.id === currentId,
    };
  });

  return NextResponse.json({ data: sessions });
}

/** DELETE /api/auth/sessions?id=<id>  — or ?others=1 to end all but this one. */
export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const supabase = createClient();
  // Call rpc bound to the client (do NOT extract .rpc into a variable — that
  // loses `this` and throws).
  const rpc = (fn: string, args: Record<string, unknown>) =>
    (supabase as unknown as { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }> }).rpc(fn, args);
  const { searchParams } = new URL(request.url);

  if (searchParams.get("others") === "1") {
    const { data: { session } } = await supabase.auth.getSession();
    const keep = currentSessionId(session?.access_token);
    const { data, error } = await rpc("revoke_other_sessions", { keep_session_id: keep });
    if (error) return apiError(500, "INTERNAL_ERROR", error.message);
    return NextResponse.json({ data: { revoked: data ?? 0 } });
  }

  const id = searchParams.get("id");
  if (!id) return apiError(400, "VALIDATION_ERROR", "Missing session id");
  const { data, error } = await rpc("revoke_my_session", { session_id: id });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return NextResponse.json({ data: { revoked: !!data } });
}
