"use client";

import { DashPageHeader, DashSection, DashBtn, DashBadge } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";

type S = { name: string; url: string };
const SITEMAPS: S[] = [
  { name: "Sitemap Index", url: "/sitemap.xml" },
  { name: "Pages Sitemap", url: "/sitemap-pages.xml" },
  { name: "Products Sitemap", url: "/sitemap-products.xml" },
  { name: "Collections Sitemap", url: "/sitemap-collections.xml" },
  { name: "Blog Sitemap", url: "/sitemap-blog.xml" },
];

export default function SitemapManager() {
  const columns: Column<S>[] = [
    { key: "name", header: "Sitemap", render: (s) => <div><div className="font-medium text-charcoal dark:text-cream">{s.name}</div><div className="text-[11px] text-muted">{s.url}</div></div> },
    { key: "auto", header: "Updates", render: () => <DashBadge status="active" label="Automatic" /> },
    { key: "actions", header: "", className: "w-24", render: (s) => (
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="rounded border border-line px-2.5 py-1 text-xs hover:border-gold dark:border-white/10" onClick={(e) => e.stopPropagation()}>View</a>
    ) },
  ];
  return (
    <div>
      <DashPageHeader title="Sitemap Manager" subtitle="XML sitemaps submitted to search engines" breadcrumbs={[{ label: "SEO" }, { label: "Sitemap" }]}
        actions={<a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"><DashBtn variant="secondary">Open Index</DashBtn></a>} />
      <DashSection noPad>
        <DashTable columns={columns} rows={SITEMAPS} getId={(s) => s.url} />
      </DashSection>
      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-[12px] text-blue-600">
        💡 Sitemaps regenerate automatically from your live catalog, collections and blog — there&apos;s nothing to rebuild manually. Submit the index URL <strong>https://comfyclub.pk/sitemap.xml</strong> in Google Search Console.
      </div>
    </div>
  );
}
