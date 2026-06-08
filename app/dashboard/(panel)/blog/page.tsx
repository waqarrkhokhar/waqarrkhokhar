import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import BlogList from "@/components/dashboard/blog/BlogList";

export default async function BlogPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "blog")) {
    return <EmptyState title="No access" description="You can't manage the blog." />;
  }
  return <BlogList />;
}
