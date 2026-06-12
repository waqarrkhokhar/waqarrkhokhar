import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";

/** GET /api/reviews/summary — counts + average for the Reviews dashboard cards. */
export async function GET() {
  const guard = await requireCapability("reviews");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const head = (build: (q: ReturnType<typeof base>) => ReturnType<typeof base>) =>
    build(base()).then((r) => r.count ?? 0);
  function base() {
    return supabase.from("reviews").select("id", { count: "exact", head: true });
  }

  const [total, pending, approved, featured, ratingRows] = await Promise.all([
    head((q) => q),
    head((q) => q.eq("status", "pending")),
    head((q) => q.eq("status", "approved")),
    head((q) => q.eq("is_featured", true)),
    supabase.from("reviews").select("rating").eq("status", "approved"),
  ]);

  if (ratingRows.error) return apiError(500, "INTERNAL_ERROR", ratingRows.error.message);
  const ratings = ratingRows.data ?? [];
  const avg = ratings.length
    ? ratings.reduce((s, r) => s + Number(r.rating), 0) / ratings.length
    : 0;

  return ok({ total, pending, approved, featured, avg: Number(avg.toFixed(1)) });
}
