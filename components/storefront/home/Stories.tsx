"use client";

import { useCallback, useEffect, useState } from "react";

export type Story = { title: string; url: string; thumbnail?: string };
type Item = Story & { id: string };

/** Extract the 11-char YouTube video id from any YouTube URL (or a bare id). */
function ytId(url: string): string | null {
  if (!url) return null;
  const patterns = [/youtu\.be\/([\w-]{11})/, /[?&]v=([\w-]{11})/, /\/shorts\/([\w-]{11})/, /\/embed\/([\w-]{11})/, /\/live\/([\w-]{11})/];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
}

const thumbFor = (s: Item) => s.thumbnail || `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`;

export default function Stories({
  stories,
  title = "The Making Of",
  subtitle = "Watch how each ComfyClub piece is crafted — from frame to finish.",
}: {
  stories: Story[];
  title?: string;
  subtitle?: string;
}) {
  const items = stories.map((s) => ({ ...s, id: ytId(s.url) })).filter((s): s is Item => !!s.id);
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-4 text-center">
          <h2 className="m-0 font-body text-[26px] font-semibold text-charcoal md:text-[30px]">{title}</h2>
          {subtitle && <p className="mt-1 text-[14px] text-[#777]">{subtitle}</p>}
        </div>
        <div className="no-scrollbar flex justify-start gap-4 overflow-x-auto pb-2 sm:justify-center">
          {items.map((s, i) => (
            <button key={i} onClick={() => setOpen(i)} className="flex w-[86px] flex-shrink-0 flex-col items-center gap-1.5">
              <span className="rounded-full p-[3px] transition group-hover:scale-105" style={{ background: "linear-gradient(45deg,#C9A84C,#0F1D35)" }}>
                <span className="block rounded-full bg-white p-[2px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbFor(s)} alt={s.title} referrerPolicy="no-referrer" className="h-[68px] w-[68px] rounded-full object-cover" />
                </span>
              </span>
              <span className="line-clamp-2 text-center text-[12px] font-medium leading-tight text-charcoal">{s.title}</span>
            </button>
          ))}
        </div>
      </div>
      {open !== null && <StoryViewer items={items} start={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function StoryViewer({ items, start, onClose }: { items: Item[]; start: number; onClose: () => void }) {
  const [idx, setIdx] = useState(start);
  const next = useCallback(() => setIdx((i) => (i + 1 < items.length ? i + 1 : (onClose(), i))), [items.length, onClose]);
  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const cur = items[idx];

  // Lock background scroll while open.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Keyboard: Esc closes, arrows navigate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  // Auto-advance when a video ends (YouTube postMessage; best-effort).
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data !== "string") return;
      try {
        const d = JSON.parse(e.data);
        if (d.event === "onStateChange" && d.info === 0) next();
      } catch { /* not a YT message */ }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [next]);

  const src = `https://www.youtube-nocookie.com/embed/${cur.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90" onClick={onClose}>
      {/* progress segments */}
      <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[460px] gap-1 p-3">
        {items.map((_, i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <span className="block h-full rounded-full bg-white" style={{ width: i <= idx ? "100%" : "0%" }} />
          </span>
        ))}
      </div>
      <button onClick={onClose} aria-label="Close" className="absolute right-3 top-7 z-30 text-2xl leading-none text-white/90">✕</button>

      {/* vertical player */}
      <div className="relative aspect-[9/16] max-h-[86vh] w-auto max-w-[95vw] overflow-hidden rounded-xl bg-black" style={{ height: "86vh" }} onClick={(e) => e.stopPropagation()}>
        <iframe
          key={cur.id}
          src={src}
          title={cur.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-[15px] font-semibold text-white">{cur.title}</div>
        </div>
      </div>

      {/* nav arrows (in the black margin, so they never block the video) */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        disabled={idx === 0}
        aria-label="Previous"
        className="absolute left-2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white disabled:opacity-30 md:left-6"
      >
        ‹
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Next"
        className="absolute right-2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white md:right-6"
      >
        ›
      </button>
    </div>
  );
}
