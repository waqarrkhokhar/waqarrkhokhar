/**
 * Single source of truth for /robots.txt. Used by the route handler (live
 * output) and the dashboard Robots manager (live preview), so they never drift.
 */

// Paths every crawler must avoid: private dashboard, API, and any query-string
// URL (filters/sort/pagination/tracking are client-side, so a "?" only ever
// produces a duplicate or junk URL we never want indexed).
const CONTENT_RULES = [
  "Disallow: /dashboard",
  "Disallow: /api/",
  "Disallow: /*?",
  "Allow: /_next/static/",
  "Allow: /favicon.ico",
  "Allow: /",
];

// Reputable AI / LLM crawlers — allowed so ComfyClub can be cited in AI answers.
export const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "anthropic-ai", "Claude-Web",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended",
  "CCBot", "Amazonbot", "Meta-ExternalAgent", "cohere-ai", "DuckAssistBot",
];

// Aggressive SEO scrapers / high-load bots — blocked to reduce load and abuse.
export const BAD_BOTS = [
  "AhrefsBot", "SemrushBot", "MJ12bot", "DotBot",
  "BLEXBot", "PetalBot", "DataForSeoBot", "Barkrowler",
];

export function buildRobotsTxt(opts: { site: string; extra?: string; blockAi?: boolean }): string {
  const { site, extra = "", blockAi = false } = opts;
  const lines: string[] = [
    "# ComfyClub - comfyclub.pk",
    "# Only clean, canonical content pages are crawlable.",
    "# No dashboard, API, query-string, filter, tracking or duplicate URLs.",
    "# Images are served from Supabase (a separate host), so no image URLs",
    "# from this domain end up in Search Console.",
    "",
    "# All crawlers (default)",
    "User-agent: *",
    ...CONTENT_RULES,
    "",
  ];

  if (blockAi) {
    lines.push("# AI / LLM crawlers - blocked (disabled from the dashboard)");
    for (const bot of AI_BOTS) lines.push(`User-agent: ${bot}`);
    lines.push("Disallow: /", "");
  } else {
    lines.push("# AI / LLM assistants - welcome (same safe limits as everyone)");
    for (const bot of AI_BOTS) lines.push(`User-agent: ${bot}`);
    lines.push(...CONTENT_RULES, "");
  }

  lines.push("# Aggressive scrapers / SEO crawlers - blocked to cut load & abuse");
  for (const bot of BAD_BOTS) lines.push(`User-agent: ${bot}`);
  lines.push("Disallow: /", "");

  const cleanExtra = extra.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  if (cleanExtra.length) lines.push("# Custom rules (Dashboard - SEO - Robots)", ...cleanExtra, "");

  lines.push(`Sitemap: ${site}/sitemap.xml`, "");
  return lines.join("\n");
}
