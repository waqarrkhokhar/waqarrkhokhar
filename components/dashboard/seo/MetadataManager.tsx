"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashPageHeader, DashBadge, DashBtn } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { apiGet } from "@/lib/api/client";

type Row = { key: string; page: string; type: string; url: string; editHref: string };

export default function MetadataManager() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const [prodRes, colRes, blogRes] = await Promise.all([
        apiGet<{ data: { id: string; name: string; slug: string }[] }>("/api/products?limit=200"),
        apiGet<{ data: { id: string; name: string; slug: string }[] }>("/api/collections"),
        apiGet<{ data: { id: string; title: string; slug: string }[] }>("/api/blog?limit=100"),
      ]);
      const out: Row[] = [];
      if (colRes.ok) out.push(...colRes.data.data.map((c) => ({ key: `c${c.id}`, page: c.name, type: "Collection", url: c.slug, editHref: `/dashboard/collections/${c.id}` })));
      if (prodRes.ok) out.push(...prodRes.data.data.map((p) => ({ key: `p${p.id}`, page: p.name, type: "Product", url: `/product/${p.slug}/`, editHref: `/dashboard/products/${p.id}` })));
      if (blogRes.ok) out.push(...blogRes.data.data.map((b) => ({ key: `b${b.id}`, page: b.title, type: "Blog", url: `/blog/${b.slug}/`, editHref: `/dashboard/blog/${b.id}` })));
      setRows(out);
    })();
  }, []);

  const filtered = search ? rows.filter((r) => r.page.toLowerCase().includes(search.toLowerCase())) : rows;

  const columns: Column<Row>[] = [
    { key: "page", header: "Page", render: (r) => <div><div className="font-medium text-charcoal dark:text-cream">{r.page.length > 48 ? r.page.slice(0, 48) + "…" : r.page}</div><div className="text-[11px] text-muted">{r.url}</div></div> },
    { key: "type", header: "Type", render: (r) => <DashBadge status="scheduled" label={r.type} /> },
    { key: "actions", header: "", className: "w-28", render: (r) => (
      <button onClick={(e) => { e.stopPropagation(); router.push(r.editHref); }} className="rounded border border-line px-2.5 py-1 text-xs hover:border-gold dark:border-white/10">Edit metadata</button>
    ) },
  ];

  return (
    <div>
      <DashPageHeader title="Metadata Manager" subtitle="Meta titles, descriptions & keywords - edited in each item's SEO tab"
        breadcrumbs={[{ label: "SEO" }, { label: "Metadata Manager" }]}
        actions={<DashBtn variant="secondary" href="/dashboard/seo">SEO Dashboard</DashBtn>} />
      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..." className="w-full max-w-sm rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5" />
      </div>
      <DashTable columns={columns} rows={filtered} getId={(r) => r.key} onRowClick={(r) => router.push(r.editHref)} emptyTitle="No pages" />
    </div>
  );
}
