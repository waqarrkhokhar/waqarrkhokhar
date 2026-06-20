"use client";

import { useEffect, useRef, useState } from "react";
import { DashPageHeader, DashSection, DashTabs, DashBtn } from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Tab = "export" | "import";
type Result = { created: number; updated: number; skipped: number; total: number; errors: string[] };
type UndoInfo = { available: boolean; at?: string; by?: string; summary?: { created: number; updated: number } };

export default function ImportExport() {
  const [tab, setTab] = useState<Tab>("export");
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [undo, setUndo] = useState<UndoInfo | null>(null);
  const [confirmUndo, setConfirmUndo] = useState(false);
  const [undoing, setUndoing] = useState(false);

  const loadUndo = () => apiGet<{ data: UndoInfo }>("/api/products/import/undo").then((r) => r.ok && setUndo(r.data.data));
  useEffect(() => { loadUndo(); }, []);

  async function revertImport() {
    setUndoing(true);
    const res = await apiSend<{ data: { trashed: number; restored: number } }>("/api/products/import/undo", "POST");
    setUndoing(false);
    setConfirmUndo(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`Import reverted — ${res.data.data.trashed} removed, ${res.data.data.restored} restored`);
    setResult(null);
    setUndo({ available: false });
  }

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".csv")) return toast.error("Please choose a .csv file");
    setImporting(true);
    setResult(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { toast.error(json.error ?? "Import failed"); return; }
      setResult(json.data as Result);
      toast.success(`Imported: ${json.data.created} added, ${json.data.updated} updated`);
      loadUndo();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

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
          {undo?.available && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="text-[13px] text-amber-800">
                ↩ A recent import can be reverted{undo.summary ? ` (${undo.summary.created} added, ${undo.summary.updated} updated)` : ""}{undo.at ? ` · ${new Date(undo.at).toLocaleString()}` : ""}.
              </div>
              <DashBtn variant="secondary" onClick={() => setConfirmUndo(true)}>Undo last import</DashBtn>
            </div>
          )}
          <DashSection title="Import Products" subtitle="Upload a CSV to add or update products in bulk">
            <div
              onClick={() => !importing && fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
              className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line bg-panel px-6 py-12 text-center transition hover:border-gold dark:border-white/10 dark:bg-white/5"
            >
              <span className="mb-2 text-4xl opacity-30">📄</span>
              <span className="text-[15px] font-semibold text-charcoal dark:text-cream">{importing ? "Importing…" : "Drag & drop your CSV here"}</span>
              <span className="mt-1.5 text-[13px] text-muted">or <span className="font-medium text-gold">browse files</span></span>
              <span className="mt-3 text-[11px] text-muted">Accepted: .csv · WooCommerce product export format</span>
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
          </DashSection>

          {result && (
            <DashSection title="Import Result">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-green-50 px-4 py-3 text-center"><div className="text-[22px] font-bold text-green-600">{result.created}</div><div className="text-[11px] text-muted">Added</div></div>
                <div className="rounded-lg bg-blue-50 px-4 py-3 text-center"><div className="text-[22px] font-bold text-blue-600">{result.updated}</div><div className="text-[11px] text-muted">Updated</div></div>
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-center"><div className="text-[22px] font-bold text-amber-600">{result.skipped}</div><div className="text-[11px] text-muted">Skipped</div></div>
                <div className="rounded-lg bg-panel px-4 py-3 text-center dark:bg-white/5"><div className="text-[22px] font-bold text-charcoal dark:text-cream">{result.total}</div><div className="text-[11px] text-muted">Rows</div></div>
              </div>
              {result.errors.length > 0 && (
                <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-[12px] text-red-600">
                  <div className="mb-1 font-semibold">Some rows had errors:</div>
                  <ul className="list-disc pl-4">{result.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </div>
              )}
              <div className="mt-3"><DashBtn href="/dashboard/products">View Products →</DashBtn></div>
            </DashSection>
          )}

          <div className="rounded-lg bg-blue-50 px-4 py-3 text-[12px] leading-relaxed text-blue-600">
            💡 Products are matched by <strong>SKU</strong> (or slug) — existing ones are updated, new ones are added. The <strong>Categories</strong> column (e.g. <em>Sofas &gt; Sofa Cum Bed</em>) places each product into the right collection and parent category automatically. Image URLs in the <strong>Images</strong> column are attached too. The CSV file itself is never stored — it&apos;s read once and discarded.
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmUndo}
        onClose={() => setConfirmUndo(false)}
        onConfirm={revertImport}
        title="Undo the last import?"
        message="Products added by the import move to Trash; products it changed are restored to their previous values (including images). This affects only the most recent import."
        confirmLabel={undoing ? "Reverting…" : "Undo import"}
        danger
      />
    </div>
  );
}
