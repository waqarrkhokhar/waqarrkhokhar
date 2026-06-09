import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ok } from "@/lib/api/respond";
import { apiError } from "@/lib/auth/guard";
import { listProducts } from "@/lib/products/query";

/**
 * GET /api/search?q=…&limit=8 — public product search.
 * Logs each query to search_queries for the Search Analytics view.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) return apiError(400, "VALIDATION_ERROR", "Query too short");
  const limit = Math.min(20, parseInt(url.searchParams.get("limit") || "8", 10) || 8);

  const supabase = createClient();
  let results: Awaited<ReturnType<typeof listProducts>>["data"] = [];
  try {
    const res = await listProducts(supabase, {
      page: 1, limit, offset: 0, sort: "created_at", order: "desc",
      onlyPublished: true, search: q,
    });
    results = res.data;
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }

  try {
    await createAdminClient().from("search_queries").insert({ query: q, results_count: results.length });
  } catch {
    /* logging is non-critical */
  }

  return ok(results);
}
