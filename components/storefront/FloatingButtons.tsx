"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { whatsappOrder } from "./ProductCard";

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
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.8-2.5-1.4-3.5-3.1-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.4 1.9.8 2.6.9 3.5.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2"/></svg>
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
