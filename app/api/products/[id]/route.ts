import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { productUpdateSchema } from "@/lib/products/schema";
import { revalidateProduct } from "@/lib/products/revalidate";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

/** GET /api/products/:id — full product with images + category (dashboard). */
export async function GET(_req: Request, { params }: Params) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `*, category:categories(id, name, slug,
         parent:parent_categories(id, name, slug)),
       images:product_images(*)`,
    )
    .eq("id", params.id)
    .single();

  if (error || !data) return apiError(404, "NOT_FOUND", "Product not found");
  return ok(data);
}

/** PATCH /api/products/:id — partial update. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const updates = parsed.data;

  const supabase = createClient();
  const { data: existing } = await supabase
    .from("products")
    .select("id, status, slug, published_at, category:categories(slug)")
    .eq("id", params.id)
    .single();
  if (!existing) return apiError(404, "NOT_FOUND", "Product not found");

  // Set published_at the first time it becomes published.
  const patch: Record<string, unknown> = { ...updates };
  if (updates.status === "published" && existing.status !== "published") {
    patch.published_at = existing.published_at ?? new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") return apiError(409, "CONFLICT", "Duplicate slug or SKU");
    return apiError(500, "INTERNAL_ERROR", error.message);
  }

  const collectionSlug =
    (existing.category as { slug?: string } | null)?.slug ?? null;
  revalidateProduct(data.slug, collectionSlug);

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: updates.status === "published" ? "published" : "updated",
    entityType: "product",
    entityId: data.id,
    entityName: data.name,
    details: updates as Record<string, unknown>,
  });

  return ok(data);
}

/** DELETE /api/products/:id — soft delete (status → archived). */
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update({ status: "archived" })
    .eq("id", params.id)
    .select("id, name, slug")
    .single();

  if (error || !data) return apiError(404, "NOT_FOUND", "Product not found");

  revalidateProduct(data.slug);
  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "archived",
    entityType: "product",
    entityId: data.id,
    entityName: data.name,
  });

  return action("Product archived");
}
