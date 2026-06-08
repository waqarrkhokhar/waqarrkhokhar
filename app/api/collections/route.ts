import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, created } from "@/lib/api/respond";
import { listCollections } from "@/lib/catalog/query";
import { collectionCreateSchema } from "@/lib/catalog/schema";
import { slugify, uniqueSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity";

/** GET /api/collections — list with parent info + product counts. */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  const staff = !!user && can(user.role, "categories");
  const parentId = new URL(request.url).searchParams.get("parent_id");
  const supabase = createClient();
  try {
    return ok(await listCollections(supabase, staff, parentId));
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }
}

/** POST /api/collections — create a collection under a parent. */
export async function POST(request: Request) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = collectionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const { parent_id, seo_content, ...rest } = parsed.data;

  const supabase = createClient();
  const { data: parent } = await supabase
    .from("parent_categories")
    .select("slug")
    .eq("id", parent_id)
    .single();
  if (!parent) return apiError(404, "NOT_FOUND", "Parent category not found");

  // Collection slug nests under the parent: /{parent}/{child}/
  const childSlug = await uniqueSlug(slugify(rest.name), async (cand) => {
    const { data } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", `${parent.slug}${cand}/`)
      .maybeSingle();
    return !!data;
  });

  const { data, error } = await supabase
    .from("categories")
    .insert({
      ...rest,
      parent_id,
      seo_content: (seo_content ?? {}) as never,
      slug: `${parent.slug}${childSlug}/`,
    })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") return apiError(409, "CONFLICT", "A collection with that name exists");
    return apiError(500, "INTERNAL_ERROR", error.message);
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "created",
    entityType: "collection",
    entityId: data.id,
    entityName: data.name,
  });
  return created(data);
}
