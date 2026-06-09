import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";

/** GET /api/reviews/pending — count of pending reviews (notification badge). */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const supabase = createClient();
  const { count, error } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok({ count: count ?? 0 });
}
