import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import ParentManager from "@/components/dashboard/catalog/ParentManager";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "categories")) {
    return <EmptyState title="No access" description="You can't manage categories." />;
  }
  return <ParentManager />;
}
