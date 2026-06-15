import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import SearchAnalytics from "@/components/dashboard/analytics/SearchAnalytics";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "analytics")) {
    return <EmptyState title="No access" description="You can't view analytics." />;
  }
  return <SearchAnalytics />;
}
