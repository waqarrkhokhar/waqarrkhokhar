import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { created } from "@/lib/api/respond";
import { uniqueSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

/** POST /api/products/:id/duplicate — clone product (+ images) as a draft. */
export async function POST(_req: Request, { params }: Params) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data: orig, error } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("id", params.id)
    .single();
  if (error || !orig) return apiError(404, "NOT_FOUND", "Product not found");

  const slug = await uniqueSlug(`${orig.slug}-copy`, async (cand) => {
    const { data } = await supabase.from("products").select("id").eq("slug", cand).maybeSingle();
    return !!data;
  });

  // Strip identity/uniqueness fields and copy the rest.
  const {
    id: _id,
    images,
    created_at: _c,
    updated_at: _u,
    published_at: _p,
    ...rest
  } = orig as Record<string, unknown> & {
    images?: { url: string; alt_text: string | null; sort_order: number; is_primary: boolean }[];
  };
  void _id; void _c; void _u; void _p;

  const { data: clone, error: insErr } = await supabase
    .from("products")
    .insert({
      ...rest,
      name: `${orig.name} (Copy)`,
      slug,
      sku: null, // SKU is unique — leave blank for the copy
      status: "draft",
      published_at: null,
    })
    .select("*")
    .single();
  if (insErr || !clone) return apiError(500, "INTERNAL_ERROR", insErr?.message ?? "Clone failed");

  // Copy images to the new product.
  if (images?.length) {
    await supabase.from("product_images").insert(
      images.map((img) => ({
        product_id: clone.id,
        url: img.url,
        alt_text: img.alt_text,
        sort_order: img.sort_order,
        is_primary: img.is_primary,
      })),
    );
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "duplicated",
    entityType: "product",
    entityId: clone.id,
    entityName: clone.name,
  });

  return created(clone);
}
