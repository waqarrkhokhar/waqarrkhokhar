"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashToggle, DashBtn } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

export default function RobotsManager() {
  const toast = useToast();
  const [extra, setExtra] = useState("");
  const [blockAi, setBlockAi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setExtra(String(r.data.data.robots_extra ?? ""));
      setBlockAi(!!r.data.data.robots_block_ai);
    });
  }, []);

  async function save() {
    setSaving(true);
    const res = await Promise.all([
      apiSend("/api/settings", "PATCH", { key: "robots_extra", value: extra.trim() }),
      apiSend("/api/settings", "PATCH", { key: "robots_block_ai", value: blockAi }),
    ]);
    setSaving(false);
    if (res.some((r) => !r.ok)) return toast.error("Could not save (admin only)");
    toast.success("robots.txt updated");
  }

  const preview = ["User-agent: *", "Allow: /", "Disallow: /dashboard/", "Disallow: /api/",
    ...(extra.trim() ? extra.trim().split("\n") : []),
    ...(blockAi ? ["", "User-agent: GPTBot", "Disallow: /", "User-agent: ClaudeBot", "Disallow: /"] : []),
    "", "Sitemap: https://comfyclub.pk/sitemap.xml"].join("\n");

  return (
    <div>
      <DashPageHeader title="Robots.txt Manager" subtitle="Control how search engines crawl your site" breadcrumbs={[{ label: "SEO" }, { label: "Robots" }]}
        actions={canEdit && <DashBtn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</DashBtn>} />

      <DashSection title="Extra Rules" subtitle="Added below the defaults (one directive per line, e.g. Disallow: /search)">
        <textarea value={extra} onChange={(e) => setExtra(e.target.value)} rows={6} disabled={!canEdit}
          placeholder="Disallow: /search&#10;Disallow: /cart" className="w-full rounded-md border border-line bg-white px-3.5 py-3 font-mono text-[13px] text-ink outline-none focus:border-gold disabled:bg-panel dark:border-white/10 dark:bg-white/5 dark:text-cream" />
      </DashSection>

      <DashSection title="Settings">
        <DashToggle label="Block AI crawlers" checked={blockAi} onChange={setBlockAi} helper="Stop GPTBot, ClaudeBot and similar bots from crawling the site" />
      </DashSection>

      <DashSection title="Live Preview" subtitle="This is what /robots.txt will output">
        <pre className="overflow-x-auto rounded-md bg-panel p-4 font-mono text-[12px] leading-relaxed text-ink dark:bg-white/5 dark:text-cream">{preview}</pre>
        <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[12px] font-semibold text-gold">View live robots.txt →</a>
      </DashSection>
    </div>
  );
}
