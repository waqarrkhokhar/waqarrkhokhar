"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { whatsappOrder } from "./ProductCard";
import WhatsAppIcon from "./WhatsAppIcon";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={waLink("Hi, I'd like to know more about your furniture collection.")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => whatsappOrder({ name: "General inquiry" }, "general")}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-[90] flex h-13 w-13 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_4px_16px_rgba(37,211,102,0.4)]"
        style={{ height: 52, width: 52 }}
      >
        <WhatsAppIcon size={28} />
      </a>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-20 right-5 z-[89] flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white shadow-md"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
      )}
    </>
  );
}
