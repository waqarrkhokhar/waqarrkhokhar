import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Landing page for the password-reset email link.
 * Exchanges the one-time code for a session (PKCE), then shows a form to set
 * a new password. Reached from /api/auth/forgot.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  let exchangeError: string | null = null;

  if (searchParams.code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(
      searchParams.code,
    );
    if (error) exchangeError = "This reset link is invalid or has expired.";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="mb-8 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">
            ComfyClub
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-cream">
            Set a New Password
          </h1>
        </div>
        <ResetPasswordForm initialError={exchangeError} />
      </div>
    </main>
  );
}
