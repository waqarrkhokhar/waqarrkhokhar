import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { EmptyState } from "@/components/ui/EmptyState";
import SettingsManager from "@/components/dashboard/settings/SettingsManager";
import SessionsManager from "@/components/dashboard/settings/SessionsManager";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "settings")) {
    return <EmptyState title="No access" description="You don't have access to this area." />;
  }
  return (
    <>
      <SettingsManager />
      <div className="mt-6">
        <SessionsManager />
      </div>
    </>
  );
}
