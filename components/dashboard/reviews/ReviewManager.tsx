"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashPageHeader, DashCard, DashBtn, DashBadge } from "@/components/dashboard/shared/Dash";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Review = {
  id: string;
  product_id: string;
  name: string;
  city: string | null;
  rating: number;
  text: string;
  image_url: string | null;
  admin_reply: string | null;
  is_featured: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  product: { name: string; slug: string } | null;
};

type Summary = { total: number; pending: number; approved: number; featured: number; avg: number };
type Tab = "all" | "pending" | "approved" | "featured";

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= n ? "#C9A84C" : "#ddd"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

const badgeStatus = (s: Review["status"]) => (s === "approved" ? "approved" : s === "rejected" ? "deleted" : "pending");

export default function ReviewManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tab, setTab] = useState<Tab>("pending");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Review | null>(null);
  const [edit, setEdit] = useState<{ name: string; city: string; rating: string; text: string; reply: string } | null>(null);
  const [confirmDel, setConfirmDel] = useState<Review | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);

  const loadSummary = useCallback(async () => {
    const res = await apiGet<{ data: Summary }>("/api/reviews/summary");
    if (res.ok) setSummary(res.data.data);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "20" });
    if (tab === "featured") p.set("featured", "true");
    else if (tab !== "all") p.set("status", tab);
    const res = await apiGet<{ data: Review[]; pagination: { totalPages: number } }>(`/api/reviews?${p}`);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
    setSelected([]);
  }, [page, tab, toast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadSummary(); }, [loadSummary]);

  const refresh = () => { load(); loadSummary(); };

  async function setStatusFor(ids: string[], newStatus: "approved" | "rejected") {
    await Promise.all(ids.map((id) => apiSend(`/api/reviews/${id}`, "PATCH", { status: newStatus })));
    toast.success(`${ids.length} review(s) ${newStatus}`);
    setDetail(null);
    refresh();
  }

  async function toggleFeatured(r: Review) {
    const res = await apiSend(`/api/reviews/${r.id}`, "PATCH", { is_featured: !r.is_featured });
    if (!res.ok) return toast.error(res.error);
    toast.success(r.is_featured ? "Removed from featured" : "Marked as featured");
    refresh();
  }

  async function saveEdit() {
    if (!detail || !edit) return;
    if (edit.name.trim().length < 2 || edit.text.trim().length < 3) return toast.error("Name and review text required");
    const res = await apiSend(`/api/reviews/${detail.id}`, "PATCH", {
      name: edit.name.trim(),
      city: edit.city.trim() || null,
      rating: parseInt(edit.rating, 10),
      text: edit.text.trim(),
      ...(edit.reply.trim() ? { reply: edit.reply.trim() } : {}),
    });
    if (!res.ok) return toast.error(res.error);
    toast.success("Review updated");
    setDetail(null);
    refresh();
  }

  async function del() {
    if (!confirmDel) return;
    const res = await apiSend(`/api/reviews/${confirmDel.id}`, "DELETE");
    setConfirmDel(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Review deleted");
    setDetail(null);
    refresh();
  }

  function openDetail(r: Review) {
    setDetail(r);
    setEdit({ name: r.name, city: r.city ?? "", rating: String(Math.round(r.rating)), text: r.text, reply: r.admin_reply ?? "" });
  }

  const columns: Column<Review>[] = [
    { key: "product", header: "Product", render: (r) => (
      <span className="text-[12px] font-medium text-navy dark:text-cream">{r.product?.name ?? "—"}</span>
    ) },
    { key: "name", header: "Reviewer", render: (r) => (
      <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted">{r.city ?? ""}</p></div>
    ) },
    { key: "rating", header: "Rating", render: (r) => <Stars n={Math.round(r.rating)} /> },
    { key: "text", header: "Review", render: (r) => <span className="line-clamp-1 text-xs text-muted">{r.text}</span> },
    { key: "is_featured", header: "Featured", render: (r) => (
      <button onClick={(e) => { e.stopPropagation(); toggleFeatured(r); }} className="text-base" title={r.is_featured ? "Featured" : "Mark featured"}>
        {r.is_featured ? "🏆" : "☆"}
      </button>
    ) },
    { key: "status", header: "Status", render: (r) => <DashBadge status={badgeStatus(r.status)} label={r.status} /> },
  ];

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: summary?.total },
    { id: "pending", label: "Pending", count: summary?.pending },
    { id: "approved", label: "Approved", count: summary?.approved },
    { id: "featured", label: "Featured", count: summary?.featured },
  ];

  return (
    <div>
      <DashPageHeader
        title="Reviews"
        subtitle="Manage customer reviews — approve, feature, edit, or add manually"
        breadcrumbs={[{ label: "Reviews" }]}
        actions={<DashBtn icon="+" onClick={() => setAddOpen(true)}>Add Review</DashBtn>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <DashCard label="Average Rating" value={summary?.avg ?? "—"} icon="⭐" tint="bg-gold/15" onClick={() => setTab("all")} />
        <DashCard label="Total Reviews" value={summary?.total ?? "—"} icon="💬" tint="bg-blue-100" onClick={() => setTab("all")} />
        <DashCard label="Pending" value={summary?.pending ?? "—"} icon="⏳" tint="bg-amber-100" onClick={() => setTab("pending")} />
        <DashCard label="Featured" value={summary?.featured ?? "—"} icon="🏆" tint="bg-blue-100" onClick={() => setTab("featured")} />
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-0 overflow-x-auto border-b border-line dark:border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setPage(1); }}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-[13px] transition ${
              tab === t.id ? "border-gold font-semibold text-gold" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}{t.count != null ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      <DashTable
        columns={columns}
        rows={rows}
        getId={(r) => r.id}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        onRowClick={openDetail}
        emptyTitle="No reviews here"
        bulkActions={
          <>
            <Button size="sm" onClick={() => setStatusFor(selected, "approved")}>Approve</Button>
            <Button size="sm" variant="secondary" onClick={() => setStatusFor(selected, "rejected")}>Reject</Button>
          </>
        }
      />

      {/* Detail / edit modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Review"
        footer={detail && edit && (
          <>
            <Button variant="danger" size="sm" onClick={() => setConfirmDel(detail)}>Delete</Button>
            <Button variant="secondary" size="sm" onClick={() => toggleFeatured(detail)}>{detail.is_featured ? "Unfeature" : "Feature"}</Button>
            {detail.status !== "approved" && <Button size="sm" variant="secondary" onClick={() => setStatusFor([detail.id], "approved")}>Approve</Button>}
            <Button size="sm" onClick={saveEdit}>Save changes</Button>
          </>
        )}>
        {detail && edit && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">On: <span className="font-medium text-ink dark:text-cream">{detail.product?.name ?? "—"}</span></p>
              <DashBadge status={badgeStatus(detail.status)} label={detail.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name"><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
              <Field label="City"><Input value={edit.city} onChange={(e) => setEdit({ ...edit, city: e.target.value })} /></Field>
            </div>
            <Field label="Rating">
              <Select value={edit.rating} onChange={(e) => setEdit({ ...edit, rating: e.target.value })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </Select>
            </Field>
            <Field label="Review"><Textarea value={edit.text} onChange={(e) => setEdit({ ...edit, text: e.target.value })} /></Field>
            {detail.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={detail.image_url} alt="" referrerPolicy="no-referrer" className="max-h-48 rounded-lg" />
            )}
            <Field label="Public reply">
              <Textarea value={edit.reply} onChange={(e) => setEdit({ ...edit, reply: e.target.value })} placeholder="Reply shown under the review…" />
            </Field>
          </div>
        )}
      </Modal>

      <AddReviewModal open={addOpen} onClose={() => setAddOpen(false)} onDone={() => { setAddOpen(false); refresh(); }} />

      <ConfirmDialog open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={del}
        title="Delete this review?" message="This permanently removes it." confirmLabel="Delete" danger />
    </div>
  );
}

function AddReviewModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [f, setF] = useState({ name: "", city: "", rating: "5", text: "" });
  const [saving, setSaving] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim().length < 2) return;
    const res = await apiGet<{ data: { id: string; name: string }[] }>(`/api/products?search=${encodeURIComponent(q.trim())}&limit=6`);
    if (res.ok) setResults(res.data.data);
  }
  async function save() {
    if (!productId) return toast.error("Pick a product");
    if (f.name.trim().length < 2 || f.text.trim().length < 3) return toast.error("Name and review text required");
    setSaving(true);
    const res = await apiSend("/api/reviews/manual", "POST", {
      product_id: productId, name: f.name.trim(), city: f.city.trim() || null,
      rating: parseInt(f.rating, 10), text: f.text.trim(),
    });
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Review added");
    setF({ name: "", city: "", rating: "5", text: "" });
    setProductId(""); setProductName(""); setQ(""); setResults([]);
    onDone();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add review (auto-approved)"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button loading={saving} onClick={save}>Add</Button></>}>
      <div className="space-y-3">
        {productId ? (
          <p className="text-sm">Product: <span className="font-medium">{productName}</span> <button onClick={() => setProductId("")} className="text-xs text-gold">change</button></p>
        ) : (
          <>
            <form onSubmit={search} className="flex gap-2">
              <Input placeholder="Search product…" value={q} onChange={(e) => setQ(e.target.value)} />
              <Button size="sm" type="submit">Find</Button>
            </form>
            {results.map((p) => (
              <button key={p.id} onClick={() => { setProductId(p.id); setProductName(p.name); }}
                className="block w-full rounded-lg border border-line px-3 py-1.5 text-left text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
                {p.name}
              </button>
            ))}
          </>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="City"><Input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></Field>
        </div>
        <Field label="Rating">
          <Select value={f.rating} onChange={(e) => setF({ ...f, rating: e.target.value })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </Select>
        </Field>
        <Field label="Review"><Textarea value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}
