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
  is_featured: z.boolean().optional(),
  name: z.string().min(2).max(100).optional(),
  city: z.string().max(50).nullish(),
  rating: z.number().int().min(1).max(5).optional(),
  text: z.string().min(3).max(1000).optional(),
});

/** PATCH /api/reviews/:id — approve/reject, reply, feature, or edit fields. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("reviews");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const d = parsed.data;
  const patch: Record<string, unknown> = {};
  if (d.status) patch.status = d.status;
  if (d.reply) {
    patch.admin_reply = d.reply;
    patch.admin_reply_at = new Date().toISOString();
  }
  if (d.is_featured !== undefined) patch.is_featured = d.is_featured;
  if (d.name !== undefined) patch.name = d.name;
  if (d.city !== undefined) patch.city = d.city;
  if (d.rating !== undefined) patch.rating = d.rating;
  if (d.text !== undefined) patch.text = d.text;
  if (Object.keys(patch).length === 0) {
    return apiError(400, "VALIDATION_ERROR", "Nothing to update");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Review not found");

  // Anything that changes the aggregate (status or rating) refreshes ratings.
  if (d.status || d.rating !== undefined) await refreshRatings();
  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: d.status === "approved" ? "approved" : d.status === "rejected" ? "rejected" : "updated",
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
