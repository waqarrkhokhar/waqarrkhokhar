"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DashPageHeader, DashBtn, DashSection } from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Item = {
  id: string;
  filename: string;
  url: string;
  thumbnail_url: string | null;
  webp_url: string | null;
  alt_text: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  folder: string;
  created_at: string;
  product?: { name: string; slug: string } | null;
};

const kb = (n: number | null) =>
  n ? (n > 1024 * 1024 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`) : "—";
const dims = (i: Item) => (i.width && i.height ? `${i.width}×${i.height}` : "—");
const fmt = (m: string | null) => (m ? m.split("/").pop()?.toUpperCase() ?? "—" : "—");
const fileLabel = (i: Item) => i.product ? `${i.product.name} - Image` : i.filename;

export default function MediaLibrary() {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [del, setDel] = useState<Item | null>(null);
  const [folder, setFolder] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [sel, setSel] = useState<Item | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Item[] }>("/api/media?limit=500");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const folders = ["all", ...Array.from(new Set(rows.map((r) => r.folder)))];
  const filtered = folder === "all" ? rows : rows.filter((r) => r.folder === folder);
  const shown = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "name") cmp = fileLabel(a).toLowerCase().localeCompare(fileLabel(b).toLowerCase());
    else if (sortBy === "size") cmp = (a.size_bytes ?? 0) - (b.size_bytes ?? 0);
    else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return sortDir === "asc" ? cmp : -cmp;
  });
  const missingAlt = rows.filter((r) => !r.alt_text).length;

  function toggleSelect(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }
  function selectAllShown() { setSelected(new Set(shown.map((i) => i.id))); }
  function clearSelection() { setSelected(new Set()); }
  function exitSelectMode() { setSelectMode(false); clearSelection(); }

  async function bulkDelete() {
    setBulkDeleting(true);
    const res = await apiSend<{ message: string }>("/api/media/bulk-delete", "POST", { ids: Array.from(selected) });
    setBulkDeleting(false);
    setConfirmBulk(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`${selected.size} image(s) deleted`);
    exitSelectMode();
    load();
  }

  async function upload(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file); form.append("folder", "media");
    const res = await fetch("/api/media/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) return toast.error(json.error ?? "Upload failed");
    toast.success("Uploaded");
    load();
  }

  async function syncStorage() {
    setSyncing(true);
    const res = await apiSend<{ data: { added: number } }>("/api/media/sync", "POST", { bucket: "media" });
    setSyncing(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`Added ${res.data.data.added} image(s) from storage`);
    load();
  }

  function openDetail(it: Item) { setSel(it); setAltDraft(it.alt_text ?? ""); }

  async function saveAlt() {
    if (!sel) return;
    const res = await apiSend<{ data: Item }>(`/api/media/${sel.id}`, "PATCH", { alt_text: altDraft || null });
    if (!res.ok) return toast.error(res.error);
    toast.success("Alt text updated");
    setRows((rs) => rs.map((r) => (r.id === sel.id ? { ...r, alt_text: altDraft || null } : r)));
    setSel((s) => (s ? { ...s, alt_text: altDraft || null } : s));
  }

  async function autoGenerateAll() {
    const targets = rows.filter((r) => !r.alt_text);
    if (!targets.length) return;
    for (const t of targets) {
      const alt = t.product?.name || t.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      await apiSend(`/api/media/${t.id}`, "PATCH", { alt_text: alt });
    }
    toast.success(`Alt text added to ${targets.length} image(s)`);
    load();
  }

  async function replaceImage(file: File) {
    if (!sel) return;
    const form = new FormData();
    form.append("file", file); form.append("folder", "media"); form.append("record", "false");
    const up = await fetch("/api/media/upload", { method: "POST", body: form });
    const j = await up.json().catch(() => ({}));
    if (!up.ok) return toast.error(j.error ?? "Replace failed");
    const newUrl = j.data.url as string;
    const res = await apiSend<{ data: Item }>(`/api/media/${sel.id}`, "PATCH", {
      url: newUrl, thumbnail_url: j.data.thumbnail_url, webp_url: j.data.webp_url,
    });
    if (!res.ok) return toast.error(res.error);
    toast.success("Image replaced");
    load();
    setSel((s) => (s ? { ...s, url: newUrl } : s));
  }

  async function remove() {
    if (!del) return;
    const res = await apiSend(`/api/media/${del.id}`, "DELETE");
    setDel(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Image deleted");
    if (sel?.id === del.id) setSel(null);
    load();
  }

  return (
    <div>
      <DashPageHeader title="Media Library" subtitle={`${rows.length} files · stored in Supabase Storage`}
        breadcrumbs={[{ label: "Media" }]}
        actions={
          <>
            {selectMode ? (
              <DashBtn variant="secondary" onClick={exitSelectMode}>Done</DashBtn>
            ) : (
              <DashBtn variant="secondary" onClick={() => setSelectMode(true)}>Select</DashBtn>
            )}
            <DashBtn variant="secondary" icon="🔄" onClick={syncStorage} disabled={syncing}>{syncing ? "Syncing…" : "Sync from Storage"}</DashBtn>
            <DashBtn icon="↑" onClick={() => fileRef.current?.click()}>{uploading ? "Uploading…" : "Upload"}</DashBtn>
          </>
        } />
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />

      <DashSection>
        {/* Filter chips + view / sort controls */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {folders.map((f) => (
            <button key={f} onClick={() => setFolder(f)}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] capitalize transition ${folder === f ? "border-gold bg-gold/15 text-gold" : "border-line text-muted hover:border-gold/50 dark:border-white/10"}`}>
              {f === "all" ? "All Files" : f}
            </button>
          ))}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Sort field */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "name" | "size")}
              className="rounded-md border border-line bg-white px-2.5 py-1.5 text-[12px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5">
              <option value="date">Sort: Date</option>
              <option value="name">Sort: Name</option>
              <option value="size">Sort: Size</option>
            </select>
            {/* Sort direction */}
            <button onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              title={sortDir === "asc" ? "Ascending" : "Descending"}
              className="rounded-md border border-line px-2.5 py-1.5 text-[12px] text-muted transition hover:border-gold/50 dark:border-white/10">
              {sortDir === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
            {/* View toggle */}
            <div className="flex overflow-hidden rounded-md border border-line dark:border-white/10">
              <button onClick={() => setView("grid")} title="Grid view"
                className={`px-2.5 py-1.5 text-[13px] transition ${view === "grid" ? "bg-gold/15 text-gold" : "text-muted hover:bg-black/5 dark:hover:bg-white/10"}`}>▦</button>
              <button onClick={() => setView("list")} title="List view"
                className={`border-l border-line px-2.5 py-1.5 text-[13px] transition dark:border-white/10 ${view === "list" ? "bg-gold/15 text-gold" : "text-muted hover:bg-black/5 dark:hover:bg-white/10"}`}>☰</button>
            </div>
          </div>
        </div>

        {/* Missing-alt warning */}
        {missingAlt > 0 && !selectMode && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[12px] text-amber-700">
            <span>⚠️</span>
            <span>{missingAlt} image{missingAlt > 1 ? "s are" : " is"} missing alt text. <button onClick={autoGenerateAll} className="font-semibold underline">Auto-generate from product names →</button></span>
          </div>
        )}

        {/* Bulk-select toolbar */}
        {selectMode && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-[13px]">
            <span className="font-semibold text-charcoal dark:text-cream">{selected.size} selected</span>
            <button onClick={selectAllShown} className="text-gold hover:underline">Select all ({shown.length})</button>
            {selected.size > 0 && <button onClick={clearSelection} className="text-muted hover:underline">Clear</button>}
            <div className="ml-auto">
              <DashBtn variant="danger" size="sm" disabled={selected.size === 0} onClick={() => setConfirmBulk(true)}>🗑️ Delete {selected.size > 0 ? `(${selected.size})` : ""}</DashBtn>
            </div>
          </div>
        )}

        {/* Grid / List */}
        {loading ? (
          <p className="py-10 text-center text-sm text-muted">Loading…</p>
        ) : shown.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">No images yet. Upload, or click “Sync from Storage”.</p>
        ) : view === "grid" ? (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {shown.map((it) => {
              const isSel = selected.has(it.id);
              return (
                <button key={it.id} onClick={() => (selectMode ? toggleSelect(it.id) : openDetail(it))}
                  className={`group relative aspect-square overflow-hidden rounded-lg border bg-cream transition hover:shadow-card dark:border-white/10 ${isSel ? "border-gold ring-2 ring-gold" : "border-line"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.thumbnail_url || it.url} alt={it.alt_text ?? ""} referrerPolicy="no-referrer" className={`h-full w-full object-cover transition ${isSel ? "scale-95 opacity-90" : ""}`} />
                  {selectMode && (
                    <span className={`absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 text-[11px] font-bold ${isSel ? "border-gold bg-gold text-white" : "border-white bg-black/30 text-transparent"}`}>✓</span>
                  )}
                  {!it.alt_text && !selectMode && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" title="Missing alt text" />}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-4 text-left text-[9px] text-white">
                    {kb(it.size_bytes)} · {dims(it)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line dark:border-white/10">
            {/* Header row */}
            <div className="hidden grid-cols-[auto_1fr_90px_90px_110px] items-center gap-3 border-b border-line bg-panel px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted dark:border-white/10 dark:bg-white/5 sm:grid">
              <span className="w-10" />
              <span>Name</span>
              <span>Size</span>
              <span>Format</span>
              <span>Uploaded</span>
            </div>
            {shown.map((it) => {
              const isSel = selected.has(it.id);
              return (
                <button key={it.id} onClick={() => (selectMode ? toggleSelect(it.id) : openDetail(it))}
                  className={`grid w-full grid-cols-[auto_1fr] items-center gap-3 border-b border-line px-3 py-2 text-left transition last:border-b-0 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/5 sm:grid-cols-[auto_1fr_90px_90px_110px] ${isSel ? "bg-gold/10" : ""}`}>
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.thumbnail_url || it.url} alt={it.alt_text ?? ""} referrerPolicy="no-referrer" className="h-10 w-10 rounded-md border border-line object-cover dark:border-white/10" />
                    {selectMode && (
                      <span className={`absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-bold ${isSel ? "border-gold bg-gold text-white" : "border-white bg-black/40 text-transparent"}`}>✓</span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 truncate text-[13px] font-medium text-charcoal dark:text-cream">
                      {fileLabel(it).length > 50 ? fileLabel(it).slice(0, 50) + "…" : fileLabel(it)}
                      {!it.alt_text && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" title="Missing alt text" />}
                    </span>
                    <span className="truncate text-[11px] text-muted sm:hidden">{kb(it.size_bytes)} · {fmt(it.mime_type)} · {new Date(it.created_at).toLocaleDateString()}</span>
                  </span>
                  <span className="hidden text-[12px] text-muted sm:block">{kb(it.size_bytes)}</span>
                  <span className="hidden text-[12px] text-muted sm:block">{fmt(it.mime_type)}</span>
                  <span className="hidden text-[12px] text-muted sm:block">{new Date(it.created_at).toLocaleDateString()}</span>
                </button>
              );
            })}
          </div>
        )}
      </DashSection>

      {/* Image Details drawer */}
      {sel && (
        <>
          <div onClick={() => setSel(null)} className="fixed inset-0 z-40 bg-black/50" />
          <div className="fixed inset-y-0 right-0 z-50 w-[480px] max-w-[95vw] overflow-y-auto bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.1)] dark:bg-[#191f2e]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4 dark:border-white/10 dark:bg-[#191f2e]">
              <h3 className="m-0 font-heading text-[16px] font-semibold text-navy dark:text-cream">Image Details</h3>
              <button onClick={() => setSel(null)} className="text-[20px] text-muted">×</button>
            </div>

            <div className="flex items-center justify-center border-b border-line bg-panel p-5 dark:border-white/10 dark:bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sel.url} alt={sel.alt_text ?? ""} referrerPolicy="no-referrer" className="max-h-[300px] max-w-full rounded-lg bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]" />
            </div>

            <div className="space-y-[18px] p-5">
              <div>
                <div className="mb-1 text-[11px] uppercase tracking-wide text-muted">File Name</div>
                <div className="text-[14px] font-medium text-charcoal dark:text-cream">{fileLabel(sel)}</div>
              </div>

              {sel.product && (
                <div>
                  <div className="mb-1.5 text-[11px] uppercase tracking-wide text-muted">Used on Product</div>
                  <div className="flex items-center justify-between rounded-lg border border-line bg-panel px-3.5 py-3 dark:border-white/10 dark:bg-white/5">
                    <div>
                      <div className="text-[13px] font-semibold text-navy dark:text-cream">{sel.product.name}</div>
                      <div className="text-[11px] text-muted">/product/{sel.product.slug}/</div>
                    </div>
                    <a href={`/product/${sel.product.slug}/`} target="_blank" rel="noopener noreferrer" className="rounded bg-navy px-3 py-1.5 text-[11px] font-semibold text-white">View →</a>
                  </div>
                </div>
              )}

              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wide text-muted">
                  <span>Alt Text (SEO)</span>
                  {!sel.alt_text && <span className="font-semibold text-red-500">⚠ Missing</span>}
                </div>
                <div className="flex gap-2">
                  <input value={altDraft} onChange={(e) => setAltDraft(e.target.value)} placeholder="Describe this image for SEO…"
                    className="flex-1 rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5" />
                  <button onClick={saveAlt} className="rounded-md bg-gold px-4 text-[12px] font-semibold text-white">Save</button>
                </div>
                <button onClick={() => setAltDraft(sel.product?.name || sel.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "))} className="mt-1.5 text-[11px] font-semibold text-gold">↻ Auto-fill from product name</button>
              </div>

              <div>
                <div className="mb-2 text-[11px] uppercase tracking-wide text-muted">Image Information</div>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { l: "📐 Dimensions", v: dims(sel) },
                    { l: "💾 File Size", v: kb(sel.size_bytes) },
                    { l: "🖼️ Format", v: fmt(sel.mime_type) },
                    { l: "⚡ WebP Version", v: sel.webp_url ? "Generated ✓" : "Not generated" },
                    { l: "📅 Uploaded", v: new Date(sel.created_at).toLocaleDateString() },
                    { l: "📄 Folder", v: sel.folder },
                  ].map((x) => (
                    <div key={x.l} className="rounded-md border border-line bg-panel px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
                      <div className="mb-0.5 text-[10px] text-muted">{x.l}</div>
                      <div className="text-[13px] font-medium text-charcoal dark:text-cream">{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 text-[11px] uppercase tracking-wide text-muted">Image URL</div>
                <div className="flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
                  <span className="flex-1 truncate font-mono text-[11px] text-muted">{sel.url}</span>
                  <button onClick={() => navigator.clipboard?.writeText(sel.url).then(() => toast.success("URL copied"))} className="rounded bg-navy px-2.5 py-1 text-[10px] text-white">Copy</button>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button onClick={() => replaceRef.current?.click()} className="flex-1 rounded-md border border-line bg-panel py-3 text-[12px] font-semibold text-charcoal dark:border-white/10 dark:bg-white/5 dark:text-cream">Replace Image</button>
                <button onClick={() => setDel(sel)} className="flex-1 rounded-md border border-red-200 bg-red-50 py-3 text-[12px] font-semibold text-red-600">Delete Image</button>
              </div>
              <input ref={replaceRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) replaceImage(f); e.target.value = ""; }} />
            </div>
          </div>
        </>
      )}

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove}
        title="Delete this image?" message="It may break product pages that use it. This cannot be undone." confirmLabel="Delete" danger />

      <ConfirmDialog open={confirmBulk} onClose={() => setConfirmBulk(false)} onConfirm={bulkDelete}
        title={`Delete ${selected.size} image(s)?`}
        message="These images will be permanently removed from storage. Any product pages using them may lose those photos. This cannot be undone."
        confirmLabel={bulkDeleting ? "Deleting…" : `Delete ${selected.size}`} danger />
    </div>
  );
}
