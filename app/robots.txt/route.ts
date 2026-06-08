import { SITE } from "@/lib/seo/sitemap";

export const dynamic = "force-dynamic";

/** Dynamic robots.txt (Production Spec §7). */
export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard/",
    "Disallow: /api/",
    `Sitemap: ${SITE}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
