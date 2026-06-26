import { createClient } from "@/lib/supabase/server";
import { SITE, urlset, xml, type UrlEntry } from "@/lib/seo/sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase
    .from("pages")
    .select("slug, updated_at")
    .eq("status", "published")
    .is("deleted_at", null);

  const entries: UrlEntry[] = [
    { loc: `${SITE}/`, changefreq: "daily", priority: 1.0 },
    ...(data ?? []).map((p) => ({
      loc: `${SITE}${p.slug}`,
      lastmod: p.updated_at,
      changefreq: "monthly",
      priority: 0.5,
    })),
  ];

  return xml(urlset(entries));
}
