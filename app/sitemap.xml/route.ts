import { sitemapIndex, xml } from "@/lib/seo/sitemap";

export const dynamic = "force-dynamic";

/** Sitemap index pointing to the per-type sub-sitemaps. */
export function GET() {
  return xml(
    sitemapIndex([
      "/sitemap-pages.xml",
      "/sitemap-products.xml",
      "/sitemap-collections.xml",
      "/sitemap-blog.xml",
    ]),
  );
}
