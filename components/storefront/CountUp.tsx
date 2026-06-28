"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric value up from 0 when it scrolls into view. Accepts strings
 * like "1,200+", "4.8", "100%", "45+" — keeps the prefix/suffix and decimals.
 */
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^(\D*)([\d,]*\.?\d+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2].replace(/,/g, "")) : 0;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2].includes(".") ? (match[2].split(".")[1]?.length ?? 0) : 0;
  const [display, setDisplay] = useState(match ? value : value);

  useEffect(() => {
    if (!match) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const fmt = (n: number) => prefix + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    setDisplay(fmt(0));
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const dur = 1400;
      let start = 0;
      const tick = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(fmt(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
        else setDisplay(value);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span ref={ref} className={className}>{display}</span>;
}
