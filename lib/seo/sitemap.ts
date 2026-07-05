import { env } from "@/lib/env";

export const SITE = env.siteUrl.replace(/\/$/, "");

export type UrlEntry = {
  loc: string;
  lastmod?: string | null;
  changefreq?: string;
  priority?: number;
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Normalise a URL to its final, non-redirecting form. The site serves every
 * page WITHOUT a trailing slash (Next.js 308-redirects "/path/" -> "/path"),
 * so sitemap entries must drop the trailing slash — otherwise they list URLs
 * that redirect. The bare site root (e.g. https://comfyclub.pk) is left as-is.
 */
function normLoc(loc: string): string {
  const stripped = loc.replace(/\/+$/, "");
  // Keep at least the origin (protocol + host) — never return an empty path base.
  return /^https?:\/\/[^/]+$/.test(stripped) || stripped.length >= "https://a.b".length ? stripped : loc;
}

/** Build a <urlset> document. */
export function urlset(entries: UrlEntry[]): string {
  const items = entries
    .map((e) => {
      const parts = [`    <loc>${esc(normLoc(e.loc))}</loc>`];
      if (e.lastmod) parts.push(`    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>`);
      if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority != null) parts.push(`    <priority>${e.priority}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}

/** Build a <sitemapindex> document. */
export function sitemapIndex(paths: string[]): string {
  const items = paths
    .map((p) => `  <sitemap>\n    <loc>${SITE}${p}</loc>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>`;
}

export function xml(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
