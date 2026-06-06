/**
 * Seed products from the WooCommerce CSV export (data/products.csv).
 * - Maps CSV category strings → collection slugs.
 * - Slug generated from product name (deduplicated).
 * - Images: referenced from existing WordPress URLs (Decision A3); first
 *   image is primary. Migration to Supabase Storage is a post-launch task.
 * Idempotent: products upserted by slug; images replaced per product.
 */
import { readFileSync } from "node:fs";
import Papa from "papaparse";
import { admin, slugify, log } from "./lib";

// CSV "Categories" value → collection slug (Decision A1 mapping).
const CATEGORY_MAP: Record<string, string> = {
  "Sofas > Sofa Chair": "/sofas/sofa-chair/",
  "Sofas > Sofa Cum Bed": "/sofas/sofa-come-bed/",
  "Seater Sofas > 2 Seater Sofas": "/seater-sofas/2-seater-sofas/",
};

type CsvRow = Record<string, string>;

function toInt(v: string | undefined): number | null {
  if (!v) return null;
  const n = parseInt(String(v).replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function splitImages(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function seedProducts() {
  const db = admin();

  // collection slug → id
  const { data: cats, error: cErr } = await db
    .from("categories")
    .select("id, slug");
  if (cErr) throw cErr;
  const catId = new Map(cats!.map((r) => [r.slug, r.id]));

  const csv = readFileSync("data/products.csv", "utf8");
  const parsed = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });
  const rows = parsed.data.filter((r) => (r.Name ?? "").trim());

  const usedSlugs = new Set<string>();
  let count = 0;

  for (const row of rows) {
    const name = row.Name.trim();
    let slug = slugify(name);
    while (usedSlugs.has(slug)) slug = `${slug}-x`;
    usedSlugs.add(slug);

    const categorySlug = CATEGORY_MAP[(row.Categories ?? "").trim()];
    const category_id = categorySlug ? catId.get(categorySlug) ?? null : null;

    const published =
      (row.Published ?? "").trim() === "1" &&
      (row["Visibility in catalog"] ?? "visible") !== "hidden";

    const { data: product, error } = await db
      .from("products")
      .upsert(
        {
          name,
          slug,
          sku: (row.SKU ?? "").trim() || null,
          price: toInt(row["Regular price"]),
          sale_price: toInt(row["Sale price"]),
          short_description: (row["Short description"] ?? "").trim() || null,
          long_description: (row.Description ?? "").trim() || null,
          category_id,
          is_featured: (row["Is featured?"] ?? "").trim() === "1",
          status: published ? "published" : "draft",
          published_at: published ? new Date().toISOString() : null,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw new Error(`product ${slug}: ${error.message}`);

    // Replace this product's images.
    await db.from("product_images").delete().eq("product_id", product!.id);
    const images = splitImages(row.Images);
    if (images.length) {
      const rowsToInsert = images.map((url, i) => ({
        product_id: product!.id,
        url,
        alt_text: name,
        sort_order: i,
        is_primary: i === 0,
      }));
      const { error: imgErr } = await db
        .from("product_images")
        .insert(rowsToInsert);
      if (imgErr) throw new Error(`images ${slug}: ${imgErr.message}`);
    }
    count++;
  }

  log("products", `${count} products upserted with images`);
}
