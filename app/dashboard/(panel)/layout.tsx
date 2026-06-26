import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import DashShell from "@/components/dashboard/DashShell";

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

  return <DashShell user={user}>{children}</DashShell>;
}
