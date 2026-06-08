import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, created } from "@/lib/api/respond";
import { listParents } from "@/lib/catalog/query";
import { parentCreateSchema } from "@/lib/catalog/schema";
import { slugify, uniqueSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity";

/** GET /api/parents — all parents with child + product counts. */
export async function GET() {
  const user = await getCurrentUser();
  const staff = !!user && can(user.role, "categories");
  const supabase = createClient();
  try {
    return ok(await listParents(supabase, staff));
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }
}

/** POST /api/parents — create a parent category. */
export async function POST(request: Request) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = parentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const input = parsed.data;

  const supabase = createClient();
  // Parent slug is a top-level path: /{slug}/
  const slug = await uniqueSlug(slugify(input.name), async (cand) => {
    const { data } = await supabase
      .from("parent_categories")
      .select("id")
      .eq("slug", `/${cand}/`)
      .maybeSingle();
    return !!data;
  });

  const { data, error } = await supabase
    .from("parent_categories")
    .insert({ ...input, slug: `/${slug}/` })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") return apiError(409, "CONFLICT", "A category with that name exists");
    return apiError(500, "INTERNAL_ERROR", error.message);
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "created",
    entityType: "category",
    entityId: data.id,
    entityName: data.name,
  });
  return created(data);
}
