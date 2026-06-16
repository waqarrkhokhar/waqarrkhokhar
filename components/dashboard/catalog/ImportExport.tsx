"use client";

import { useState } from "react";
import { DashPageHeader, DashSection, DashTabs, DashBtn } from "@/components/dashboard/shared/Dash";

type Tab = "export" | "import";

export default function ImportExport() {
  const [tab, setTab] = useState<Tab>("export");

  return (
    <div>
      <DashPageHeader title="Import & Export" subtitle="Bulk manage your catalog data via CSV"
        breadcrumbs={[{ label: "Catalog" }, { label: "Import & Export" }]}
        actions={<DashBtn variant="secondary" href="/dashboard/products">← Back to Products</DashBtn>} />

      <DashTabs<Tab> tabs={[{ id: "export", label: "Export" }, { id: "import", label: "Import" }]} active={tab} onChange={setTab} />

      {tab === "export" && (
        <DashSection title="Export Products" subtitle="Download your full catalog as a CSV (WooCommerce-compatible columns)">
          <p className="mb-4 text-[13px] leading-relaxed text-muted">
            The export includes every product with name, SKU, prices, category, descriptions and image URLs. Use it for backups, bulk edits in a spreadsheet, or migrating data.
          </p>
          <a href="/api/products/export" download>
            <DashBtn icon="↓">Download Products CSV</DashBtn>
          </a>
          <p className="mt-3 text-[12px] text-muted">Tip: this same file works as an import template - edit it in Excel/Sheets and keep the column headers.</p>
        </DashSection>
      )}

      {tab === "import" && (
        <>
          <DashSection title="Import Products" subtitle="Upload a CSV to add or update products in bulk">
            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line bg-panel px-6 py-12 text-center dark:border-white/10 dark:bg-white/5">
              <span className="mb-2 text-4xl opacity-30">📄</span>
              <span className="text-[15px] font-semibold text-charcoal dark:text-cream">Drag &amp; drop your CSV here</span>
              <span className="mt-1.5 text-[13px] text-muted">or <span className="font-medium text-gold">browse files</span></span>
              <span className="mt-3 text-[11px] text-muted">Accepted: .csv · WooCommerce product export format</span>
              <input type="file" accept=".csv" className="hidden" disabled />
            </label>
          </DashSection>
          <div className="rounded-lg bg-blue-50 px-4 py-3 text-[12px] leading-relaxed text-blue-600">
            💡 Bulk CSV import runs through the guided <strong>Migration</strong> process so categories, images and SKUs are matched safely (this is how your current 60 products were loaded). For day-to-day changes, add/edit products on the Products screen, or export → edit → re-import via migration. Want a one-off bulk import? Send me the CSV and I&apos;ll run it.
          </div>
        </>
      )}
    </div>
  );
}
