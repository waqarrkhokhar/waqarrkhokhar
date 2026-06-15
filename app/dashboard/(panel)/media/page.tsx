import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import MediaLibrary from "@/components/dashboard/media/MediaLibrary";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "media")) {
    return <EmptyState title="No access" description="You don't have access to this area." />;
  }
  return <MediaLibrary />;
}
