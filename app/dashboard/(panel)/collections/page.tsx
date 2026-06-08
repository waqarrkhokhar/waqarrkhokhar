import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import CollectionList from "@/components/dashboard/catalog/CollectionList";

export default async function CollectionsPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "categories")) {
    return <EmptyState title="No access" description="You can't manage collections." />;
  }
  return <CollectionList />;
}
