"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashPageHeader, DashBtn, DashBadge } from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { BLOG_CATEGORIES } from "@/lib/blog/schema";

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string | null;
  status: string;
  published_at: string | null;
  updated_at: string;
  views?: number;
};

const statusBadge = (s: string) => (s === "published" ? "published" : s === "scheduled" ? "scheduled" : "draft");

export default function BlogList() {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Post | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) p.set("status", status);
    if (category) p.set("category", category);
    if (search) p.set("search", search);
    const res = await apiGet<{ data: Post[]; pagination: { totalPages: number } }>(
      `/api/blog?${p.toString()}`,
    );
    setLoading(false);
    if (!res.ok) return toast.error(res.error);

    // Show posts immediately; fill in GA4 views afterwards (the Google call is
    // slow and must not block the list from rendering).
    setRows(res.data.data);
    setTotalPages(res.data.pagination.totalPages);

    apiGet<{ data: { ga4: { topPages?: { path: string; views: number }[] } | null } }>("/api/analytics/google").then((ga) => {
      if (!ga.ok || !ga.data.data.ga4?.topPages) return;
      const views = new Map<string, number>();
      for (const tp of ga.data.data.ga4.topPages) {
        const m = tp.path.match(/\/blog\/([^/]+)\/?$/);
        if (m) views.set(m[1], tp.views);
      }
      setRows((rs) => rs.map((post) => ({ ...post, views: views.get(post.slug) })));
    });
  }, [page, status, category, search, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove() {
    if (!toDelete) return;
    const res = await apiSend(`/api/blog/${toDelete.id}`, "DELETE");
    setToDelete(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Post moved to trash");
    load();
  }

  const columns: Column<Post>[] = [
    { key: "title", header: "Title", render: (p) => (
      <div><p className="font-medium text-charcoal dark:text-cream">{p.title}</p><p className="text-[11px] text-muted">/blog/{p.slug}/</p></div>
    ) },
    { key: "category", header: "Category", render: (p) => <DashBadge status="scheduled" label={p.category} /> },
    { key: "author", header: "Author", render: (p) => p.author || "Admin" },
    { key: "views", header: "Views", render: (p) => <span className="text-muted">{p.views != null ? p.views.toLocaleString() : "—"}</span> },
    { key: "status", header: "Status", render: (p) => <DashBadge status={statusBadge(p.status)} label={p.status} /> },
    { key: "date", header: "Date", render: (p) => new Date(p.published_at ?? p.updated_at).toLocaleDateString() },
    { key: "actions", header: "", className: "w-20", render: (p) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => router.push(`/dashboard/blog/${p.id}`)} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
        <button onClick={() => setToDelete(p)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
      </div>
    ) },
  ];

  return (
    <div>
      <DashPageHeader
        title="Blog Posts"
        subtitle="Articles, guides and SEO content"
        breadcrumbs={[{ label: "Blog" }]}
        actions={<DashBtn icon="+" href="/dashboard/blog/new">New Post</DashBtn>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} className="relative min-w-[220px] flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="w-full rounded-md border border-line bg-white py-2.5 pl-9 pr-3 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5" />
        </form>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5">
          <option value="">All categories</option>
          {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
        onRowClick={(p) => router.push(`/dashboard/blog/${p.id}`)}
        emptyTitle="No posts yet"
        emptyDescription="Write your first blog post to drive SEO traffic."
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title={`Move '${toDelete?.title}' to trash?`}
        message="It will be hidden from the blog. Restore it any time from the Trash page."
        confirmLabel="Move to Trash"
        danger
      />
    </div>
  );
}
