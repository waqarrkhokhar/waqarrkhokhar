import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import DashShell from "@/components/dashboard/DashShell";

/** Is 2-step verification required for ALL admins? (dashboard toggle) */
async function mfaRequired(): Promise<boolean> {
  try {
    const db = createAdminClient();
    const { data } = await db.from("settings").select("value").eq("key", "mfa_required").maybeSingle();
    return data?.value === true;
  } catch {
    return false;
  }
}

/** Private area — keep every dashboard page out of search engines. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Authenticated dashboard layout. Middleware already gates /dashboard, but we
 * re-check here (defence in depth) and load the user's role for the UI.
 * Login/reset-password live outside this route group, so they have no chrome.
 */
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard/login");

  // 2-step verification gate (defence in depth — the /dashboard/2fa* pages live
  // outside this layout, so this never causes a redirect loop):
  const supabase = createClient();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal1" && aal.nextLevel === "aal2") {
    // Enrolled but hasn't entered the code this session.
    redirect("/dashboard/2fa");
  }
  if (aal?.currentLevel === "aal1" && aal.nextLevel === "aal1" && (await mfaRequired())) {
    // No 2FA set up yet and it's required for everyone.
    redirect("/dashboard/2fa-setup");
  }

  return <DashShell user={user}>{children}</DashShell>;
}
