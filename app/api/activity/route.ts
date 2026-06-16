import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";
import { paginated, parseListParams } from "@/lib/api/respond";

/** GET /api/activity — recent admin actions (any signed-in staff member). */
export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, offset } = parseListParams(url);
  const supabase = createClient();

  let q = supabase
    .from("activity_logs")
    .select("id, user_name, action, entity_type, entity_name, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const type = url.searchParams.get("entity_type");
  if (type) q = q.eq("entity_type", type);

  const { data, count, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return paginated(data ?? [], { page, limit, total: count ?? 0 });
}
