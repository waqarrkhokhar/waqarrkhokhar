import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { refreshRatings } from "@/lib/reviews/ratings";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

const schema = z.object({
  status: z.enum(["approved", "rejected", "pending"]).optional(),
  reply: z.string().min(1).max(500).optional(),
});

/** PATCH /api/reviews/:id — approve/reject (status) or add an admin reply. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("reviews");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success || (!parsed.data.status && !parsed.data.reply)) {
    return apiError(400, "VALIDATION_ERROR", "Provide a status or a reply");
  }

  const patch: Record<string, unknown> = {};
  if (parsed.data.status) patch.status = parsed.data.status;
  if (parsed.data.reply) {
    patch.admin_reply = parsed.data.reply;
    patch.admin_reply_at = new Date().toISOString();
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Review not found");

  if (parsed.data.status) await refreshRatings();
  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: parsed.data.status === "approved" ? "approved" : parsed.data.status === "rejected" ? "rejected" : "updated",
    entityType: "review",
    entityId: data.id,
    entityName: data.name,
  });
  return ok(data);
}

/** DELETE /api/reviews/:id — permanent delete (Admins). */
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("reviews");
  if (!guard.ok) return guard.response;
  if (guard.user.role !== "Super Admin" && guard.user.role !== "Admin") {
    return apiError(403, "FORBIDDEN", "Only an Admin can delete reviews");
  }

  const supabase = createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  await refreshRatings();
  return action("Review deleted");
}
