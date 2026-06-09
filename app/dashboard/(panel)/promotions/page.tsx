import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import PromotionManager from "@/components/dashboard/promotions/PromotionManager";

export default async function PromotionsPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "promotions")) {
    return <EmptyState title="No access" description="You can't manage promotions." />;
  }
  return <PromotionManager />;
}
