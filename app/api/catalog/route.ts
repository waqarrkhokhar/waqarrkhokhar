import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";

/**
 * GET /api/catalog — parents + collections for dropdowns/filters.
 * Read-only; full category/collection CRUD lands in Phase 5.
 */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const supabase = createClient();
  const [{ data: parents }, { data: collections }] = await Promise.all([
    supabase
      .from("parent_categories")
      .select("id, name, slug, sort_order")
      .is("deleted_at", null)
      .order("sort_order"),
    supabase
      .from("categories")
      .select("id, name, slug, parent_id, sort_order, status")
      .is("deleted_at", null)
      .order("sort_order"),
  ]);

  if (!parents || !collections) {
    return apiError(500, "INTERNAL_ERROR", "Failed to load catalog");
  }

  const parentName = new Map(parents.map((p) => [p.id, p.name]));
  return ok({
    parents,
    collections: collections.map((c) => ({
      ...c,
      parent_name: parentName.get(c.parent_id) ?? "",
    })),
  });
}
