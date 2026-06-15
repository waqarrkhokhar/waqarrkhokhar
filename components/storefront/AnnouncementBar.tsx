"use client";

import { useState } from "react";

export default function AnnouncementBar({
  text = "We Ship Across Pakistan · WhatsApp Us Anytime",
  enabled = true,
  bg,
  color,
}: {
  text?: string;
  enabled?: boolean;
  bg?: string;
  color?: string;
}) {
  const [show, setShow] = useState(true);
  if (!enabled || !show) return null;
  return (
    <div className="relative px-4 py-2 text-center" style={{ background: bg || "#0F1D35" }}>
      <span className="text-[12.5px] tracking-wide" style={{ color: color || "#C9A84C" }}>{text}</span>
      <button
        onClick={() => setShow(false)}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
        style={{ color: color || "#C9A84C" }}
      >
        ✕
      </button>
    </div>
  );
}
