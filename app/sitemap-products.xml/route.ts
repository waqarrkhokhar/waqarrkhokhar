import { createClient } from "@/lib/supabase/server";
import { SITE, urlset, xml } from "@/lib/seo/sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "published");

  return xml(
    urlset(
      (data ?? []).map((p) => ({
        loc: `${SITE}/product/${p.slug}/`,
        lastmod: p.updated_at,
        changefreq: "weekly",
        priority: 0.8,
      })),
    ),
  );
}
