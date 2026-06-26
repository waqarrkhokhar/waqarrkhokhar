import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types/database";
import { cleanHtml, parseProductBody, stripTagsPlain, type Dimensions } from "@/lib/storefront/html";

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
        .is("deleted_at", null)
        .order("sort_order"),
      supabase
        .from("categories")
        .select("id, name, slug, parent_id, sort_order")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("sort_order"),
      supabase
        .from("settings")
        .select("key, value")
        .in("key", ["business_info", "social_links", "announcement_bar", "footer_config", "branding"]),
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
    announcement: (settingsMap.announcement_bar ?? {}) as { enabled?: boolean; message?: string; bg?: string; color?: string },
    footer: (settingsMap.footer_config ?? {}) as { brand?: string; copyright?: string },
    branding: (settingsMap.branding ?? {}) as { favicon?: string; header_logo?: string; footer_logo?: string },
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
  category: { name: string; slug: string } | null;
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
           category:categories(name, slug),
           product_images(url, is_primary, sort_order)`,
        )
        .eq("status", "published")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("categories")
        .select("id, name, slug, banner_image, sort_order")
        .eq("status", "published")
        .is("deleted_at", null)
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

  // Fisher-Yates shuffle so non-pinned homepage picks rotate on every visit
  // (keeps the sections feeling live instead of frozen to one fixed set).
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Trending: pinned ids → is_trending → newest. Offers: biggest discount.
  const pinnedTrending = Array.isArray(config.pinned_trending) ? (config.pinned_trending as string[]) : [];
  const byId = new Map(all.map((p) => [p.id, p]));
  let trending = pinnedTrending.map((id) => byId.get(id)).filter(Boolean) as StoreProduct[];
  if (trending.length < 4) {
    const extra = all.filter((p) => !trending.includes(p));
    const trend = shuffle(extra.filter((p) => raw.find((r) => r.id === p.id)?.is_trending));
    const rest = shuffle(extra.filter((p) => !raw.find((r) => r.id === p.id)?.is_trending));
    trending = [...trending, ...trend, ...rest].slice(0, 8);
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

  // Feature row: products from the "2 Seater Sofas" collection (design's
  // dedicated section). Falls back gracefully if that collection is empty.
  const featureSlug = "/seater-sofas/2-seater-sofas/";
  const featureCat = (categories ?? []).find((c) => c.slug === featureSlug);
  const feature = {
    title: featureCat?.name ?? "2 Seater Sofas",
    subtitle: "Compact luxury for every space",
    link: featureSlug,
    products: shuffle(raw.filter((p) => p.category?.slug === featureSlug)).slice(0, 4).map((p) => toStoreProduct(p, ratingMap.get(p.id))),
  };

  return { config, trending, offers, categories: cats, feature };
}

// ── Product detail ──────────────────────────────────────────────────────────
export type ProductImage = { url: string; alt: string | null };
export type ProductReview = {
  id: string;
  name: string;
  city: string | null;
  rating: number;
  text: string;
  image_url: string | null;
  admin_reply: string | null;
  is_featured: boolean;
  created_at: string;
};
export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number | null;
  sale_price: number | null;
  /** Cleaned short description HTML (under the price). */
  short_description: string | null;
  /** Description-tab HTML (intro + sections, minus Features/Dimensions). */
  description_html: string;
  /** Bullet list for the Features tab. */
  features: string[];
  /** Parsed dimensions for the grid (or null). */
  dimensions: Dimensions | null;
  whatsapp_message_template: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  robots: string | null;
  images: ProductImage[];
  category: { name: string; slug: string; parent_name: string; parent_slug: string } | null;
  rating: number | null;
  review_count: number;
  reviews: ProductReview[];
  related: StoreProduct[];
};

/** Full product detail for /product/[slug]/. Returns null if not found. */
export async function getProductDetail(slug: string, preview = false): Promise<ProductDetail | null> {
  const supabase = createClient();
  let q = supabase
    .from("products")
    .select(
      `id, name, slug, sku, price, sale_price, short_description, long_description,
       features, whatsapp_message_template, meta_title, meta_description, og_image, robots, category_id,
       category:categories(name, slug, parent:parent_categories(name, slug)),
       product_images(url, alt_text, is_primary, sort_order)`,
    )
    .eq("slug", slug)
    .is("deleted_at", null);
  if (!preview) q = q.eq("status", "published");
  const { data: p } = await q.maybeSingle();

  if (!p) return null;
  const row = p as any;

  const imgs = (row.product_images ?? []) as { url: string; alt_text: string | null; is_primary: boolean; sort_order: number }[];
  const images: ProductImage[] = [...imgs]
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.sort_order - b.sort_order)
    .map((i) => ({ url: i.url, alt: i.alt_text }));

  const [{ data: ratingRow }, { data: reviewRows }] = await Promise.all([
    supabase.from("product_ratings").select("avg_rating, review_count").eq("product_id", row.id).maybeSingle(),
    supabase
      .from("reviews")
      .select("id, name, city, rating, text, image_url, admin_reply, is_featured, created_at")
      .eq("product_id", row.id)
      .eq("status", "approved")
      .is("deleted_at", null)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  // Related: same category, excluding this product.
  let related: StoreProduct[] = [];
  if (row.category_id) {
    const { data: rel } = await supabase
      .from("products")
      .select(
        `id, name, slug, price, sale_price, category_id,
         category:categories(name, slug),
         product_images(url, is_primary, sort_order)`,
      )
      .eq("category_id", row.category_id)
      .eq("status", "published")
      .is("deleted_at", null)
      .neq("id", row.id)
      .limit(4);
    related = ((rel ?? []) as unknown as RawProduct[]).map((r) => toStoreProduct(r));
  }

  // Split the WooCommerce body into the prototype's sections; fall back to the
  // separate `features` column if the body had no "Key Features" block.
  const parsed = parseProductBody(row.long_description);
  const featureFallback = row.features
    ? cleanHtml(row.features)
        .split(/\n|;|<br\s*\/?>/i)
        .map((f) => f.replace(/<[^>]+>/g, "").trim())
        .filter(Boolean)
    : [];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    price: row.price,
    sale_price: row.sale_price,
    short_description: cleanHtml(row.short_description) || null,
    description_html: parsed.descriptionHtml,
    features: parsed.features.length ? parsed.features : featureFallback,
    dimensions: parsed.dimensions,
    whatsapp_message_template: row.whatsapp_message_template,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    og_image: row.og_image,
    robots: row.robots ?? null,
    images,
    category: row.category
      ? {
          name: row.category.name,
          slug: row.category.slug,
          parent_name: row.category.parent?.name ?? "",
          parent_slug: row.category.parent?.slug ?? "",
        }
      : null,
    rating: ratingRow ? Number(ratingRow.avg_rating) : null,
    review_count: ratingRow?.review_count ?? 0,
    reviews: (reviewRows ?? []) as ProductReview[],
    related,
  };
}

// ── Category / collection listing ───────────────────────────────────────────
export type CategoryPage = {
  type: "parent" | "collection";
  name: string;
  slug: string;
  description: string | null;
  intro_content: string | null;
  content_html: string | null;
  banner_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  robots: string | null;
  breadcrumb: { name: string; slug: string }[];
  products: StoreProduct[];
  /** For a parent: its child collections (with counts) to show as cards. */
  children: StoreCategory[];
};

/** Resolve a storefront path to a parent or collection listing. null if unknown. */
export async function getCategoryPage(path: string, preview = false): Promise<CategoryPage | null> {
  const slug = path.startsWith("/") ? path : `/${path}`;
  const supabase = createClient();

  // Try a child collection first (most specific).
  let colQ = supabase
    .from("categories")
    .select(
      `id, name, slug, description, intro_content, content_html, banner_image, meta_title, meta_description, robots,
       parent:parent_categories(name, slug)`,
    )
    .eq("slug", slug)
    .is("deleted_at", null);
  if (!preview) colQ = colQ.eq("status", "published");
  const { data: collection } = await colQ.maybeSingle();

  if (collection) {
    const c = collection as any;
    const products = await productsForCategory(supabase, c.id);
    return {
      type: "collection",
      name: c.name,
      slug: c.slug,
      description: c.description ? stripTagsPlain(cleanHtml(c.description)) : null,
      intro_content: cleanHtml(c.intro_content) || null,
      content_html: cleanHtml(c.content_html) || null,
      banner_image: c.banner_image,
      meta_title: c.meta_title,
      meta_description: c.meta_description,
      robots: c.robots ?? null,
      breadcrumb: c.parent ? [{ name: c.parent.name, slug: c.parent.slug }, { name: c.name, slug: c.slug }] : [{ name: c.name, slug: c.slug }],
      products,
      children: [],
    };
  }

  // Otherwise a parent category.
  let parentQ = supabase
    .from("parent_categories")
    .select("id, name, slug, description, banner_image, meta_title, meta_description, robots")
    .eq("slug", slug)
    .is("deleted_at", null);
  if (!preview) parentQ = parentQ.eq("status", "published");
  const { data: parent } = await parentQ.maybeSingle();

  if (!parent) return null;

  const { data: childRows } = await supabase
    .from("categories")
    .select("id, name, slug, banner_image, sort_order")
    .eq("parent_id", parent.id)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order");

  // Products across all child collections of this parent.
  const childIds = (childRows ?? []).map((c) => c.id);
  let products: StoreProduct[] = [];
  const children: StoreCategory[] = [];
  if (childIds.length) {
    products = await productsForCategory(supabase, childIds);
    const counts = new Map<string, number>();
    const imgFor = new Map<string, string>();
    for (const p of products) {
      // products carry category_name not id; recount via separate cheap query below
      void p;
    }
    // Count per child collection.
    const { data: countRows } = await supabase
      .from("products")
      .select("category_id")
      .in("category_id", childIds)
      .eq("status", "published")
      .is("deleted_at", null);
    for (const r of countRows ?? []) counts.set(r.category_id as string, (counts.get(r.category_id as string) ?? 0) + 1);
    for (const c of childRows ?? []) {
      children.push({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.banner_image ?? imgFor.get(c.id) ?? products.find((p) => p.category_name === c.name)?.image ?? null,
        count: counts.get(c.id) ?? 0,
      });
    }
  }

  return {
    type: "parent",
    name: parent.name,
    slug: parent.slug,
    description: parent.description ? stripTagsPlain(parent.description) : null,
    intro_content: null,
    content_html: null,
    banner_image: parent.banner_image,
    meta_title: parent.meta_title,
    meta_description: parent.meta_description,
    robots: parent.robots ?? null,
    breadcrumb: [{ name: parent.name, slug: parent.slug }],
    products,
    children,
  };
}

async function productsForCategory(supabase: any, categoryId: string | string[]): Promise<StoreProduct[]> {
  let q = supabase
    .from("products")
    .select(
      `id, name, slug, price, sale_price, category_id,
       category:categories(name, slug),
       product_images(url, is_primary, sort_order)`,
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order");
  q = Array.isArray(categoryId) ? q.in("category_id", categoryId) : q.eq("category_id", categoryId);
  const { data } = await q.limit(200);
  const raw = (data ?? []) as unknown as RawProduct[];

  const ids = raw.map((p) => p.id);
  const ratingMap = new Map<string, { avg: number; count: number }>();
  if (ids.length) {
    const { data: ratings } = await supabase
      .from("product_ratings")
      .select("product_id, avg_rating, review_count")
      .in("product_id", ids);
    for (const r of ratings ?? []) ratingMap.set(r.product_id, { avg: Number(r.avg_rating), count: r.review_count });
  }
  return raw.map((p) => toStoreProduct(p, ratingMap.get(p.id)));
}
