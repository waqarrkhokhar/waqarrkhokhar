import { getCurrentUser } from "@/lib/auth/session";
import OverviewDashboard from "@/components/dashboard/OverviewDashboard";

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  if (!user) return null; // layout already guards
  return <OverviewDashboard firstName={user.name.split(" ")[0]} />;
}
