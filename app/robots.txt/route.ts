import { SITE } from "@/lib/seo/sitemap";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Dynamic robots.txt (Production Spec §7). Extra rules editable from the dashboard. */
export async function GET() {
  const extra = ((await getSetting("robots_extra").catch(() => "")) as string) || "";
  const blockAi = (await getSetting("robots_block_ai").catch(() => false)) as boolean;

  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard/",
    "Disallow: /api/",
  ];
  if (extra.trim()) lines.push(...extra.trim().split("\n").map((l) => l.trim()).filter(Boolean));
  if (blockAi) {
    for (const bot of ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "anthropic-ai", "PerplexityBot"]) {
      lines.push("", `User-agent: ${bot}`, "Disallow: /");
    }
  }
  lines.push("", `Sitemap: ${SITE}/sitemap.xml`, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
