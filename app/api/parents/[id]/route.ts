import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { parentUpdateSchema } from "@/lib/catalog/schema";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

/** PATCH /api/parents/:id — update a parent category. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = parentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("parent_categories")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Parent category not found");

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "updated",
    entityType: "category",
    entityId: data.id,
    entityName: data.name,
    details: parsed.data as Record<string, unknown>,
  });
  return ok(data);
}

/**
 * DELETE /api/parents/:id — delete a parent (Admins only).
 * Child collections cascade-delete; their products become uncategorized
 * (category_id → NULL) — products are never destroyed.
 */
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;
  if (guard.user.role !== "Super Admin" && guard.user.role !== "Admin") {
    return apiError(403, "FORBIDDEN", "Only an Admin can delete a parent category");
  }

  const supabase = createClient();
  const { data: parent } = await supabase
    .from("parent_categories")
    .select("id, name")
    .eq("id", params.id)
    .single();
  if (!parent) return apiError(404, "NOT_FOUND", "Parent category not found");

  const { count: childCount } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", params.id);

  const { error } = await supabase.from("parent_categories").delete().eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "deleted",
    entityType: "category",
    entityId: parent.id,
    entityName: parent.name,
    details: { collections_removed: childCount ?? 0 },
  });
  return action(`'${parent.name}' deleted (${childCount ?? 0} collections removed)`);
}
