import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

type DB = SupabaseClient<Database>;

/** Parent categories with child-collection and product counts. */
export async function listParents(db: DB, staff: boolean) {
  let q = db
    .from("parent_categories")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  if (!staff) q = q.eq("status", "published");

  const { data: parents, error } = await q;
  if (error) throw new Error(error.message);

  const { data: cats } = await db
    .from("categories")
    .select("id, parent_id")
    .is("deleted_at", null);
  const { data: prods } = await db
    .from("products")
    .select("category_id")
    .neq("status", "archived")
    .is("deleted_at", null);

  const catToParent = new Map((cats ?? []).map((c) => [c.id, c.parent_id]));
  const childCount = new Map<string, number>();
  for (const c of cats ?? []) {
    childCount.set(c.parent_id, (childCount.get(c.parent_id) ?? 0) + 1);
  }
  const productCount = new Map<string, number>();
  for (const p of prods ?? []) {
    if (!p.category_id) continue;
    const parentId = catToParent.get(p.category_id);
    if (parentId) productCount.set(parentId, (productCount.get(parentId) ?? 0) + 1);
  }

  return (parents ?? []).map((p) => ({
    ...p,
    children_count: childCount.get(p.id) ?? 0,
    products_count: productCount.get(p.id) ?? 0,
  }));
}

/** Collections with parent info and product counts. */
export async function listCollections(
  db: DB,
  staff: boolean,
  parentId?: string | null,
) {
  let q = db
    .from("categories")
    .select(
      "*, parent:parent_categories(id, name, slug)",
    )
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  if (!staff) q = q.eq("status", "published");
  if (parentId) q = q.eq("parent_id", parentId);

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  const { data: prods } = await db
    .from("products")
    .select("category_id")
    .neq("status", "archived")
    .is("deleted_at", null);
  const count = new Map<string, number>();
  for (const p of prods ?? []) {
    if (p.category_id) count.set(p.category_id, (count.get(p.category_id) ?? 0) + 1);
  }

  return (data ?? []).map((c) => ({
    ...c,
    products_count: count.get(c.id) ?? 0,
  }));
}
