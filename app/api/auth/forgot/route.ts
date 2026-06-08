import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/auth/guard";
import { env } from "@/lib/env";

const schema = z.object({ email: z.string().email() });

/**
 * POST /api/auth/forgot — send a password reset email.
 * Always returns success (never reveals whether an account exists).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "A valid email is required");
  }

  const supabase = createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.siteUrl}/dashboard/reset-password`,
  });

  return NextResponse.json({
    success: true,
    message: "Reset link sent if account exists",
  });
}
