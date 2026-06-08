"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Badge, statusTone } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { BLOG_CATEGORIES } from "@/lib/blog/schema";

type Post = {
  id: string;
  title: string;
  category: string;
  status: string;
  published_at: string | null;
  updated_at: string;
};

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
    setRows(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
  }, [page, status, category, search, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove() {
    if (!toDelete) return;
    const res = await apiSend(`/api/blog/${toDelete.id}`, "DELETE");
    setToDelete(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Post deleted");
    load();
  }

  const columns: Column<Post>[] = [
    { key: "title", header: "Title", render: (p) => <span className="font-medium">{p.title}</span> },
    { key: "category", header: "Category", render: (p) => p.category },
    { key: "status", header: "Status", render: (p) => <Badge tone={statusTone(p.status)}>{p.status}</Badge> },
    {
      key: "date",
      header: "Date",
      render: (p) => new Date(p.published_at ?? p.updated_at).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setToDelete(p);
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
        <h2 className="font-heading text-2xl font-semibold">Blog</h2>
        <Link href="/dashboard/blog/new"><Button size="sm">+ New Post</Button></Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} className="flex-1 min-w-48">
          <Input placeholder="Search titles…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-40">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </Select>
        <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="w-48">
          <option value="">All categories</option>
          {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
        onRowClick={(p) => router.push(`/dashboard/blog/${p.id}`)}
        emptyTitle="No posts yet"
        emptyDescription="Write your first blog post to drive SEO traffic."
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title={`Delete '${toDelete?.title}'?`}
        message="This permanently removes the post."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
