"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { apiGet } from "@/lib/api/client";
import type { ProductRow } from "@/components/dashboard/products/types";

/** Pin specific products by id (used for Trending / Offers manual mode). */
export default function ProductPinPicker({
  ids,
  onChange,
}: {
  ids: string[];
  onChange: (ids: string[]) => void;
}) {
  const toast = useToast();
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductRow[]>([]);
  const [searching, setSearching] = useState(false);

  // Resolve names for currently-pinned ids.
  useEffect(() => {
    const missing = ids.filter((id) => !labels[id]);
    if (missing.length === 0) return;
    apiGet<{ data: ProductRow[] }>(`/api/products?limit=100`).then((r) => {
      if (!r.ok) return;
      const map: Record<string, string> = {};
      for (const p of r.data.data) map[p.id] = p.name;
      setLabels((l) => ({ ...map, ...l }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    const res = await apiGet<{ data: ProductRow[] }>(
      `/api/products?search=${encodeURIComponent(query.trim())}&limit=8`,
    );
    setSearching(false);
    if (!res.ok) return toast.error(res.error);
    setResults(res.data.data.filter((p) => !ids.includes(p.id)));
  }

  function add(p: ProductRow) {
    setLabels((l) => ({ ...l, [p.id]: p.name }));
    onChange([...ids, p.id]);
    setResults((r) => r.filter((x) => x.id !== p.id));
  }

  function remove(id: string) {
    onChange(ids.filter((x) => x !== id));
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-1">
        {ids.map((id) => (
          <li
            key={id}
            className="flex items-center justify-between rounded-lg border border-black/5 px-3 py-1.5 text-sm dark:border-white/10"
          >
            <span>{labels[id] ?? id}</span>
            <button onClick={() => remove(id)} className="text-xs text-red-500 hover:underline">
              Remove
            </button>
          </li>
        ))}
        {ids.length === 0 && (
          <li className="text-sm text-charcoal/50 dark:text-cream/50">No products pinned.</li>
        )}
      </ul>

      <form onSubmit={search} className="flex gap-2">
        <Input placeholder="Search products to pin…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button size="sm" type="submit" loading={searching}>Search</Button>
      </form>

      {results.length > 0 && (
        <ul className="space-y-1">
          {results.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-1.5 text-sm dark:bg-white/[0.04]">
              <span>{p.name}</span>
              <button onClick={() => add(p)} className="text-xs text-gold hover:underline">Pin</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
