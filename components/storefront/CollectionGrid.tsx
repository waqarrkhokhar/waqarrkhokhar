"use client";

import { useMemo, useState } from "react";
import type { StoreProduct } from "@/lib/storefront/data";
import ProductCard from "./ProductCard";

const PAGE = 8;
const FABRICS = ["Velvet", "Boucle", "Linen", "Corduroy", "Leather", "Wingback", "Tufted", "Convertible", "Futon"];

export default function CollectionGrid({ products }: { products: StoreProduct[] }) {
  const [sort, setSort] = useState<"popularity" | "price-low" | "price-high">("popularity");
  const [filter, setFilter] = useState("All");
  const [count, setCount] = useState(PAGE);

  // Build filter chips from fabric keywords that actually appear, + a price band.
  const filters = useMemo(() => {
    const present = FABRICS.filter((kw) => products.filter((p) => p.name.toLowerCase().includes(kw.toLowerCase())).length >= 2);
    const hasUnder20 = products.some((p) => (p.sale_price ?? p.price ?? 1e9) < 20000);
    return ["All", ...present, ...(hasUnder20 ? ["Under 20K"] : [])];
  }, [products]);

  const filtered = useMemo(() => {
    if (filter === "All") return products;
    if (filter === "Under 20K") return products.filter((p) => (p.sale_price ?? p.price ?? 1e9) < 20000);
    const t = filter.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(t) || (p.category_name ?? "").toLowerCase().includes(t));
  }, [filter, products]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const price = (p: StoreProduct) => p.sale_price ?? p.price ?? 0;
    if (sort === "price-low") list.sort((a, b) => price(a) - price(b));
    if (sort === "price-high") list.sort((a, b) => price(b) - price(a));
    return list;
  }, [sort, filtered]);

  const visible = sorted.slice(0, count);
  const remaining = Math.max(0, sorted.length - count);

  return (
    <div>
      {/* Filter chips */}
      {filters.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3 md:px-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCount(PAGE); }}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-[11px] font-medium transition ${
                filter === f ? "border-navy bg-navy text-white" : "border-[#ddd] text-charcoal hover:border-navy"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Sort bar */}
      <div className="flex items-center justify-between border-y border-black/[0.06] px-5 py-2.5 md:px-10">
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="cursor-pointer bg-transparent text-xs text-[#888] outline-none">
          <option value="popularity">Sort: Popularity</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
        <span className="text-[11px] text-[#bbb]">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 px-5 py-5 md:grid-cols-4 md:gap-6 md:px-10">
          {visible.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-[#999]">No products match this filter.</p>
          <button onClick={() => setFilter("All")} className="mt-3 rounded bg-navy px-6 py-2.5 text-xs font-semibold text-white">Show All Products</button>
        </div>
      )}

      {/* Load more */}
      {remaining > 0 && (
        <div className="px-5 pb-8 pt-1 text-center md:px-10">
          <button onClick={() => setCount(count + PAGE)} className="w-full border border-navy px-6 py-3.5 text-[13px] font-semibold tracking-wide text-navy transition hover:bg-navy hover:text-white">
            Load More ({remaining} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
