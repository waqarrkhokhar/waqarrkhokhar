import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { TwoFactorSetup } from "@/components/dashboard/security/TwoFactor";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard/login");
  return <TwoFactorSetup />;
}
