import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import AnalyticsManager from "@/components/dashboard/analytics/AnalyticsManager";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "analytics")) {
    return <EmptyState title="No access" description="You can't view analytics." />;
  }
  return <AnalyticsManager />;
}
