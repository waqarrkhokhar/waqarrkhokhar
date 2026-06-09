import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import LeadManager from "@/components/dashboard/leads/LeadManager";

export default async function LeadsPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "leads")) {
    return <EmptyState title="No access" description="You can't view leads." />;
  }
  return <LeadManager />;
}
