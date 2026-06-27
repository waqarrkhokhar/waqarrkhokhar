import { SITE } from "@/lib/seo/sitemap";
import { getSettings } from "@/lib/settings";
import { buildRobotsTxt } from "@/lib/seo/robots-txt";

export const dynamic = "force-dynamic";

/** Dynamic robots.txt. Extra rules + AI toggle are editable from the dashboard. */
export async function GET() {
  let extra = "";
  let blockAi = false;
  try {
    const s = await getSettings(["robots_extra", "robots_block_ai"]);
    if (typeof s.robots_extra === "string") extra = s.robots_extra;
    blockAi = !!s.robots_block_ai;
  } catch {
    // settings unavailable — fall back to the safe defaults
  }

  const body = buildRobotsTxt({ site: SITE, extra, blockAi });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
