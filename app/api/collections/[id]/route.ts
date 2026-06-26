import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { collectionUpdateSchema } from "@/lib/catalog/schema";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

/** GET /api/collections/:id — full collection (for the editor). */
export async function GET(_req: Request, { params }: Params) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, parent:parent_categories(id, name, slug)")
    .eq("id", params.id)
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Collection not found");
  return ok(data);
}

/** PATCH /api/collections/:id — update (does not move between parents). */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = collectionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  // parent_id is fixed after creation (slug encodes the parent path).
  const { parent_id: _p, seo_content, ...rest } = parsed.data;
  void _p;
  const patch: Record<string, unknown> = { ...rest };
  if (seo_content !== undefined) patch.seo_content = seo_content;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Collection not found");

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "updated",
    entityType: "collection",
    entityId: data.id,
    entityName: data.name,
  });
  return ok(data);
}

/** DELETE /api/collections/:id — soft-delete to trash (or ?permanent=1). */
export async function DELETE(req: Request, { params }: Params) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const permanent = new URL(req.url).searchParams.get("permanent") === "1";
  if (permanent && guard.user.role !== "Super Admin" && guard.user.role !== "Admin") {
    return apiError(403, "FORBIDDEN", "Only an Admin can permanently delete a collection");
  }
  const supabase = createClient();
  const { data: col } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", params.id)
    .single();
  if (!col) return apiError(404, "NOT_FOUND", "Collection not found");

  if (permanent) {
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", params.id);
    const { error } = await supabase.from("categories").delete().eq("id", params.id);
    if (error) return apiError(500, "INTERNAL_ERROR", error.message);
    await logActivity({
      userId: guard.user.id, userName: guard.user.name, action: "permanently deleted",
      entityType: "collection", entityId: col.id, entityName: col.name,
      details: { products_uncategorized: count ?? 0 },
    });
    return action(`Collection permanently deleted. ${count ?? 0} product(s) uncategorized.`);
  }

  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "moved to trash",
    entityType: "collection", entityId: col.id, entityName: col.name,
  });
  return action("Collection moved to trash. Restore it any time from Trash.");
}
