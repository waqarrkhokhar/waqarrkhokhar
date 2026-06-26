"use client";

import { useCallback, useEffect, useState } from "react";
import { DashPageHeader, DashBadge, DashBtn } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type TrashType = "product" | "blog" | "collection" | "parent" | "page" | "promotion" | "review";
type Item = { type: TrashType; label: string; id: string; name: string; extra: string | null; deleted_at: string };

const rowId = (it: Item) => `${it.type}:${it.id}`;

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function TrashManager() {
  const toast = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirmPurge, setConfirmPurge] = useState<{ items: Item[]; all?: boolean } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await apiGet<{ data: Item[] }>("/api/trash");
    setLoading(false);
    if (r.ok) setItems(r.data.data);
    else toast.error(r.error);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  // Restore one or many. The list updates instantly; we only reload on error.
  async function restore(targets: Item[]) {
    if (busy || targets.length === 0) return;
    setBusy(true);
    const ids = new Set(targets.map(rowId));
    const prev = items;
    setItems((cur) => cur.filter((it) => !ids.has(rowId(it))));
    setSelected((cur) => cur.filter((id) => !ids.has(id)));

    const r = await apiSend("/api/trash", "POST", { items: targets.map((t) => ({ type: t.type, id: t.id })) });
    setBusy(false);
    if (!r.ok) { setItems(prev); return toast.error(r.error); }
    toast.success(targets.length === 1 ? `${targets[0].label} restored` : `${targets.length} items restored`);
  }

  // Permanently delete one, many, or empty the whole trash.
  async function purge(targets: Item[], all?: boolean) {
    if (busy) return;
    setBusy(true);
    const prev = items;
    if (all) setItems([]);
    else {
      const ids = new Set(targets.map(rowId));
      setItems((cur) => cur.filter((it) => !ids.has(rowId(it))));
    }
    setSelected([]);

    const r = await apiSend("/api/trash", "DELETE", all ? { all: true } : { items: targets.map((t) => ({ type: t.type, id: t.id })) });
    setBusy(false);
    if (!r.ok) { setItems(prev); return toast.error(r.error); }
    toast.success(all ? "Trash emptied" : targets.length === 1 ? `${targets[0].label} permanently deleted` : `${targets.length} items permanently deleted`);
  }

  const selectedItems = items.filter((it) => selected.includes(rowId(it)));

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
          <DashBtn size="sm" variant="secondary" onClick={() => restore([it])} disabled={busy}>↩ Restore</DashBtn>
          <DashBtn size="sm" variant="danger" onClick={() => setConfirmPurge({ items: [it] })} disabled={busy}>Delete forever</DashBtn>
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
        actions={
          items.length > 0 && (
            <DashBtn variant="danger" onClick={() => setConfirmPurge({ items: [], all: true })} disabled={busy}>
              Empty Trash ({items.length})
            </DashBtn>
          )
        }
      />

      <DashTable
        columns={columns}
        rows={items}
        getId={rowId}
        loading={loading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        emptyTitle="Trash is empty"
        emptyDescription="Anything you delete - products, collections, blog posts, pages, reviews - lands here first."
        bulkActions={
          <>
            <Button size="sm" onClick={() => restore(selectedItems)}>↩ Restore {selectedItems.length}</Button>
            <Button size="sm" variant="danger" onClick={() => setConfirmPurge({ items: selectedItems })}>Delete forever</Button>
          </>
        }
      />

      <ConfirmDialog
        open={!!confirmPurge}
        onClose={() => setConfirmPurge(null)}
        onConfirm={() => {
          const c = confirmPurge;
          setConfirmPurge(null);
          if (c) purge(c.items, c.all);
        }}
        title={confirmPurge?.all ? "Empty the trash?" : "Delete forever?"}
        message={
          confirmPurge?.all
            ? `Permanently delete all ${items.length} item(s) in the trash? This cannot be undone.`
            : confirmPurge && confirmPurge.items.length === 1
              ? `Permanently delete "${confirmPurge.items[0].name}"? This cannot be undone.`
              : `Permanently delete ${confirmPurge?.items.length ?? 0} selected item(s)? This cannot be undone.`
        }
        confirmLabel={confirmPurge?.all ? "Empty Trash" : "Delete forever"}
        danger
      />
    </div>
  );
}
