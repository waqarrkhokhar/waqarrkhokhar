"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { waLink } from "@/lib/whatsapp";

export type Slide = {
  image: string | null;
  subtitle: string;
  title: string; // may contain \n
  desc: string;
  cta: string;
  link: string;
};

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1 || paused) return;
    const t = setInterval(() => setActive((p) => (p + 1) % n), 4000);
    return () => clearInterval(t);
  }, [n, paused]);

  if (n === 0) return null;
  const slide = slides[active];

  return (
    <section
      className="relative h-[520px] overflow-hidden bg-navy md:h-[600px] lg:h-[700px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) =>
        s.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={s.image}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === active ? 0.5 : 0 }}
          />
        ) : null,
      )}

      {/* Content */}
      <div
        className="absolute inset-x-0 bottom-0 px-6 pb-9 pt-10 md:px-12 md:pb-12 md:pt-[60px] lg:max-w-[600px]"
        style={{ background: "linear-gradient(transparent, rgba(15,29,53,0.85))" }}
      >
        <p className="mb-2 text-[11px] uppercase tracking-[4px] text-gold">{slide.subtitle}</p>
        <h1 className="m-0 whitespace-pre-line font-heading text-[38px] font-semibold leading-[1.15] text-white md:text-[52px] lg:text-[60px]">
          {slide.title}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-white/65">{slide.desc}</p>
        <div className="mt-5 flex gap-2.5">
          <Link
            href={slide.link}
            className="bg-gold px-6 py-3 text-[13px] font-semibold tracking-wide text-white"
          >
            {slide.cta}
          </Link>
          <a
            href={waLink("Hi, I'd like to know more about your furniture collection.")}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/30 px-6 py-3 text-[13px] font-medium tracking-wide text-white"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      {/* Arrows */}
      {n > 1 && (
        <>
          <button
            onClick={() => setActive((active - 1 + n) % n)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => setActive((active + 1) % n)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className="h-2 rounded-full transition-all"
                style={{ width: i === active ? 24 : 8, background: i === active ? "#C9A84C" : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        </>
      )}

      {/* Google reviews badge */}
      <a
        href="https://share.google/JuOpyMoYl9RjLjtRs"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-9 right-4 z-[5] flex items-center gap-2 rounded-lg bg-black/50 px-3.5 py-2 backdrop-blur"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09A6.6 6.6 0 015.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 001 12c0 1.77.42 3.44 1.18 4.93z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335" />
        </svg>
        <div className="leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-white">4.8</span>
            <span className="text-gold">★★★★</span>
            <span className="text-white/40">★</span>
          </div>
          <span className="text-[10px] text-white/60">Google Reviews</span>
        </div>
      </a>
    </section>
  );
}
