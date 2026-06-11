"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/storefront/data";

export default function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return <div className="flex aspect-square w-full items-center justify-center bg-cream text-sm text-charcoal/30">No image</div>;
  }
  const main = images[Math.min(active, images.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden bg-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main.url}
          alt={main.alt ?? name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-[72px] w-[72px] flex-shrink-0 overflow-hidden border bg-cream transition ${
                i === active ? "border-gold" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
