"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

type Result = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  sale_price: number | null;
  primary_image: string | null;
  category: { name: string } | null;
};

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&limit=8`);
      const json = await res.json().catch(() => ({}));
      setResults(json.data ?? []);
      setSearched(true);
      trackEvent("search", { search_term: q.trim() });
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="fixed inset-0 z-[300] bg-navy/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-0 max-w-2xl bg-white p-4 shadow-xl sm:mt-20 sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sofas, chairs…"
            className="flex-1 border-b border-charcoal/10 py-2 text-lg outline-none focus:border-gold"
          />
          <button onClick={onClose} aria-label="Close" className="text-charcoal/50 hover:text-charcoal">✕</button>
        </div>

        <div className="mt-3 max-h-[60vh] overflow-y-auto">
          {results.map((r) => {
            const onSale = !!(r.sale_price && r.price && r.sale_price < r.price);
            return (
              <Link
                key={r.id}
                href={`/product/${r.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-cream"
              >
                {r.primary_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.primary_image} alt="" className="h-12 w-12 rounded object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded bg-cream" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">{r.name}</p>
                  <p className="text-xs text-charcoal/50">{r.category?.name ?? ""}</p>
                </div>
                <span className="text-sm font-semibold text-gold">
                  {formatPrice(onSale ? r.sale_price : r.price)}
                </span>
              </Link>
            );
          })}
          {searched && results.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">No products found for “{q}”.</p>
          )}
        </div>
      </div>
    </div>
  );
}
