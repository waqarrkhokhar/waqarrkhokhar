import { NextResponse } from "next/server";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/session";
import { can, type Capability } from "@/lib/auth/permissions";

/** Standard JSON error envelope (API Spec conventions). */
export function apiError(status: number, code: string, message: string) {
  return NextResponse.json({ error: message, code }, { status });
}

type GuardResult =
  | { ok: true; user: CurrentUser }
  | { ok: false; response: NextResponse };

/** Require a logged-in dashboard user. */
export async function requireAuth(): Promise<GuardResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, response: apiError(401, "UNAUTHORIZED", "Not authenticated") };
  }
  return { ok: true, user };
}

/** Require a logged-in user who holds a given capability. */
export async function requireCapability(cap: Capability): Promise<GuardResult> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;
  if (!can(auth.user.role, cap)) {
    return {
      ok: false,
      response: apiError(403, "FORBIDDEN", "Insufficient role permissions"),
    };
  }
  return auth;
}
