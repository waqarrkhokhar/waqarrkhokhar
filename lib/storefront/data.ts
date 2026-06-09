import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types/database";

export type NavParent = {
  id: string;
  name: string;
  slug: string;
  children: { id: string; name: string; slug: string }[];
};

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  sale_price: number | null;
  category_name: string | null;
  image: string | null;
  rating: number | null;
  review_count: number;
};

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  count: number;
};

/** Navigation tree + business info + social links (for header/footer). */
export async function getChrome() {
  const supabase = createClient();
  const [{ data: parents }, { data: collections }, { data: settings }] =
    await Promise.all([
      supabase
        .from("parent_categories")
        .select("id, name, slug, sort_order")
        .eq("status", "published")
        .order("sort_order"),
      supabase
        .from("categories")
        .select("id, name, slug, parent_id, sort_order")
        .eq("status", "published")
        .order("sort_order"),
      supabase
        .from("settings")
        .select("key, value")
        .in("key", ["business_info", "social_links"]),
    ]);

  const nav: NavParent[] = (parents ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    children: (collections ?? [])
      .filter((c) => c.parent_id === p.id)
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  }));

  const settingsMap: Record<string, Json> = {};
  for (const s of settings ?? []) settingsMap[s.key] = s.value;

  return {
    nav,
    business: (settingsMap.business_info ?? {}) as Record<string, string>,
    social: (settingsMap.social_links ?? {}) as Record<string, string>,
  };
}

type RawProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  sale_price: number | null;
  category_id: string | null;
  is_trending: boolean;
  is_featured: boolean;
  created_at: string;
  category: { name: string } | null;
  product_images: { url: string; is_primary: boolean; sort_order: number }[];
};

function toStoreProduct(p: RawProduct, rating?: { avg: number; count: number }): StoreProduct {
  const imgs = p.product_images ?? [];
  const primary = imgs.find((i) => i.is_primary) ?? [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    sale_price: p.sale_price,
    category_name: p.category?.name ?? null,
    image: primary?.url ?? null,
    rating: rating?.avg ?? null,
    review_count: rating?.count ?? 0,
  };
}

/** Everything the homepage needs. */
export async function getHomepageData() {
  const supabase = createClient();

  const [{ data: configRow }, { data: products }, { data: categories }] =
    await Promise.all([
      supabase.from("settings").select("value").eq("key", "homepage_config").single(),
      supabase
        .from("products")
        .select(
          `id, name, slug, price, sale_price, category_id, is_trending, is_featured, created_at,
           category:categories(name),
           product_images(url, is_primary, sort_order)`,
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("categories")
        .select("id, name, slug, banner_image, sort_order")
        .eq("status", "published")
        .order("sort_order"),
    ]);

  const config = (configRow?.value ?? {}) as Record<string, Json>;
  const raw = (products ?? []) as unknown as RawProduct[];

  // Ratings for the loaded products.
  const ids = raw.map((p) => p.id);
  const ratingMap = new Map<string, { avg: number; count: number }>();
  if (ids.length) {
    const { data: ratings } = await supabase
      .from("product_ratings")
      .select("product_id, avg_rating, review_count")
      .in("product_id", ids);
    for (const r of ratings ?? []) {
      ratingMap.set(r.product_id, { avg: Number(r.avg_rating), count: r.review_count });
    }
  }

  const all = raw.map((p) => toStoreProduct(p, ratingMap.get(p.id)));

  // Trending: pinned ids → is_trending → newest. Offers: biggest discount.
  const pinnedTrending = Array.isArray(config.pinned_trending) ? (config.pinned_trending as string[]) : [];
  const byId = new Map(all.map((p) => [p.id, p]));
  let trending = pinnedTrending.map((id) => byId.get(id)).filter(Boolean) as StoreProduct[];
  if (trending.length < 4) {
    const extra = all.filter((p) => !trending.includes(p));
    const trend = extra.filter((p) => raw.find((r) => r.id === p.id)?.is_trending);
    trending = [...trending, ...trend, ...extra].slice(0, 8);
  }
  trending = trending.slice(0, 8);

  const offers = all
    .filter((p) => p.sale_price && p.price && p.sale_price < p.price)
    .sort((a, b) => (b.price! - b.sale_price!) / b.price! - (a.price! - a.sale_price!) / a.price!)
    .slice(0, 8);

  // Category cards: count + representative image (banner or first product image).
  const catCount = new Map<string, number>();
  const catImage = new Map<string, string>();
  for (const p of raw) {
    if (!p.category_id) continue;
    catCount.set(p.category_id, (catCount.get(p.category_id) ?? 0) + 1);
    if (!catImage.has(p.category_id)) {
      const sp = toStoreProduct(p);
      if (sp.image) catImage.set(p.category_id, sp.image);
    }
  }
  const cats: StoreCategory[] = (categories ?? [])
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.banner_image ?? catImage.get(c.id) ?? null,
      count: catCount.get(c.id) ?? 0,
    }))
    .filter((c) => c.count > 0 || c.image);

  return { config, trending, offers, categories: cats };
}
