"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DashPageHeader, DashBtn } from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Item = { id: string; filename: string; url: string; thumbnail_url: string | null; size_bytes: number | null; folder: string; created_at: string };

const kb = (n: number | null) => (n ? (n > 1024 * 1024 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`) : "—");

export default function MediaLibrary() {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [del, setDel] = useState<Item | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Item[] }>("/api/media?limit=100");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

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

  async function remove() {
    if (!del) return;
    const res = await apiSend(`/api/media/${del.id}`, "DELETE");
    setDel(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Deleted");
    load();
  }

  function copy(url: string) {
    navigator.clipboard?.writeText(url).then(() => toast.success("URL copied"));
  }

  return (
    <div>
      <DashPageHeader title="Media Library" subtitle="Uploaded images, stored in Supabase Storage"
        breadcrumbs={[{ label: "Media Library" }]}
        actions={<DashBtn icon="↑" onClick={() => fileRef.current?.click()}>{uploading ? "Uploading…" : "Upload"}</DashBtn>} />
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(file); e.target.value = ""; }} />

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line py-16 text-center dark:border-white/10">
          <p className="font-heading text-lg text-charcoal dark:text-cream">No media yet</p>
          <p className="mt-1 text-sm text-muted">Upload an image to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {rows.map((m) => (
            <div key={m.id} className="group overflow-hidden rounded-lg border border-line bg-white dark:border-white/10 dark:bg-white/5">
              <div className="relative aspect-square bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.thumbnail_url || m.url} alt={m.filename} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => copy(m.url)} title="Copy URL" className="rounded bg-white/90 px-2 py-1 text-[11px] font-semibold text-charcoal">Copy</button>
                  <button onClick={() => setDel(m)} title="Delete" className="rounded bg-white/90 px-2 py-1 text-[11px] font-semibold text-sale">Delete</button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-[11px] font-medium text-ink dark:text-cream">{m.filename}</p>
                <p className="text-[10px] text-muted">{kb(m.size_bytes)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete image?" message={`Delete "${del?.filename}"? Anything using it will show a broken image.`} confirmLabel="Delete" danger />
    </div>
  );
}
