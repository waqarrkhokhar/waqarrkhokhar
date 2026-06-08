import Papa from "papaparse";
import { createClient } from "@/lib/supabase/server";
import { requireCapability } from "@/lib/auth/guard";

/** GET /api/products/export — download all products as CSV. */
export async function GET(request: Request) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const supabase = createClient();

  let q = supabase
    .from("products")
    .select(
      `id, name, sku, slug, price, sale_price, short_description,
       long_description, features, status, meta_title, meta_description,
       focus_keyword, created_at, updated_at,
       category:categories(name), product_images(url, sort_order)`,
    )
    .order("created_at", { ascending: false });

  const status = url.searchParams.get("status");
  if (status) q = q.eq("status", status);
  const categoryId = url.searchParams.get("category_id");
  if (categoryId) q = q.eq("category_id", categoryId);

  const { data, error } = await q;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const rows = (data ?? []).map((p) => ({
    ID: p.id,
    Name: p.name,
    SKU: p.sku ?? "",
    Slug: p.slug,
    "Regular price": p.price ?? "",
    "Sale price": p.sale_price ?? "",
    "Short description": p.short_description ?? "",
    "Long description": p.long_description ?? "",
    Features: p.features ?? "",
    Category: (p.category as { name?: string } | null)?.name ?? "",
    Status: p.status,
    "Meta Title": p.meta_title ?? "",
    "Meta Description": p.meta_description ?? "",
    "Focus Keyword": p.focus_keyword ?? "",
    Images: ((p.product_images ?? []) as { url: string; sort_order: number }[])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url)
      .join(", "),
    "Created At": p.created_at,
    "Updated At": p.updated_at,
  }));

  const csv = Papa.unparse(rows);
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="comfyclub-products-${date}.csv"`,
    },
  });
}
