import { SITE } from "@/lib/seo/sitemap";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Dynamic robots.txt (Production Spec §7). Extra rules editable from the dashboard. */
export async function GET() {
  const extra = ((await getSetting("robots_extra").catch(() => "")) as string) || "";
  const blockAi = (await getSetting("robots_block_ai").catch(() => false)) as boolean;

  const lines = [
    "# ComfyClub — comfyclub.pk",
    "User-agent: *",
    "Allow: /",
    // Dashboard, APIs and auth pages must never be indexed.
    "Disallow: /dashboard/",
    "Disallow: /api/",
    // Admin draft previews (already noindex + auth-gated) and crawl traps.
    "Disallow: /*?preview=",
    "Disallow: /*&preview=",
    // Let crawlers fetch CSS/JS so pages render correctly.
    "Allow: /_next/static/",
  ];
  if (extra.trim()) lines.push(...extra.trim().split("\n").map((l) => l.trim()).filter(Boolean));
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
