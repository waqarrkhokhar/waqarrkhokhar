import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { action } from "@/lib/api/respond";

type Params = { params: { id: string } };

const schema = z.object({
  add: z.array(z.string().uuid()).optional(),
  remove: z.array(z.string().uuid()).optional(),
});

/**
 * PATCH /api/collections/:id/products — assign/remove products.
 * "add" sets products.category_id to this collection; "remove" nulls it
 * (only for products currently in this collection). One category per product.
 */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Invalid input");
  const { add = [], remove = [] } = parsed.data;
  if (add.length === 0 && remove.length === 0) {
    return apiError(400, "VALIDATION_ERROR", "Nothing to change");
  }

  const supabase = createClient();
  if (add.length) {
    const { error } = await supabase
      .from("products")
      .update({ category_id: params.id })
      .in("id", add);
    if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  }
  if (remove.length) {
    const { error } = await supabase
      .from("products")
      .update({ category_id: null })
      .in("id", remove)
      .eq("category_id", params.id);
    if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  }

  return action(`${add.length} added, ${remove.length} removed`);
}
