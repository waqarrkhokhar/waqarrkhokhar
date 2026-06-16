"use client";

import { DashPageHeader, DashSection, DashBtn } from "@/components/dashboard/shared/Dash";

export default function InternalLinks() {
  return (
    <div>
      <DashPageHeader title="Internal Linking" subtitle="Connect related pages to strengthen SEO and navigation"
        breadcrumbs={[{ label: "SEO" }, { label: "Internal Linking" }]} />

      <DashSection title="How internal linking works here">
        <div className="space-y-3 text-[13px] leading-relaxed text-ink dark:text-cream">
          <p>You add internal links where the content lives - no separate database of links to manage:</p>
          <ul className="ml-5 list-disc space-y-1.5 text-muted">
            <li><strong className="text-ink dark:text-cream">Blog posts</strong> - use the <em>Internal Links</em> tab in the Blog editor, or add inline links with the content toolbar.</li>
            <li><strong className="text-ink dark:text-cream">Collection pages</strong> - use the link tool (🔗) in the Collection content editor; you can set open-in-new-tab per link.</li>
            <li><strong className="text-ink dark:text-cream">Products</strong> - related products are linked automatically by category on each product page.</li>
          </ul>
          <p className="text-muted">A relevance-based suggestion engine is planned for a later phase; until then, links you add above are fully respected on the storefront.</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <DashBtn variant="secondary" href="/dashboard/blog">Open Blog</DashBtn>
          <DashBtn variant="secondary" href="/dashboard/collections">Open Collections</DashBtn>
        </div>
      </DashSection>
    </div>
  );
}
