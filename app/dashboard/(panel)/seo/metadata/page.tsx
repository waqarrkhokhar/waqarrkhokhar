import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import MetadataManager from "@/components/dashboard/seo/MetadataManager";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "seo")) {
    return <EmptyState title="No access" description="You can't manage SEO." />;
  }
  return <MetadataManager />;
}
