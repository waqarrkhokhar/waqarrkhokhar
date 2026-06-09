"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type Slide = {
  image: string | null;
  subtitle: string;
  title: string;
  desc: string;
  cta: string;
  link: string;
};

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1 || paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n, paused]);

  if (n === 0) return null;

  return (
    <section
      className="relative h-[520px] overflow-hidden bg-navy sm:h-[600px] lg:h-[700px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, idx) => (
        <div key={idx} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: idx === i ? 1 : 0 }}>
          {s.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.image} alt="" className="h-full w-full object-cover opacity-50" />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(transparent 40%, rgba(15,29,53,0.85))" }} />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-6 pb-10 sm:px-12 sm:pb-12">
        <p className="text-[11px] uppercase tracking-[4px] text-gold">{slides[i].subtitle}</p>
        <h1 className="mt-2 whitespace-pre-line font-heading text-[38px] font-semibold leading-[1.15] text-white sm:text-[52px] lg:text-[60px]">
          {slides[i].title}
        </h1>
        <p className="mt-2 max-w-md text-sm text-white/65">{slides[i].desc}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={slides[i].link} className="bg-gold px-7 py-3 text-[13px] font-semibold uppercase tracking-wide text-navy transition hover:bg-gold/90">
            {slides[i].cta}
          </Link>
        </div>
      </div>

      {n > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="h-2 rounded-full transition-all"
              style={{ width: idx === i ? 24 : 8, background: idx === i ? "#C9A84C" : "rgba(255,255,255,0.4)" }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
