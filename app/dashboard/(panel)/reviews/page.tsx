import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import ReviewManager from "@/components/dashboard/reviews/ReviewManager";

export default async function ReviewsPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "reviews")) {
    return <EmptyState title="No access" description="You can't moderate reviews." />;
  }
  return <ReviewManager />;
}
