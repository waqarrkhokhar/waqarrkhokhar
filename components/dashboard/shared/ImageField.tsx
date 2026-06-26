"use client";

import { useState } from "react";
import { DashBtn } from "@/components/dashboard/shared/Dash";
import MediaPicker from "@/components/dashboard/shared/MediaPicker";

/**
 * Single-image form field with a thumbnail preview and a "Choose from Library
 * or Upload" picker. Use anywhere a single image URL is set (banners, OG
 * images, logos, hero slides, etc.).
 */
export default function ImageField({
  label,
  value,
  onChange,
  helper,
  folder = "media",
  dark,
  disabled,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  helper?: string;
  folder?: string;
  dark?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      {label && <label className="mb-1.5 block text-xs font-medium text-ink dark:text-cream">{label}</label>}
      <div className="flex items-center gap-3">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line dark:border-white/10 ${dark ? "bg-navy" : "bg-cream/40 dark:bg-white/5"}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label ?? ""} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[10px] text-muted">No image</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DashBtn variant="ghost" onClick={() => setOpen(true)} disabled={disabled}>{value ? "Change" : "Choose image"}</DashBtn>
          {value && (
            <button type="button" onClick={() => onChange("")} disabled={disabled} className="text-xs font-medium text-red-600 hover:underline disabled:opacity-40">Remove</button>
          )}
        </div>
      </div>
      {helper && <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{helper}</p>}
      <MediaPicker open={open} onClose={() => setOpen(false)} onSelect={onChange} folder={folder} title={label ? `Select ${label}` : "Select Image"} />
    </div>
  );
}
