"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { apiSend } from "@/lib/api/client";

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

  const base = `/api/products/${productId}/images`;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  async function addByUrl() {
    if (!url.trim()) return;
    setBusy(true);
    const res = await apiSend(base, "POST", { url: url.trim() });
    setBusy(false);
    if (!res.ok) return toast.error(res.error);
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
    onChange();
  }

  async function setPrimary(id: string) {
    const res = await apiSend(base, "PATCH", { image_id: id, is_primary: true });
    if (!res.ok) return toast.error(res.error);
    onChange();
  }

  async function remove(id: string) {
    const res = await apiSend(`${base}?image_id=${id}`, "DELETE");
    if (!res.ok) return toast.error(res.error);
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
          onClick={() => fileRef.current?.click()}
          loading={busy}
        >
          Upload file
        </Button>
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-charcoal/60 dark:border-white/10 dark:text-cream/60">
          No images yet. Add one by URL or upload a file.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sorted.map((img, i) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-black/5 dark:border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt_text ?? ""} className="h-32 w-full object-cover" />
              <div className="space-y-2 p-2">
                {img.is_primary ? (
                  <Badge tone="success">Primary</Badge>
                ) : (
                  <button
                    onClick={() => setPrimary(img.id)}
                    className="text-xs text-gold hover:underline"
                  >
                    Set as primary
                  </button>
                )}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-1">
                    <button onClick={() => move(i, -1)} aria-label="Move left">←</button>
                    <button onClick={() => move(i, 1)} aria-label="Move right">→</button>
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
      )}
    </div>
  );
}
