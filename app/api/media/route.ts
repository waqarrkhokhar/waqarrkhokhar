import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { paginated, parseListParams } from "@/lib/api/respond";

/** GET /api/media — media library list (newest first). */
export async function GET(request: Request) {
  const guard = await requireCapability("media");
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const { page } = parseListParams(url);
  // Media is just images — allow a larger page so the whole library shows.
  const limit = Math.min(1000, Math.max(1, parseInt(url.searchParams.get("limit") || "200", 10) || 200));
  const offset = (page - 1) * limit;
  const supabase = createClient();

  let q = supabase
    .from("media")
    .select("id, filename, url, thumbnail_url, webp_url, alt_text, mime_type, size_bytes, width, height, folder, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const folder = url.searchParams.get("folder");
  if (folder) q = q.eq("folder", folder);
  const search = url.searchParams.get("search");
  if (search) q = q.ilike("filename", `%${search}%`);

  const { data, count, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  // Best-effort "used on product": match each image URL to a product image.
  const rows = (data ?? []) as Record<string, unknown>[];
  const urls = rows.map((r) => r.url as string);
  if (urls.length) {
    const { data: usage } = await supabase
      .from("product_images")
      .select("url, product:products(name, slug)")
      .in("url", urls);
    const map = new Map<string, { name: string; slug: string }>();
    for (const u of (usage ?? []) as unknown as { url: string; product: { name: string; slug: string } | null }[]) {
      if (u.product) map.set(u.url, u.product);
    }
    for (const r of rows) r.product = map.get(r.url as string) ?? null;
  }

  return paginated(rows, { page, limit, total: count ?? 0 });
}
