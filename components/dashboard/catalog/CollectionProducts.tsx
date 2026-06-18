"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { PKR, type ProductRow } from "@/components/dashboard/products/types";

/** Products tab for the collection editor: assign, remove, reorder. */
export default function CollectionProducts({ collectionId }: { collectionId: string }) {
  const toast = useToast();
  const [assigned, setAssigned] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductRow[]>([]);
  const [searching, setSearching] = useState(false);

  const loadAssigned = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: ProductRow[] }>(
      `/api/products?category_id=${collectionId}&limit=100&sort=sort_order&order=asc`,
    );
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setAssigned(res.data.data);
  }, [collectionId, toast]);

  useEffect(() => {
    loadAssigned();
  }, [loadAssigned]);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    const res = await apiGet<{ data: ProductRow[] }>(
      `/api/products?search=${encodeURIComponent(query.trim())}&limit=10`,
    );
    setSearching(false);
    if (!res.ok) return toast.error(res.error);
    const assignedIds = new Set(assigned.map((a) => a.id));
    setResults(res.data.data.filter((p) => !assignedIds.has(p.id)));
  }

  async function add(id: string) {
    const res = await apiSend(`/api/collections/${collectionId}/products`, "PATCH", { add: [id] });
    if (!res.ok) return toast.error(res.error);
    toast.success("Product added to collection");
    setResults((r) => r.filter((p) => p.id !== id));
    loadAssigned();
  }

  async function removeProduct(id: string) {
    const res = await apiSend(`/api/collections/${collectionId}/products`, "PATCH", { remove: [id] });
    if (!res.ok) return toast.error(res.error);
    toast.success("Product removed from collection");
    loadAssigned();
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...assigned];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setAssigned(next);
    const res = await apiSend(`/api/collections/${collectionId}/reorder`, "PATCH", {
      product_order: next.map((p) => p.id),
    });
    if (!res.ok) {
      toast.error(res.error);
      loadAssigned();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Assigned */}
      <div>
        <h3 className="mb-2 font-medium">In this collection ({assigned.length})</h3>
        {loading ? (
          <p className="text-sm text-charcoal/50 dark:text-cream/50">Loading…</p>
        ) : assigned.length === 0 ? (
          <p className="rounded-lg border border-dashed border-black/10 p-4 text-sm text-charcoal/60 dark:border-white/10 dark:text-cream/60">
            No products yet. Search on the right to add some.
          </p>
        ) : (
          <ul className="space-y-2">
            {assigned.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center gap-2 rounded-lg border border-line p-2 dark:border-white/10"
              >
                <div className="flex flex-col text-xs">
                  <button onClick={() => move(i, -1)} aria-label="Up">▲</button>
                  <button onClick={() => move(i, 1)} aria-label="Down">▼</button>
                </div>
                {p.primary_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.primary_image} alt="" className="h-9 w-9 rounded object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded bg-black/5 dark:bg-white/10" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-charcoal/50 dark:text-cream/50">{PKR(p.sale_price ?? p.price)}</p>
                </div>
                <button
                  onClick={() => removeProduct(p.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search to add */}
      <div>
        <h3 className="mb-2 font-medium">Add products</h3>
        <form onSubmit={search} className="mb-3 flex gap-2">
          <Input
            placeholder="Search by name or SKU…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button size="sm" loading={searching} type="submit">Search</Button>
        </form>
        <ul className="space-y-2">
          {results.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 rounded-lg border border-line p-2 dark:border-white/10"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-xs text-charcoal/50 dark:text-cream/50">
                  {p.category?.name ?? "Uncategorized"}
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => add(p.id)}>Add</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
