"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DashBtn } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";
import { apiGet } from "@/lib/api/client";

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  thumbnail_url: string | null;
  folder: string;
  alt_text: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** Single-pick callback. Receives the chosen image URL. */
  onSelect?: (url: string) => void;
  /** Multi-pick callback. Receives all chosen URLs. Enables multi-select mode. */
  onSelectMany?: (urls: string[]) => void;
  /** Storage folder for newly uploaded files. Defaults to "media". */
  folder?: string;
  title?: string;
};

/**
 * Reusable "Choose from Library or Upload" image picker. Drop this in anywhere
 * an image URL is needed. Single-pick by default; pass onSelectMany for
 * multi-pick (e.g. product galleries).
 */
export default function MediaPicker({ open, onClose, onSelect, onSelectMany, folder = "media", title = "Select Image" }: Props) {
  const toast = useToast();
  const multiple = !!onSelectMany;
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: MediaItem[] }>("/api/media?limit=500");
    setLoading(false);
    if (res.ok) setItems(res.data.data);
    else toast.error(res.error);
  }, [toast]);

  useEffect(() => {
    if (open) { setTab("library"); setSearch(""); setPicked(new Set()); load(); }
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const shown = search.trim()
    ? items.filter((i) => (i.filename + (i.alt_text ?? "")).toLowerCase().includes(search.trim().toLowerCase()))
    : items;

  function choose(url: string) {
    if (multiple) {
      setPicked((s) => {
        const n = new Set(s);
        if (n.has(url)) n.delete(url); else n.add(url);
        return n;
      });
    } else {
      onSelect?.(url);
      onClose();
    }
  }

  function confirmMany() {
    if (picked.size === 0) return;
    onSelectMany?.(Array.from(picked));
    onClose();
  }

  async function upload(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await fetch("/api/media/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) { toast.error(json?.error?.message || "Upload failed"); return; }
    const url = json?.data?.url as string;
    toast.success("Uploaded");
    if (multiple) {
      setPicked((s) => new Set(s).add(url));
      setTab("library");
      load();
    } else {
      onSelect?.(url);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-navy">
        {/* Header + tabs */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5 dark:border-white/10">
          <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-cream">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-xl text-muted hover:text-charcoal dark:hover:text-cream">×</button>
        </div>
        <div className="flex gap-1 border-b border-line px-5 dark:border-white/10">
          {(["library", "upload"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-3 py-2.5 text-[13px] font-medium capitalize transition ${tab === t ? "border-gold text-gold" : "border-transparent text-muted hover:text-charcoal dark:hover:text-cream"}`}>
              {t === "library" ? "Media Library" : "Upload New"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "library" ? (
            <>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search images…"
                className="mb-4 w-full rounded-md border border-line bg-white px-3 py-2 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5" />
              {loading ? (
                <p className="py-10 text-center text-sm text-muted">Loading…</p>
              ) : shown.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">No images found. Switch to “Upload New”.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
                  {shown.map((it) => {
                    const isSel = picked.has(it.url);
                    return (
                      <button key={it.id} onClick={() => choose(it.url)}
                        className={`group relative aspect-square overflow-hidden rounded-lg border bg-cream transition hover:shadow-card dark:border-white/10 ${isSel ? "border-gold ring-2 ring-gold" : "border-line"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.thumbnail_url || it.url} alt={it.alt_text ?? ""} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                        {multiple && isSel && (
                          <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-white">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/x-icon,image/vnd.microsoft.icon" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
              <div className="rounded-xl border-2 border-dashed border-line p-10 text-center dark:border-white/15">
                <p className="mb-3 text-sm text-muted">Upload a JPG, PNG or WebP image (max 5MB).</p>
                <DashBtn onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : "Choose File to Upload"}</DashBtn>
              </div>
            </div>
          )}
        </div>

        {/* Footer (multi-select only) */}
        {multiple && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 dark:border-white/10">
            <span className="text-[13px] text-muted">{picked.size} selected</span>
            <div className="flex gap-2">
              <DashBtn variant="secondary" onClick={onClose}>Cancel</DashBtn>
              <DashBtn onClick={confirmMany} disabled={picked.size === 0}>Add {picked.size > 0 ? `${picked.size} ` : ""}image(s)</DashBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
