import { createClient } from "@/lib/supabase/server";
import { SITE, urlset, xml } from "@/lib/seo/sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published");

  return xml(
    urlset(
      (data ?? []).map((b) => ({
        loc: `${SITE}/blog/${b.slug}/`,
        lastmod: b.updated_at,
        changefreq: "monthly",
        priority: 0.6,
      })),
    ),
  );
}
