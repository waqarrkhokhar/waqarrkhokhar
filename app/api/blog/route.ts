import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { paginated, created, parseListParams } from "@/lib/api/respond";
import { blogCreateSchema } from "@/lib/blog/schema";
import { slugify, uniqueSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity";

/** GET /api/blog — list posts (public sees published only). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const { page, limit, offset } = parseListParams(url);
  const user = await getCurrentUser();
  const staff = !!user && can(user.role, "blog");

  const supabase = createClient();
  let q = supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, featured_image, category, tags, author, status, published_at, updated_at",
      { count: "exact" },
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (!staff) q = q.eq("status", "published");
  else if (url.searchParams.get("status")) q = q.eq("status", url.searchParams.get("status")!);

  const category = url.searchParams.get("category");
  if (category) q = q.eq("category", category);
  const search = url.searchParams.get("search");
  if (search) q = q.ilike("title", `%${search}%`);

  const { data, count, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return paginated(data ?? [], { page, limit, total: count ?? 0 });
}

/** POST /api/blog — create a post. */
export async function POST(request: Request) {
  const guard = await requireCapability("blog");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = blogCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const input = parsed.data;

  const supabase = createClient();
  const slug = await uniqueSlug(slugify(input.title), async (cand) => {
    const { data } = await supabase.from("blog_posts").select("id").eq("slug", cand).maybeSingle();
    return !!data;
  });

  const publishedNow = input.status === "published";
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      ...input,
      slug,
      author: input.author || guard.user.name,
      faqs: (input.faqs ?? null) as never,
      internal_links: (input.internal_links ?? null) as never,
      published_at: publishedNow ? new Date().toISOString() : null,
    })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") return apiError(409, "CONFLICT", "Duplicate slug");
    return apiError(500, "INTERNAL_ERROR", error.message);
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "created",
    entityType: "blog",
    entityId: data.id,
    entityName: data.title,
  });
  return created(data);
}
