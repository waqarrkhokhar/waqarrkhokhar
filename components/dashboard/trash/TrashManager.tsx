"use client";

import { useCallback, useEffect, useState } from "react";
import { DashPageHeader, DashBadge, DashBtn } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type TrashType = "blog" | "collection" | "parent" | "page" | "promotion" | "review";
type Item = { type: TrashType; label: string; id: string; name: string; extra: string | null; deleted_at: string };

const ENDPOINT: Record<TrashType, string> = {
  blog: "/api/blog",
  collection: "/api/collections",
  parent: "/api/parents",
  page: "/api/pages",
  promotion: "/api/promotions",
  review: "/api/reviews",
};

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function TrashManager() {
  const toast = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmPurge, setConfirmPurge] = useState<Item | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await apiGet<{ data: Item[] }>("/api/trash");
    setLoading(false);
    if (r.ok) setItems(r.data.data);
    else toast.error(r.error);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function restore(it: Item) {
    const r = await apiSend("/api/trash", "POST", { type: it.type, id: it.id });
    if (!r.ok) return toast.error(r.error);
    toast.success(`${it.label} restored`);
    load();
  }

  async function purge() {
    if (!confirmPurge) return;
    const it = confirmPurge;
    setConfirmPurge(null);
    const r = await apiSend(`${ENDPOINT[it.type]}/${it.id}?permanent=1`, "DELETE");
    if (!r.ok) return toast.error(r.error);
    toast.success(`${it.label} permanently deleted`);
    load();
  }

  const columns: Column<Item>[] = [
    {
      key: "name", header: "Item",
      render: (it) => (
        <div>
          <div className="font-medium text-charcoal dark:text-cream">{it.name.length > 60 ? it.name.slice(0, 60) + "…" : it.name}</div>
          {it.extra && <div className="mt-0.5 line-clamp-1 text-[11px] text-muted">{it.extra}</div>}
        </div>
      ),
    },
    { key: "type", header: "Type", render: (it) => <DashBadge status="scheduled" label={it.label} /> },
    { key: "deleted_at", header: "Deleted", render: (it) => <span className="whitespace-nowrap text-[12.5px] text-muted">{fmt(it.deleted_at)}</span> },
    {
      key: "actions", header: "", className: "w-52",
      render: (it) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <DashBtn size="sm" variant="secondary" onClick={() => restore(it)}>↩ Restore</DashBtn>
          <DashBtn size="sm" variant="danger" onClick={() => setConfirmPurge(it)}>Delete forever</DashBtn>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashPageHeader
        title="Trash"
        subtitle="Deleted items are kept here so you can restore them. Nothing is lost by accident."
        breadcrumbs={[{ label: "Trash" }]}
      />

      <DashTable
        columns={columns}
        rows={items}
        getId={(it) => `${it.type}:${it.id}`}
        loading={loading}
        emptyTitle="Trash is empty"
        emptyDescription="Anything you delete - products, collections, blog posts, pages, reviews - lands here first."
      />

      <ConfirmDialog
        open={!!confirmPurge}
        onClose={() => setConfirmPurge(null)}
        onConfirm={purge}
        title="Delete forever?"
        message={confirmPurge ? `Permanently delete "${confirmPurge.name}"? This cannot be undone.` : ""}
        confirmLabel="Delete forever"
        danger
      />
    </div>
  );
}
