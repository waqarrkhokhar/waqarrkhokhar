import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { paginated, created, parseListParams } from "@/lib/api/respond";
import { listProducts } from "@/lib/products/query";
import { productCreateSchema } from "@/lib/products/schema";
import { slugify, uniqueSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity";
import type { ProductStatus } from "@/lib/types/database";

/** GET /api/products — list (public sees published; staff see all statuses). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseListParams(url);
  const { page, sort, order } = parsed;
  // Allow a higher explicit limit (up to 1000) so the SEO/metadata index and
  // exports can fetch the whole catalog; default list views still use 20.
  const limit = Math.min(1000, Math.max(1, parseInt(url.searchParams.get("limit") || String(parsed.limit), 10) || parsed.limit));
  const offset = (page - 1) * limit;
  const user = await getCurrentUser();
  const isStaff = !!user && can(user.role, "products");

  const supabase = createClient();
  try {
    const { data, total } = await listProducts(supabase, {
      page,
      limit,
      offset,
      sort,
      order,
      onlyPublished: !isStaff,
      status: (url.searchParams.get("status") as ProductStatus) || null,
      categoryId: url.searchParams.get("category_id"),
      search: url.searchParams.get("search"),
    });
    return paginated(data, { page, limit, total });
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }
}

/** POST /api/products — create a product. */
export async function POST(request: Request) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const input = parsed.data;

  const supabase = createClient();

  // Unique slug from name.
  const slug = await uniqueSlug(slugify(input.name), async (cand) => {
    const { data } = await supabase.from("products").select("id").eq("slug", cand).maybeSingle();
    return !!data;
  });

  // Unique SKU check.
  if (input.sku) {
    const { data: dupe } = await supabase
      .from("products")
      .select("id")
      .eq("sku", input.sku)
      .maybeSingle();
    if (dupe) return apiError(409, "CONFLICT", "SKU already exists");
  }

  const publishedNow = input.status === "published";
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...input,
      slug,
      published_at: publishedNow ? new Date().toISOString() : null,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") return apiError(409, "CONFLICT", "Duplicate slug or SKU");
    return apiError(500, "INTERNAL_ERROR", error.message);
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "created",
    entityType: "product",
    entityId: data.id,
    entityName: data.name,
  });

  return created(data);
}

export const dynamic = "force-dynamic";
