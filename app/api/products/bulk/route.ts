import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { action } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

const schema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  updates: z
    .object({
      status: z.enum(["draft", "published", "archived"]).optional(),
      category_id: z.string().uuid().nullable().optional(),
      is_featured: z.boolean().optional(),
      is_bestseller: z.boolean().optional(),
      is_trending: z.boolean().optional(),
    })
    .refine((u) => Object.keys(u).length > 0, "At least one field is required"),
});

/** PATCH /api/products/bulk — update many products at once. */
export async function PATCH(request: Request) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const { ids, updates } = parsed.data;

  const patch: Record<string, unknown> = { ...updates };
  if (updates.status === "published") {
    patch.published_at = new Date().toISOString();
  }

  const supabase = createClient();
  const { error, count } = await supabase
    .from("products")
    .update(patch, { count: "exact" })
    .in("id", ids);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "updated",
    entityType: "product",
    entityName: `${count ?? ids.length} products`,
    details: updates as Record<string, unknown>,
  });

  return action(`${count ?? ids.length} products updated`, { count: count ?? ids.length });
}
