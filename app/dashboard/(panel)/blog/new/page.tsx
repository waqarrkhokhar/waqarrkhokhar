import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import BlogEditor from "@/components/dashboard/blog/BlogEditor";

export default async function NewBlogPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "blog")) {
    return <EmptyState title="No access" description="You can't manage the blog." />;
  }
  return <BlogEditor mode="create" defaultAuthor={user.name} />;
}
