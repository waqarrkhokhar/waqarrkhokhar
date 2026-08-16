import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { TwoFactorChallenge } from "@/components/dashboard/security/TwoFactor";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard/login");
  // Already fully verified? Go straight in.
  const supabase = createClient();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal2") redirect("/dashboard");
  return <TwoFactorChallenge />;
}
