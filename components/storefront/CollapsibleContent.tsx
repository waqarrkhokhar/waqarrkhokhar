"use client";

import { useState } from "react";

/**
 * Collapsible long-form content for collection pages. Shows a preview with a
 * fade, then expands on "Read More". Applied automatically to every collection.
 */
export default function CollapsibleContent({ html }: { html: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <div
          className={`rich-text overflow-hidden transition-all duration-500 ${open ? "max-h-none" : "max-h-[260px]"}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!open && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{ background: "linear-gradient(transparent, #F7F4EE)" }}
          />
        )}
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-5 inline-flex items-center gap-2 border border-dashed border-gold/50 bg-navy px-7 py-3 text-[13px] font-semibold uppercase tracking-[1.5px] text-white transition hover:bg-navyHover"
      >
        {open ? "Read Less" : "Read More"}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
