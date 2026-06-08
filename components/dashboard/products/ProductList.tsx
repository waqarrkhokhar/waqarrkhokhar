"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Badge, statusTone } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { PKR, type Catalog, type ProductRow, type ProductHealth } from "./types";

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

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      sort,
      order,
    });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (categoryId) params.set("category_id", categoryId);

    const res = await apiGet<{
      data: ProductRow[];
      pagination: { totalPages: number };
    }>(`/api/products?${params.toString()}`);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setRows(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
    setSelected([]);
  }, [page, sort, order, search, status, categoryId, toast]);

  useEffect(() => {
    apiGet<{ data: Catalog }>("/api/catalog").then(
      (r) => r.ok && setCatalog(r.data.data),
    );
    apiGet<{ data: ProductHealth }>("/api/products/health").then(
      (r) => r.ok && setHealth(r.data.data),
    );
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function toggleSort(key: string) {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSort(key);
      setOrder("asc");
    }
  }

  async function bulk(updates: Record<string, unknown>, label: string) {
    const res = await apiSend("/api/products/bulk", "PATCH", { ids: selected, updates });
    if (!res.ok) return toast.error(res.error);
    toast.success(`${label} — ${selected.length} product(s)`);
    loadProducts();
    setHealthDirty();
  }

  function setHealthDirty() {
    apiGet<{ data: ProductHealth }>("/api/products/health").then(
      (r) => r.ok && setHealth(r.data.data),
    );
  }

  const columns: Column<ProductRow>[] = [
    {
      key: "image",
      header: "",
      className: "w-14",
      render: (p) =>
        p.primary_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.primary_image}
            alt=""
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-md bg-black/5 dark:bg-white/10" />
        ),
    },
    {
      key: "name",
      header: "Product",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium">{p.name}</p>
          <p className="text-xs text-charcoal/50 dark:text-cream/50">
            {p.sku || "No SKU"} · {p.images_count} image(s)
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (p) => p.category?.name ?? "—",
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (p) =>
        p.sale_price ? (
          <span>
            <span className="font-medium">{PKR(p.sale_price)}</span>{" "}
            <span className="text-xs text-charcoal/40 line-through dark:text-cream/40">
              {PKR(p.price)}
            </span>
          </span>
        ) : (
          PKR(p.price)
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <Badge tone={statusTone(p.status)}>{p.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-2xl font-semibold">Products</h2>
        <div className="flex gap-2">
          <a href="/api/products/export" download>
            <Button variant="secondary" size="sm">Export CSV</Button>
          </a>
          <Link href="/dashboard/products/new">
            <Button size="sm">+ New Product</Button>
          </Link>
        </div>
      </div>

      {/* Health cards */}
      {health && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Published", value: health.published },
            { label: "Draft", value: health.draft },
            { label: "Archived", value: health.archived },
            { label: "Missing images", value: health.missing_images },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-2xl font-semibold">{c.value}</p>
              <p className="text-xs text-charcoal/60 dark:text-cream/60">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            loadProducts();
          }}
          className="flex-1 min-w-48"
        >
          <Input
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-40"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
          <option value="scheduled">Scheduled</option>
        </Select>
        <Select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          className="w-52"
        >
          <option value="">All collections</option>
          {catalog?.collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parent_name} › {c.name}
            </option>
          ))}
        </Select>
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
            <Button size="sm" onClick={() => bulk({ status: "published" }, "Published")}>
              Publish
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => bulk({ status: "archived" }, "Archived")}
            >
              Archive
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => bulk({ is_featured: true }, "Featured")}
            >
              Feature
            </Button>
          </>
        }
      />
    </div>
  );
}
