import { getCurrentUser } from "@/lib/auth/session";
import { EmptyState } from "@/components/ui/EmptyState";
import ActivityLog from "@/components/dashboard/settings/ActivityLog";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) {
    return <EmptyState title="No access" description="Please sign in." />;
  }
  return <ActivityLog />;
}
