import { createClient } from "@/lib/supabase/server";
import { SITE, urlset, xml, type UrlEntry } from "@/lib/seo/sitemap";

export const dynamic = "force-dynamic";

/** Parent categories + child collections (slugs already include the path). */
export async function GET() {
  const supabase = createClient();
  const [{ data: parents }, { data: collections }] = await Promise.all([
    supabase.from("parent_categories").select("slug, updated_at").eq("status", "published"),
    supabase.from("categories").select("slug, updated_at").eq("status", "published"),
  ]);

  const entries: UrlEntry[] = [
    ...(parents ?? []).map((p) => ({
      loc: `${SITE}${p.slug}`,
      lastmod: p.updated_at,
      changefreq: "weekly",
      priority: 0.7,
    })),
    ...(collections ?? []).map((c) => ({
      loc: `${SITE}${c.slug}`,
      lastmod: c.updated_at,
      changefreq: "weekly",
      priority: 0.7,
    })),
  ];

  return xml(urlset(entries));
}
