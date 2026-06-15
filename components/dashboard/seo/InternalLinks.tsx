"use client";

import { DashPageHeader, DashSection, DashBadge } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";

type Sug = { from: string; to: string; fromUrl: string; toUrl: string; type: string; score: number };
const SUGGESTIONS: Sug[] = [
  { from: "Button Tufted Wingback Chair", to: "Mid Century Wingback Chair", fromUrl: "/product/button-tufted-wingback-accent-chair/", toUrl: "/product/mid-century-wingback-upholstered-accent-chair/", type: "Related Product", score: 92 },
  { from: "Sofa Chairs Collection", to: "How to Choose the Perfect Sofa (Blog)", fromUrl: "/sofas/sofa-chair/", toUrl: "/blog/how-to-choose-the-perfect-sofa-for-your-drawing-room/", type: "Collection → Blog", score: 95 },
  { from: "Boucle Tufted Loveseat", to: "Wide Boucle Loveseat Sofa", fromUrl: "/product/boucle-tufted-upholstered-loveseat/", toUrl: "/product/wide-boucle-loveseat-sofa/", type: "Related Product", score: 85 },
  { from: "Velvet vs Linen (Blog)", to: "Sofa Chairs Collection", fromUrl: "/blog/velvet-vs-linen-which-fabric-is-right/", toUrl: "/sofas/sofa-chair/", type: "Blog → Collection", score: 90 },
];

export default function InternalLinks() {
  const columns: Column<Sug>[] = [
    { key: "from", header: "From Page", render: (s) => <div><div className="font-medium text-charcoal dark:text-cream">{s.from}</div><div className="text-[11px] text-muted">{s.fromUrl}</div></div> },
    { key: "to", header: "Link To", render: (s) => <div><div className="font-medium text-charcoal dark:text-cream">{s.to}</div><div className="text-[11px] text-muted">{s.toUrl}</div></div> },
    { key: "type", header: "Type", render: (s) => <DashBadge status="scheduled" label={s.type} /> },
    { key: "score", header: "Relevance", render: (s) => <span className={`font-semibold ${s.score > 90 ? "text-green-600" : "text-amber-500"}`}>{s.score}%</span> },
  ];
  return (
    <div>
      <DashPageHeader title="Internal Linking" subtitle="Suggested internal links to strengthen SEO and navigation" breadcrumbs={[{ label: "SEO" }, { label: "Internal Linking" }]} />
      <DashSection noPad><DashTable columns={columns} rows={SUGGESTIONS} getId={(s) => s.fromUrl + s.toUrl} /></DashSection>
      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-[12px] text-blue-600">
        💡 These are suggested links. Add them where relevant using the <strong>Internal Links</strong> tab in the Blog editor or the rich-text link tool in collection content.
      </div>
    </div>
  );
}
