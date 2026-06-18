import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";

/** GET /api/users — team members (Users & Roles). */
export async function GET() {
  const guard = await requireCapability("users");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, status, last_login, created_at")
    .order("created_at", { ascending: true });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok(data ?? []);
}
