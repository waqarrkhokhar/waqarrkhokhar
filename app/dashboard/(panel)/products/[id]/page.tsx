import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import ProductEditor from "@/components/dashboard/products/ProductEditor";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "products")) {
    return <EmptyState title="No access" description="You can't manage products." />;
  }
  return <ProductEditor mode="edit" productId={params.id} />;
}
