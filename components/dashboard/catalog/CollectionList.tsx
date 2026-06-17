"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashPageHeader, DashBtn, DashBadge } from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Collection = {
  id: string;
  name: string;
  slug: string;
  status: string;
  is_featured: boolean;
  products_count: number;
  parent: { id: string; name: string } | null;
};

export default function CollectionList() {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Collection | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Collection[] }>("/api/collections");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function remove() {
    if (!toDelete) return;
    const res = await apiSend<{ message: string }>(`/api/collections/${toDelete.id}`, "DELETE");
    setToDelete(null);
    if (!res.ok) return toast.error(res.error);
    toast.success(res.data.message);
    load();
  }

  const columns: Column<Collection>[] = [
    {
      key: "name", header: "Collection",
      render: (c) => (
        <div>
          <p className="font-medium text-navy dark:text-cream">{c.name}</p>
          <p className="text-[11px] text-muted">{c.slug}</p>
        </div>
      ),
    },
    { key: "parent", header: "Parent", render: (c) => c.parent ? <DashBadge status="active" label={c.parent.name} /> : "-" },
    { key: "products_count", header: "Products", render: (c) => c.products_count },
    { key: "is_featured", header: "Featured", render: (c) => (c.is_featured ? "⭐" : "-") },
    { key: "status", header: "Status", render: (c) => <DashBadge status={c.status === "published" ? "published" : "draft"} label={c.status} /> },
    {
      key: "actions", header: "", className: "w-28",
      render: (c) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => router.push(`/dashboard/collections/${c.id}`)} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
          <button onClick={() => window.open(c.slug, "_blank")} title="View Live" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🌐</button>
          <button onClick={() => setToDelete(c)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashPageHeader
        title="Collections"
        subtitle={`${rows.length} collections - used across products, SEO & nav`}
        breadcrumbs={[{ label: "Catalog" }, { label: "Collections" }]}
        actions={<DashBtn icon="+" href="/dashboard/collections/new">Add Collection</DashBtn>}
      />

      <DashTable
        columns={columns}
        rows={rows}
        getId={(c) => c.id}
        loading={loading}
        onRowClick={(c) => router.push(`/dashboard/collections/${c.id}`)}
        emptyTitle="No collections yet"
        emptyDescription="Create a collection under one of your parent categories."
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title={`Move '${toDelete?.name}' to trash?`}
        message="It will be hidden from the storefront. Restore it any time from Settings → Trash."
        confirmLabel="Move to Trash"
        danger
      />
    </div>
  );
}
