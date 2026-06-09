"use client";

import { useState } from "react";

export default function AnnouncementBar({
  text = "We Ship Across Pakistan · WhatsApp Us Anytime",
}: {
  text?: string;
}) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="relative bg-navy px-4 py-2 text-center">
      <span className="text-[12.5px] tracking-wide text-gold">{text}</span>
      <button
        onClick={() => setShow(false)}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60 hover:text-gold"
      >
        ✕
      </button>
    </div>
  );
}
