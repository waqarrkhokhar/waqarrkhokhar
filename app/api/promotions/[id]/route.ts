import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { promoSchema } from "@/lib/promotions/schema";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("promotions");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = promoSchema.partial().safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Invalid input");

  const patch: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.is_active !== undefined) {
    patch.status = parsed.data.is_active ? "active" : "paused";
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("promotions")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Promotion not found");

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "updated",
    entityType: "promotion",
    entityId: data.id,
    entityName: data.title,
  });
  return ok(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("promotions");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { error } = await supabase.from("promotions").delete().eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return action("Promotion deleted");
}
