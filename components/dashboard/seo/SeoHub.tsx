"use client";

import { useState } from "react";
import RedirectManager from "./RedirectManager";
import Monitor404 from "./Monitor404";

type Tab = "redirects" | "monitor";

export default function SeoHub() {
  const [tab, setTab] = useState<Tab>("redirects");

  const TABS: { id: Tab; label: string }[] = [
    { id: "redirects", label: "Redirects" },
    { id: "monitor", label: "404 Monitor" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-semibold">SEO</h2>

      <div className="flex gap-1 border-b border-black/5 dark:border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t.id ? "border-b-2 border-gold text-navy dark:text-gold" : "text-charcoal/60 dark:text-cream/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "redirects" ? <RedirectManager /> : <Monitor404 />}

      <p className="text-xs text-charcoal/50 dark:text-cream/50">
        Bulk metadata editor &amp; schema manager arrive alongside the storefront
        (Phase 13). Sitemaps are live at <code>/sitemap.xml</code> and{" "}
        <code>/robots.txt</code>.
      </p>
    </div>
  );
}
