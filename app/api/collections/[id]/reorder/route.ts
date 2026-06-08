import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { action } from "@/lib/api/respond";

type Params = { params: { id: string } };

const schema = z.object({ product_order: z.array(z.string().uuid()).min(1) });

/**
 * PATCH /api/collections/:id/reorder — set display order of products in the
 * collection by writing products.sort_order from the given sequence.
 */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "product_order is required");

  const supabase = createClient();
  await Promise.all(
    parsed.data.product_order.map((id, idx) =>
      supabase
        .from("products")
        .update({ sort_order: idx })
        .eq("id", id)
        .eq("category_id", params.id),
    ),
  );

  return action("Order updated");
}
