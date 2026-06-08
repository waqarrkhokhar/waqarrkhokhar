import { createClient } from "@/lib/supabase/server";
import type { UserRole, UserStatus } from "@/lib/types/database";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

/**
 * Returns the logged-in dashboard user (with role/status from the users table)
 * or null if not authenticated. Suspended users resolve to null.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status === "suspended") return null;
  return profile as CurrentUser;
}
