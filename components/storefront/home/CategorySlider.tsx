"use client";

import Link from "next/link";
import { useRef } from "react";
import type { StoreCategory } from "@/lib/storefront/data";

export default function CategorySlider({ categories }: { categories: StoreCategory[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => ref.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  if (categories.length === 0) return null;

  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar flex gap-3.5 overflow-x-auto px-5 sm:px-10" style={{ scrollSnapType: "x mandatory" }}>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={c.slug}
            className="relative h-60 w-[200px] flex-shrink-0 overflow-hidden bg-cream"
            style={{ scrollSnapAlign: "start" }}
          >
            {c.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            )}
            <div className="absolute inset-0 flex flex-col justify-end p-3.5" style={{ background: "linear-gradient(transparent 40%, rgba(15,29,53,0.75))" }}>
              <p className="font-heading text-[17px] font-semibold text-white">{c.name}</p>
              <p className="text-xs text-white/60">{c.count} item{c.count === 1 ? "" : "s"}</p>
            </div>
          </Link>
        ))}
      </div>
      <button onClick={() => scroll(-1)} aria-label="Previous" className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow sm:flex">‹</button>
      <button onClick={() => scroll(1)} aria-label="Next" className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow sm:flex">›</button>
    </div>
  );
}
