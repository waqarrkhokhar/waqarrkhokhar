import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import HomepageBuilder from "@/components/dashboard/homepage/HomepageBuilder";

export default async function HomepagePage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "settings")) {
    return <EmptyState title="No access" description="You can't edit the homepage." />;
  }
  return <HomepageBuilder />;
}
