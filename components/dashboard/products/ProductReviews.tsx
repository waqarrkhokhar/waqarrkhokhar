"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Review = {
  id: string;
  name: string;
  city: string | null;
  rating: number;
  text: string;
  status: string;
  admin_reply: string | null;
};

/** Reviews tab inside the product editor: quick moderation per product. */
export default function ProductReviews({ productId }: { productId: string }) {
  const toast = useToast();
  const [rows, setRows] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Review[] }>(`/api/reviews?product_id=${productId}&limit=100`);
    setLoading(false);
    if (res.ok) setRows(res.data.data);
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  async function moderate(id: string, status: "approved" | "rejected") {
    const res = await apiSend(`/api/reviews/${id}`, "PATCH", { status });
    if (!res.ok) return toast.error(res.error);
    load();
  }

  if (loading) return <p className="text-sm text-charcoal/60 dark:text-cream/60">Loading…</p>;
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-charcoal/60 dark:border-white/10 dark:text-cream/60">No reviews for this product yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.id} className="rounded-xl border border-black/5 p-3 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{r.name} {r.city ? `· ${r.city}` : ""}</p>
              <p className="text-gold">{"★".repeat(Math.round(r.rating))}{"☆".repeat(5 - Math.round(r.rating))}</p>
            </div>
            <Badge tone={statusTone(r.status)}>{r.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-charcoal/80 dark:text-cream/80">{r.text}</p>
          {r.status !== "approved" && (
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => moderate(r.id, "approved")}>Approve</Button>
              {r.status !== "rejected" && (
                <Button size="sm" variant="secondary" onClick={() => moderate(r.id, "rejected")}>Reject</Button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
