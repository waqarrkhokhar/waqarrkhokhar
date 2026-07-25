import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, created } from "@/lib/api/respond";
import { revalidateProduct } from "@/lib/products/revalidate";

type Params = { params: { id: string } };

/** Refresh the cached storefront pages for this product (best-effort). */
async function revalidate(supabase: ReturnType<typeof createClient>, productId: string) {
  try {
    const { data } = await supabase.from("products").select("slug, category:categories(slug)").eq("id", productId).maybeSingle();
    if (data?.slug) revalidateProduct(data.slug, (data as { category?: { slug?: string } }).category?.slug ?? null);
  } catch {
    // ignore — ISR still refreshes within its revalidate window
  }
}

const addSchema = z.object({
  url: z.string().url(),
  alt_text: z.string().nullish(),
});

const patchSchema = z.union([
  z.object({ reorder: z.array(z.string().uuid()).min(1) }),
  z.object({
    image_id: z.string().uuid(),
    alt_text: z.string().nullish(),
    is_primary: z.boolean().optional(),
  }),
]);

/** POST — attach an image (by URL) to the product. */
export async function POST(request: Request, { params }: Params) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "A valid image URL is required");

  const supabase = createClient();
  const { data: existing } = await supabase
    .from("product_images")
    .select("id, sort_order")
    .eq("product_id", params.id);

  const isFirst = (existing ?? []).length === 0;
  const nextOrder = Math.max(0, ...(existing ?? []).map((i) => i.sort_order + 1));

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: params.id,
      url: parsed.data.url,
      alt_text: parsed.data.alt_text ?? null,
      sort_order: isFirst ? 0 : nextOrder,
      is_primary: isFirst,
    })
    .select("*")
    .single();
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return created(data);
}

/** PATCH — reorder, or update one image's alt text / primary flag. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Invalid input");

  const supabase = createClient();

  if ("reorder" in parsed.data) {
    // Persist the new order; the first image (idx 0) is also the primary/main
    // image, so the drag order matches the storefront gallery exactly.
    await Promise.all(
      parsed.data.reorder.map((imageId, idx) =>
        supabase
          .from("product_images")
          .update({ sort_order: idx, is_primary: idx === 0 })
          .eq("id", imageId)
          .eq("product_id", params.id),
      ),
    );
    await revalidate(supabase, params.id);
    return ok({ reordered: parsed.data.reorder.length });
  }

  const { image_id, alt_text, is_primary } = parsed.data;
  if (is_primary) {
    // Only one primary per product.
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", params.id);
  }
  const patch: Record<string, unknown> = {};
  if (alt_text !== undefined) patch.alt_text = alt_text;
  if (is_primary !== undefined) patch.is_primary = is_primary;

  const { data, error } = await supabase
    .from("product_images")
    .update(patch)
    .eq("id", image_id)
    .eq("product_id", params.id)
    .select("*")
    .single();
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok(data);
}

/** DELETE ?image_id=… — remove an image (promotes another to primary). */
export async function DELETE(request: Request, { params }: Params) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const imageId = new URL(request.url).searchParams.get("image_id");
  if (!imageId) return apiError(400, "VALIDATION_ERROR", "image_id is required");

  const supabase = createClient();
  const { data: deleted } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", params.id)
    .select("is_primary")
    .single();

  // If we removed the primary image, promote the first remaining one.
  if (deleted?.is_primary) {
    const { data: next } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", params.id)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (next) {
      await supabase.from("product_images").update({ is_primary: true }).eq("id", next.id);
    }
  }

  return ok({ deleted: true });
}
