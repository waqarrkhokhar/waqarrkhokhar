import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";

/** GET /api/search/analytics — top + zero-result queries. */
export async function GET() {
  const guard = await requireCapability("analytics");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("search_queries")
    .select("query, results_count")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  const rows = data ?? [];
  const counts = new Map<string, { count: number; zero: boolean }>();
  for (const r of rows) {
    const key = r.query.toLowerCase();
    const entry = counts.get(key) ?? { count: 0, zero: false };
    entry.count += 1;
    if (r.results_count === 0) entry.zero = true;
    counts.set(key, entry);
  }

  const all = [...counts.entries()].map(([query, v]) => ({ query, ...v }));
  return ok({
    total: rows.length,
    top: all.sort((a, b) => b.count - a.count).slice(0, 20),
    zero_result: all.filter((q) => q.zero).sort((a, b) => b.count - a.count).slice(0, 20),
  });
}
