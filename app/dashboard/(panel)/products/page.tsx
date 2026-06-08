import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import ProductList from "@/components/dashboard/products/ProductList";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "products")) {
    return (
      <EmptyState
        title="No access"
        description="Your role doesn't have permission to manage products."
      />
    );
  }
  return <ProductList />;
}
