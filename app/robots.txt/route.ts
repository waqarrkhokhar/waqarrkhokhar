import { SITE } from "@/lib/seo/sitemap";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Dynamic robots.txt (Production Spec §7). Extra rules editable from the dashboard. */
export async function GET() {
  const extra = ((await getSetting("robots_extra").catch(() => "")) as string) || "";
  const blockAi = (await getSetting("robots_block_ai").catch(() => false)) as boolean;

  const lines = [
    "# ComfyClub - comfyclub.pk",
    "# Clean, canonical URLs only. No query-string URLs are indexable.",
    "",
    "User-agent: *",
    "",
    "# Private / non-content areas",
    "Disallow: /dashboard",
    "Disallow: /api/",
    "",
    "# This site uses NO query parameters for content (filters, sort and",
    "# pagination are client-side). Block every parameterised URL so search",
    "# engines never index duplicate, filter, tracking or preview variants.",
    "Disallow: /*?",
    "Disallow: /*?preview=",
    "Disallow: /*?sort=",
    "Disallow: /*?filter=",
    "Disallow: /*?page=",
    "Disallow: /*?utm_",
    "Disallow: /*?gclid=",
    "Disallow: /*?fbclid=",
    "",
    "# Allow assets so pages render correctly for crawlers",
    "Allow: /_next/static/",
    "Allow: /favicon.ico",
    "",
    "# Everything else is crawlable",
    "Allow: /",
  ];
  if (extra.trim()) lines.push("", ...extra.trim().split("\n").map((l) => l.trim()).filter(Boolean));
  if (blockAi) {
    for (const bot of ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "CCBot", "Google-Extended", "PerplexityBot", "Bytespider", "Amazonbot"]) {
      lines.push("", `User-agent: ${bot}`, "Disallow: /");
    }
  }
  lines.push("", `Sitemap: ${SITE}/sitemap.xml`, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
