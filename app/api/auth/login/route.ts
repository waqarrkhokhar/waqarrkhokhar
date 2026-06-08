import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/auth/guard";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/** POST /api/auth/login — sign in to the dashboard (sets httpOnly cookies). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Email and password required");
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return apiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  // Load the dashboard profile (role + status).
  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, role, status")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return apiError(403, "NO_PROFILE", "No dashboard profile for this account");
  }
  if (profile.status === "suspended") {
    await supabase.auth.signOut();
    return apiError(403, "ACCOUNT_SUSPENDED", "Account suspended");
  }

  // Record last login (best-effort).
  await supabase
    .from("users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", profile.id);

  return NextResponse.json({ data: { user: profile } });
}
