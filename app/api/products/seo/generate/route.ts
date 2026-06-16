import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";
import { generateMetaTitle, generateMetaDescription } from "@/lib/seo/generate";

export const dynamic = "force-dynamic";

type Body = { overwrite?: boolean; ids?: string[] };

/**
 * POST /api/products/seo/generate — back-fill SEO meta title/description from
 * each product's own name, category and short description.
 *
 * By default only fills EMPTY fields (never clobbers hand-written SEO).
 * `{ overwrite: true }` regenerates for all. `{ ids: [...] }` limits scope.
 */
export async function POST(request: Request) {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const body = (await request.json().catch(() => ({}))) as Body;
  const overwrite = body.overwrite === true;

  const supabase = createClient();
  let q = supabase
    .from("products")
    .select("id, name, short_description, price, meta_title, meta_description, category:categories(name)")
    .is("deleted_at", null);
  if (Array.isArray(body.ids) && body.ids.length) q = q.in("id", body.ids);

  const { data, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  let updated = 0;
  for (const p of (data ?? []) as unknown as {
    id: string; name: string; short_description: string | null; price: number | null;
    meta_title: string | null; meta_description: string | null; category: { name: string } | null;
  }[]) {
    const categoryName = p.category?.name ?? null;
    const patch: Record<string, string> = {};
    if (overwrite || !(p.meta_title ?? "").trim()) {
      patch.meta_title = generateMetaTitle(p.name, categoryName);
    }
    if (overwrite || !(p.meta_description ?? "").trim()) {
      patch.meta_description = generateMetaDescription(p.name, {
        shortDescription: p.short_description,
        categoryName,
        price: p.price,
      });
    }
    if (Object.keys(patch).length === 0) continue;
    const { error: uErr } = await supabase.from("products").update(patch).eq("id", p.id);
    if (!uErr) updated++;
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "updated",
    entityType: "product",
    entityName: `SEO meta generated for ${updated} product(s)`,
  });

  return ok({ updated });
}
