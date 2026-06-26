"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashPageHeader, DashBtn, DashBadge } from "@/components/dashboard/shared/Dash";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { PKR, type Catalog, type ProductRow, type ProductHealth } from "./types";

const statusBadge = (s: string) =>
  s === "published" ? "published" : s === "archived" ? "archived" : s === "scheduled" ? "scheduled" : "draft";

export default function ProductList() {
  const router = useRouter();
  const toast = useToast();

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [health, setHealth] = useState<ProductHealth | null>(null);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmDel, setConfirmDel] = useState<ProductRow | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const loadHealth = useCallback(() => {
    apiGet<{ data: ProductHealth }>("/api/products/health").then((r) => r.ok && setHealth(r.data.data));
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20", sort, order });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (categoryId) params.set("category_id", categoryId);
    const res = await apiGet<{ data: ProductRow[]; pagination: { totalPages: number } }>(`/api/products?${params}`);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
    setSelected([]);
  }, [page, sort, order, search, status, categoryId, toast]);

  useEffect(() => {
    apiGet<{ data: Catalog }>("/api/catalog").then((r) => r.ok && setCatalog(r.data.data));
    loadHealth();
  }, [loadHealth]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  function toggleSort(key: string) {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc");
    else { setSort(key); setOrder("asc"); }
  }

  async function bulk(updates: Record<string, unknown>, label: string) {
    const res = await apiSend("/api/products/bulk", "PATCH", { ids: selected, updates });
    if (!res.ok) return toast.error(res.error);
    toast.success(`${label} - ${selected.length} product(s)`);
    loadProducts(); loadHealth();
  }

  async function duplicate(p: ProductRow) {
    const res = await apiSend<{ data: { id: string } }>(`/api/products/${p.id}/duplicate`, "POST");
    if (!res.ok) return toast.error(res.error);
    toast.success(`"${p.name}" duplicated`);
    router.push(`/dashboard/products/${res.data.data.id}`);
  }

  async function del() {
    if (!confirmDel) return;
    const target = confirmDel;
    setConfirmDel(null);
    // Remove the row instantly; restore it if the request fails.
    const prev = rows;
    setRows((cur) => cur.filter((r) => r.id !== target.id));
    const res = await apiSend(`/api/products/${target.id}`, "DELETE");
    if (!res.ok) { setRows(prev); return toast.error(res.error); }
    toast.success(`"${target.name}" moved to trash`);
    loadHealth();
  }

  const columns: Column<ProductRow>[] = [
    {
      key: "image", header: "", className: "w-14",
      render: (p) => p.primary_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.primary_image} alt="" referrerPolicy="no-referrer" className="h-10 w-10 rounded-md bg-cream object-cover" />
      ) : <div className="h-10 w-10 rounded-md bg-cream dark:bg-white/10" />,
    },
    {
      key: "name", header: "Product", sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium text-charcoal dark:text-cream">{p.name.length > 44 ? p.name.slice(0, 44) + "…" : p.name}</p>
          <p className="mt-0.5 text-[11px] text-muted">{p.sku || "No SKU"} · {p.images_count} image(s)</p>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (p) => <span className="whitespace-nowrap">{p.category?.name ?? "-"}</span> },
    {
      key: "price", header: "Price", sortable: true,
      render: (p) => (
        <div className="whitespace-nowrap">
          <div className="font-medium">{p.price != null ? `PKR ${p.price.toLocaleString()}` : "-"}</div>
          {p.sale_price && <div className="text-[11px] text-green-600">Sale: PKR {p.sale_price.toLocaleString()}</div>}
        </div>
      ),
    },
    { key: "status", header: "Status", render: (p) => <DashBadge status={statusBadge(p.status)} label={p.status} /> },
    {
      key: "actions", header: "", className: "w-28",
      render: (p) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => router.push(`/dashboard/products/${p.id}`)} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
          <button onClick={() => duplicate(p)} title="Duplicate" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">📋</button>
          <button onClick={() => setConfirmDel(p)} title="Move to Trash" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashPageHeader
        title="Products"
        subtitle={`${health?.total ?? "…"} products in your catalog`}
        breadcrumbs={[{ label: "Catalog" }, { label: "Products" }]}
        actions={
          <>
            <a href="/api/products/export" download><DashBtn variant="secondary" icon="↓">Export CSV</DashBtn></a>
            <DashBtn variant="secondary" icon="↑" href="/dashboard/import-export">Import</DashBtn>
            <DashBtn icon="+" href="/dashboard/products/new">Add Product</DashBtn>
          </>
        }
      />

      {/* Toolbar: search + filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); loadProducts(); }} className="relative min-w-[220px] flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full rounded-md border border-line bg-white py-2.5 pl-9 pr-3 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5" />
        </form>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          className="rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5">
          <option value="">All collections</option>
          {catalog?.collections.map((c) => <option key={c.id} value={c.id}>{c.parent_name} › {c.name}</option>)}
        </select>
      </div>

      <DashTable
        columns={columns}
        rows={rows}
        getId={(p) => p.id}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        sort={sort}
        order={order}
        onSortChange={toggleSort}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        onRowClick={(p) => router.push(`/dashboard/products/${p.id}`)}
        emptyTitle="No products found"
        emptyDescription="Try adjusting filters, or create your first product."
        bulkActions={
          <>
            <Button size="sm" onClick={() => bulk({ status: "published" }, "Published")}>Publish</Button>
            <Button size="sm" variant="secondary" onClick={() => bulk({ status: "archived" }, "Archived")}>Archive</Button>
            <Button size="sm" variant="secondary" onClick={() => bulk({ is_featured: true }, "Featured")}>Feature</Button>
          </>
        }
      />

      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={del}
        title="Move product to trash"
        message={confirmDel ? `Move "${confirmDel.name}" to trash? It will be removed from the storefront. Restore it any time from the Trash page.` : ""}
        confirmLabel="Move to Trash"
        danger
      />
    </div>
  );
}
