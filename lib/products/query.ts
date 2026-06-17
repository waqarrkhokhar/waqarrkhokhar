import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ProductStatus } from "@/lib/types/database";

type DB = SupabaseClient<Database>;

const SORTABLE = new Set([
  "created_at",
  "updated_at",
  "name",
  "price",
  "sale_price",
  "sort_order",
]);

export type ProductListParams = {
  page: number;
  limit: number;
  offset: number;
  sort: string;
  order: "asc" | "desc";
  status?: ProductStatus | null;
  categoryId?: string | null;
  search?: string | null;
  onlyPublished?: boolean; // public/storefront mode
};

/** Paginated product list with category + primary image. */
export async function listProducts(db: DB, p: ProductListParams) {
  let q = db
    .from("products")
    .select(
      `id, name, slug, sku, price, sale_price, status, is_featured,
       is_bestseller, is_trending, category_id, created_at, updated_at,
       category:categories(id, name, slug,
         parent:parent_categories(id, name, slug)),
       product_images(url, is_primary, sort_order)`,
      { count: "exact" },
    );

  q = q.is("deleted_at", null);
  if (p.onlyPublished) {
    q = q.eq("status", "published");
  } else if (p.status) {
    q = q.eq("status", p.status);
  }
  if (p.categoryId) q = q.eq("category_id", p.categoryId);
  if (p.search) q = q.or(`name.ilike.%${p.search}%,sku.ilike.%${p.search}%`);

  const sort = SORTABLE.has(p.sort) ? p.sort : "created_at";
  q = q.order(sort, { ascending: p.order === "asc" });
  q = q.range(p.offset, p.offset + p.limit - 1);

  const { data, count, error } = await q;
  if (error) throw new Error(error.message);

  const rows = (data ?? []).map((row) => {
    const images = (row.product_images ?? []) as {
      url: string;
      is_primary: boolean;
      sort_order: number;
    }[];
    const primary =
      images.find((i) => i.is_primary) ??
      [...images].sort((a, b) => a.sort_order - b.sort_order)[0];
    const { product_images, ...rest } = row;
    void product_images;
    return {
      ...rest,
      primary_image: primary?.url ?? null,
      images_count: images.length,
    };
  });

  return { data: rows, total: count ?? 0 };
}

/** Product health summary for the dashboard (API Spec §2). */
export async function productHealth(db: DB) {
  const { data, error } = await db
    .from("products")
    .select(
      `id, status, price, short_description,
       product_images(id), reviews(id)`,
    )
    .is("deleted_at", null);
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const count = (pred: (r: (typeof rows)[number]) => boolean) =>
    rows.filter(pred).length;

  return {
    total: rows.length,
    published: count((r) => r.status === "published"),
    draft: count((r) => r.status === "draft"),
    archived: count((r) => r.status === "archived"),
    scheduled: count((r) => r.status === "scheduled"),
    missing_images: count((r) => (r.product_images ?? []).length === 0),
    missing_description: count((r) => !r.short_description),
    no_price: count((r) => r.price == null),
    no_reviews: count((r) => (r.reviews ?? []).length === 0),
  };
}
