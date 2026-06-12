import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { paginated, created, parseListParams } from "@/lib/api/respond";

/** GET /api/reviews — moderation list (staff). */
export async function GET(request: Request) {
  const guard = await requireCapability("reviews");
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const { page, limit, offset } = parseListParams(url);
  const supabase = createClient();

  let q = supabase
    .from("reviews")
    .select("*, product:products(name, slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const status = url.searchParams.get("status");
  if (status) q = q.eq("status", status);
  const productId = url.searchParams.get("product_id");
  if (productId) q = q.eq("product_id", productId);
  const ratingMin = url.searchParams.get("rating_min");
  if (ratingMin) q = q.gte("rating", Number(ratingMin));
  if (url.searchParams.get("featured") === "true") q = q.eq("is_featured", true);
  const search = url.searchParams.get("search");
  if (search) q = q.or(`name.ilike.%${search}%,text.ilike.%${search}%`);

  const { data, count, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return paginated(data ?? [], { page, limit, total: count ?? 0 });
}

const submitSchema = z.object({
  product_id: z.string().uuid(),
  name: z.string().min(2).max(100),
  city: z.string().max(50).nullish(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(5).max(1000),
  image_url: z.string().url().nullish(),
});

/**
 * POST /api/reviews — public customer submission (status = pending).
 * Writes via the service role; the storefront form (Phase 13) calls this.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const db = createAdminClient();
  const { data: product } = await db
    .from("products")
    .select("id")
    .eq("id", parsed.data.product_id)
    .eq("status", "published")
    .maybeSingle();
  if (!product) return apiError(404, "NOT_FOUND", "Product not found");

  const { error } = await db.from("reviews").insert({ ...parsed.data, status: "pending" });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  return created({ message: "Thank you! Your review will appear after approval." });
}
