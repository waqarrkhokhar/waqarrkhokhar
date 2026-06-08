import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import SeoHub from "@/components/dashboard/seo/SeoHub";

export default async function SeoPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "seo")) {
    return <EmptyState title="No access" description="You can't manage SEO." />;
  }
  return <SeoHub />;
}
