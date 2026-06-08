"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";
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

  useEffect(() => {
    load();
  }, [load]);

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
      key: "name",
      header: "Collection",
      render: (c) => (
        <div>
          <p className="font-medium">{c.name}</p>
          <p className="text-xs text-charcoal/50 dark:text-cream/50">{c.slug}</p>
        </div>
      ),
    },
    { key: "parent", header: "Parent", render: (c) => c.parent?.name ?? "—" },
    { key: "products_count", header: "Products", render: (c) => c.products_count },
    { key: "status", header: "Status", render: (c) => <Badge tone={statusTone(c.status)}>{c.status}</Badge> },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setToDelete(c);
          }}
          className="text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold">Collections</h2>
        <Link href="/dashboard/collections/new">
          <Button size="sm">+ New Collection</Button>
        </Link>
      </div>

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
        title={`Delete '${toDelete?.name}'?`}
        message={`Its ${toDelete?.products_count ?? 0} product(s) will be kept but become uncategorized.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
