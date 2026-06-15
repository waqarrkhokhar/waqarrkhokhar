"use client";

import { DashPageHeader, DashSection, DashBadge } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";

type Schema = { name: string; type: string; where: string; live: boolean };
const SCHEMAS: Schema[] = [
  { name: "Product", type: "Product", where: "Product pages", live: true },
  { name: "Aggregate Rating", type: "AggregateRating", where: "Products with reviews", live: true },
  { name: "Review", type: "Review", where: "Product pages", live: true },
  { name: "Article", type: "Article", where: "Blog posts", live: true },
  { name: "Breadcrumb", type: "BreadcrumbList", where: "All pages", live: false },
  { name: "Collection", type: "CollectionPage", where: "Collection pages", live: false },
  { name: "Organization", type: "Organization", where: "Site-wide", live: false },
  { name: "Local Business", type: "LocalBusiness", where: "Contact page", live: false },
];

export default function SchemaManager() {
  const columns: Column<Schema>[] = [
    { key: "name", header: "Schema", render: (s) => <div><div className="font-medium text-charcoal dark:text-cream">{s.name}</div><div className="text-[11px] text-muted">{s.type}</div></div> },
    { key: "where", header: "Applied To", render: (s) => <span className="text-muted">{s.where}</span> },
    { key: "live", header: "Status", render: (s) => <DashBadge status={s.live ? "active" : "draft"} label={s.live ? "Live" : "Planned"} /> },
  ];
  return (
    <div>
      <DashPageHeader title="Schema Manager" subtitle="Structured data (JSON-LD) emitted across the storefront" breadcrumbs={[{ label: "SEO" }, { label: "Schema Manager" }]} />
      <DashSection noPad><DashTable columns={columns} rows={SCHEMAS} getId={(s) => s.type} /></DashSection>
      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-[12px] text-blue-600">
        💡 Product, Review/Rating and Article schema are generated automatically and validate in Google&apos;s Rich Results Test. The remaining types ship in a later SEO phase.
      </div>
    </div>
  );
}
