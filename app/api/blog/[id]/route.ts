import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { blogUpdateSchema } from "@/lib/blog/schema";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

/** GET /api/blog/:id — full post for the editor. */
export async function GET(_req: Request, { params }: Params) {
  const guard = await requireCapability("blog");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Post not found");
  return ok(data);
}

/** PATCH /api/blog/:id — update. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("blog");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = blogUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = createClient();
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("status, published_at")
    .eq("id", params.id)
    .single();
  if (!existing) return apiError(404, "NOT_FOUND", "Post not found");

  const patch: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.faqs !== undefined) patch.faqs = parsed.data.faqs;
  if (parsed.data.internal_links !== undefined) patch.internal_links = parsed.data.internal_links;
  if (parsed.data.status === "published" && existing.status !== "published") {
    patch.published_at = existing.published_at ?? new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") return apiError(409, "CONFLICT", "Duplicate slug");
    return apiError(500, "INTERNAL_ERROR", error.message);
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: parsed.data.status === "published" ? "published" : "updated",
    entityType: "blog",
    entityId: data.id,
    entityName: data.title,
  });
  return ok(data);
}

/** DELETE /api/blog/:id — Admins (or post owners via role). */
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("blog");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", params.id)
    .select("id, title")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Post not found");

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "deleted",
    entityType: "blog",
    entityId: data.id,
    entityName: data.title,
  });
  return action("Post deleted");
}
