import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { blogUpdateSchema } from "@/lib/blog/schema";
import { slugify } from "@/lib/slug";
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
    .select("status, published_at, slug")
    .eq("id", params.id)
    .single();
  if (!existing) return apiError(404, "NOT_FOUND", "Post not found");

  const patch: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.faqs !== undefined) patch.faqs = parsed.data.faqs;
  if (parsed.data.internal_links !== undefined) patch.internal_links = parsed.data.internal_links;
  // Editable URL slug — normalise, and remember the old one so we can add a
  // 301 redirect if it changed (keeps old links / Google rankings alive).
  let oldSlug: string | null = null;
  let newSlug: string | null = null;
  if (typeof parsed.data.slug === "string" && parsed.data.slug.trim()) {
    newSlug = slugify(parsed.data.slug);
    patch.slug = newSlug;
    if (newSlug !== existing.slug) oldSlug = existing.slug as string;
  } else {
    delete patch.slug;
  }
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
    if (error.code === "23505") return apiError(409, "CONFLICT", "That URL is already used by another post");
    return apiError(500, "INTERNAL_ERROR", error.message);
  }

  // If the URL changed, add a 301 redirect from the old address to the new one.
  if (oldSlug && newSlug && oldSlug !== newSlug) {
    try {
      const admin = createAdminClient();
      await admin.from("redirects").upsert(
        { source_url: `/blog/${oldSlug}`, target_url: `/blog/${newSlug}`, type: 301, is_active: true },
        { onConflict: "source_url" },
      );
    } catch { /* redirect is best-effort */ }
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

/** DELETE /api/blog/:id — soft-delete to trash (or ?permanent=1 to remove). */
export async function DELETE(req: Request, { params }: Params) {
  const guard = await requireCapability("blog");
  if (!guard.ok) return guard.response;

  const permanent = new URL(req.url).searchParams.get("permanent") === "1";
  const supabase = createClient();
  const { data, error } = permanent
    ? await supabase.from("blog_posts").delete().eq("id", params.id).select("id, title").single()
    : await supabase.from("blog_posts").update({ deleted_at: new Date().toISOString() }).eq("id", params.id).select("id, title").single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Post not found");

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: permanent ? "permanently deleted" : "moved to trash",
    entityType: "blog",
    entityId: data.id,
    entityName: data.title,
  });
  return action(permanent ? "Post permanently deleted" : "Post moved to trash");
}
