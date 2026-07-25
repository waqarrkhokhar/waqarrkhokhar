"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { apiSend } from "@/lib/api/client";
import MediaPicker from "@/components/dashboard/shared/MediaPicker";

export type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export default function ProductImages({
  productId,
  images,
  onChange,
}: {
  productId: string;
  images: ProductImage[];
  onChange: () => void;
}) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  async function addFromLibrary(urls: string[]) {
    setBusy(true);
    let added = 0;
    for (const u of urls) {
      const res = await apiSend(base, "POST", { url: u });
      if (res.ok) added++;
    }
    setBusy(false);
    if (added) { toast.success(`${added} image(s) added`); onChange(); }
    else toast.error("Could not add images");
  }

  const base = `/api/products/${productId}/images`;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  async function addByUrl() {
    if (!url.trim()) return;
    setBusy(true);
    const res = await apiSend(base, "POST", { url: url.trim() });
    setBusy(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Image added");
    setUrl("");
    onChange();
  }

  async function upload(file: File) {
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "products");
    const up = await fetch("/api/media/upload", { method: "POST", body: form });
    const json = await up.json().catch(() => ({}));
    if (!up.ok) {
      setBusy(false);
      return toast.error(json.error ?? "Upload failed");
    }
    const res = await apiSend(base, "POST", { url: json.data.url });
    setBusy(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Image uploaded");
    onChange();
  }

  async function setPrimary(id: string) {
    // Making an image primary moves it to the front, so "primary" always means
    // the first image — matching what the storefront shows as the main photo.
    const nextIds = [id, ...sorted.filter((i) => i.id !== id).map((i) => i.id)];
    const res = await apiSend(base, "PATCH", { reorder: nextIds });
    if (!res.ok) return toast.error(res.error);
    toast.success("Primary image set");
    onChange();
  }

  async function reorderTo(targetId: string) {
    if (!dragId || dragId === targetId) { setDragId(null); setOverId(null); return; }
    const ids = sorted.map((i) => i.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    setDragId(null);
    setOverId(null);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    const res = await apiSend(base, "PATCH", { reorder: ids });
    if (!res.ok) return toast.error(res.error);
    onChange();
  }

  async function remove(id: string) {
    const res = await apiSend(`${base}?image_id=${id}`, "DELETE");
    if (!res.ok) return toast.error(res.error);
    toast.success("Image removed");
    onChange();
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...sorted];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    const res = await apiSend(base, "PATCH", { reorder: next.map((i) => i.id) });
    if (!res.ok) return toast.error(res.error);
    onChange();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Paste an image URL…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={addByUrl} loading={busy} size="sm">
            Add
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setPickerOpen(true)}
          disabled={busy}
        >
          Choose from Library
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileRef.current?.click()}
          loading={busy}
        >
          Upload file
        </Button>
      </div>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelectMany={addFromLibrary} folder="products" title="Add Product Images" />

      {sorted.length === 0 ? (
        <p className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-charcoal/60 dark:border-white/10 dark:text-cream/60">
          No images yet. Add one by URL or upload a file.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted">
            🖱️ Drag images to reorder them. The <strong>first</strong> image is the main photo shown on the store; the rest follow in this order.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {sorted.map((img, i) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => setDragId(img.id)}
                onDragOver={(e) => { e.preventDefault(); if (overId !== img.id) setOverId(img.id); }}
                onDrop={() => reorderTo(img.id)}
                onDragEnd={() => { setDragId(null); setOverId(null); }}
                title="Drag to reorder"
                className={`cursor-move overflow-hidden rounded-xl border transition ${
                  dragId === img.id ? "border-gold opacity-40"
                  : overId === img.id ? "border-gold ring-2 ring-gold/40"
                  : "border-line dark:border-white/10"
                }`}
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt_text ?? ""} className="pointer-events-none h-32 w-full object-cover" />
                  <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy/80 text-[11px] font-semibold text-white">{i + 1}</span>
                </div>
                <div className="space-y-2 p-2">
                  {i === 0 ? (
                    <Badge tone="success">Main photo</Badge>
                  ) : (
                    <button
                      onClick={() => setPrimary(img.id)}
                      className="text-xs text-gold hover:underline"
                    >
                      Make main photo
                    </button>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-2 text-charcoal/60 dark:text-cream/60">
                      <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier" className="disabled:opacity-30">←</button>
                      <button onClick={() => move(i, 1)} disabled={i === sorted.length - 1} aria-label="Move later" className="disabled:opacity-30">→</button>
                    </div>
                    <button
                      onClick={() => remove(img.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
