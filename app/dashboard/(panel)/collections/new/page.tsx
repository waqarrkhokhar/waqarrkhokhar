import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import CollectionEditor from "@/components/dashboard/catalog/CollectionEditor";

export default async function NewCollectionPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "categories")) {
    return <EmptyState title="No access" description="You can't manage collections." />;
  }
  return <CollectionEditor mode="create" />;
}
