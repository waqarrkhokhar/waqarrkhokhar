import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";
import { setSetting } from "@/lib/settings";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

type ImageSnap = { url: string; alt_text: string | null; sort_order: number; is_primary: boolean };
type UpdatedSnap = { id: string; prev: Record<string, unknown>; prevImages?: ImageSnap[] };

/** Minimal RFC-4180 CSV parser (handles quotes, commas & newlines in fields). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  // Strip a UTF-8 BOM if present.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\r") {
      // ignore — handled by \n
    } else if (c === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// Pick the first present column from a list of aliases (case-insensitive).
function pick(obj: Record<string, string>, keys: string[]): string {
  const lower: Record<string, string> = {};
  for (const k of Object.keys(obj)) lower[k.toLowerCase().trim()] = obj[k];
  for (const k of keys) {
    const v = lower[k.toLowerCase()];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

const toInt = (v: string): number | null => {
  if (!v) return null;
  const n = parseInt(v.replace(/[^0-9.]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};

/**
 * POST /api/products/import — bulk add/update products from a WooCommerce-style
 * CSV (raw text body). Matches existing products by SKU, else by slug. Maps the
 * "Categories" column to a collection so each product lands in the right
 * collection & parent category. Returns a summary.
 */
export async function POST(request: Request) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const text = await request.text();
  if (!text.trim()) return apiError(400, "VALIDATION_ERROR", "Empty file");

  const matrix = parseCsv(text);
  if (matrix.length < 2) return apiError(400, "VALIDATION_ERROR", "CSV has no data rows");
  const headers = matrix[0].map((h) => h.trim());
  const rows = matrix.slice(1)
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => {
      const o: Record<string, string> = {};
      headers.forEach((h, i) => (o[h] = r[i] ?? ""));
      return o;
    });

  const supabase = createClient();

  // Category resolver: full "Parent > Child" path, child name, or slug → id.
  const { data: cols } = await supabase
    .from("categories")
    .select("id, name, slug, parent:parent_categories(name)")
    .is("deleted_at", null);
  const byPath = new Map<string, string>();
  const byName = new Map<string, string>();
  const bySlug = new Map<string, string>();
  for (const c of (cols ?? []) as unknown as { id: string; name: string; slug: string; parent: { name: string } | null }[]) {
    bySlug.set(c.slug.toLowerCase(), c.id);
    byName.set(c.name.toLowerCase(), c.id);
    if (c.parent) byPath.set(`${c.parent.name} > ${c.name}`.toLowerCase(), c.id);
  }
  function resolveCategory(raw: string): string | null {
    if (!raw) return null;
    // WooCommerce allows multiple categories separated by comma; try each.
    for (const part of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
      const key = part.toLowerCase();
      if (byPath.has(key)) return byPath.get(key)!;
      const leaf = key.includes(">") ? key.split(">").pop()!.trim() : key;
      if (byName.has(leaf)) return byName.get(leaf)!;
      if (bySlug.has(key)) return bySlug.get(key)!;
    }
    return null;
  }

  let created = 0, updated = 0, skipped = 0;
  const errors: string[] = [];
  const batchCreated: string[] = [];
  const batchUpdated: UpdatedSnap[] = [];

  for (const row of rows) {
    const name = pick(row, ["Name", "Optimized Product Title", "Verified Product Name", "Product Name"]);
    if (!name) { skipped++; continue; }
    const sku = pick(row, ["SKU"]);
    const slugRaw = pick(row, ["Slug", "Product URL Slug"]);
    const slug = slugRaw ? slugify(slugRaw) : slugify(name);
    const category_id = resolveCategory(pick(row, ["Categories", "Category"]));
    const published = pick(row, ["Published"]) === "1" && pick(row, ["Visibility in catalog"]) !== "hidden";

    const record: Record<string, unknown> = {
      name,
      slug,
      sku: sku || null,
      price: toInt(pick(row, ["Regular price", "Regular Price (PKR)", "Price"])),
      sale_price: toInt(pick(row, ["Sale price", "Sale Price (PKR)"])),
      short_description: pick(row, ["Short description", "Short Description"]) || null,
      long_description: pick(row, ["Description", "Long Description HTML", "Long Description"]) || null,
      meta_title: pick(row, ["Meta Title", "Meta: rank_math_title", "Meta title"]) || null,
      meta_description: pick(row, ["Meta Description", "Meta: rank_math_description", "Meta description"]) || null,
      focus_keyword: pick(row, ["Meta: rank_math_focus_keyword", "Focus Keyword"]) || null,
      ...(category_id ? { category_id } : {}),
      status: published ? "published" : "draft",
    };

    // Find existing by SKU (preferred) or slug — capture prior values for undo.
    const SNAP = "id, name, slug, sku, price, sale_price, short_description, long_description, meta_title, meta_description, focus_keyword, category_id, status, published_at";
    let existing: Record<string, unknown> | null = null;
    if (sku) {
      const { data } = await supabase.from("products").select(SNAP).eq("sku", sku).is("deleted_at", null).maybeSingle();
      existing = data ?? null;
    }
    if (!existing) {
      const { data } = await supabase.from("products").select(SNAP).eq("slug", slug).is("deleted_at", null).maybeSingle();
      existing = data ?? null;
    }
    const existingId = existing ? (existing.id as string) : null;

    let productId = existingId;
    if (existing && existingId) {
      // Snapshot only the fields this import overwrites.
      const prev: Record<string, unknown> = {};
      for (const k of Object.keys(record)) prev[k] = existing[k] ?? null;
      const { error } = await supabase.from("products").update(record).eq("id", existingId);
      if (error) { errors.push(`${name}: ${error.message}`); continue; }
      batchUpdated.push({ id: existingId, prev });
      updated++;
    } else {
      if (published) record.published_at = new Date().toISOString();
      const { data, error } = await supabase.from("products").insert(record).select("id").single();
      if (error) { errors.push(`${name}: ${error.message}`); continue; }
      productId = data.id;
      batchCreated.push(data.id);
      created++;
    }

    // Images (replace) — comma-separated URLs in the Images column.
    const imagesRaw = pick(row, ["Images", "Image", "Image URLs"]);
    if (productId && imagesRaw) {
      const urls = imagesRaw.split(",").map((s) => s.trim()).filter((s) => /^https?:\/\//.test(s));
      if (urls.length) {
        // Snapshot prior images of updated products so undo can restore them.
        if (existingId) {
          const { data: prevImgs } = await supabase
            .from("product_images").select("url, alt_text, sort_order, is_primary").eq("product_id", productId);
          const u = batchUpdated.find((b) => b.id === productId);
          if (u) u.prevImages = (prevImgs ?? []) as ImageSnap[];
        }
        await supabase.from("product_images").delete().eq("product_id", productId);
        await supabase.from("product_images").insert(
          urls.map((url, i) => ({ product_id: productId, url, alt_text: name, sort_order: i, is_primary: i === 0 })),
        );
      }
    }
  }

  // Record this import so it can be reverted (most recent only). Small JSON in
  // the settings table — the CSV itself is never stored.
  await setSetting("last_product_import", {
    at: new Date().toISOString(),
    by: guard.user.name,
    created: batchCreated,
    updated: batchUpdated,
    summary: { created, updated, skipped },
  } as never);

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "created",
    entityType: "product", entityName: `CSV import: ${created} added, ${updated} updated`,
  });

  return ok({ created, updated, skipped, errors: errors.slice(0, 20), total: rows.length, canUndo: created + updated > 0 });
}
