"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Badge, statusTone } from "@/components/ui/Badge";
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
  status: string;
  created_at: string;
  product: { name: string; slug: string } | null;
};

function Stars({ n }: { n: number }) {
  return <span className="text-gold">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

export default function ReviewManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("pending");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Review | null>(null);
  const [reply, setReply] = useState("");
  const [confirmDel, setConfirmDel] = useState<Review | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) p.set("status", status);
    const res = await apiGet<{ data: Review[]; pagination: { totalPages: number } }>(`/api/reviews?${p}`);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
    setSelected([]);
  }, [page, status, toast]);

  useEffect(() => { load(); }, [load]);

  async function setStatusFor(ids: string[], newStatus: "approved" | "rejected") {
    await Promise.all(ids.map((id) => apiSend(`/api/reviews/${id}`, "PATCH", { status: newStatus })));
    toast.success(`${ids.length} review(s) ${newStatus}`);
    setDetail(null);
    load();
  }

  async function sendReply() {
    if (!detail || !reply.trim()) return;
    const res = await apiSend(`/api/reviews/${detail.id}`, "PATCH", { reply: reply.trim() });
    if (!res.ok) return toast.error(res.error);
    toast.success("Reply saved");
    setReply("");
    setDetail(null);
    load();
  }

  async function del() {
    if (!confirmDel) return;
    const res = await apiSend(`/api/reviews/${confirmDel.id}`, "DELETE");
    setConfirmDel(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Review deleted");
    setDetail(null);
    load();
  }

  const columns: Column<Review>[] = [
    { key: "product", header: "Product", render: (r) => r.product?.name ?? "—" },
    { key: "name", header: "Reviewer", render: (r) => (
      <div><p className="font-medium">{r.name}</p><p className="text-xs text-charcoal/50 dark:text-cream/50">{r.city ?? ""}</p></div>
    ) },
    { key: "rating", header: "Rating", render: (r) => <Stars n={Math.round(r.rating)} /> },
    { key: "text", header: "Review", render: (r) => <span className="line-clamp-1 text-charcoal/70 dark:text-cream/70">{r.text}</span> },
    { key: "status", header: "Status", render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-2xl font-semibold">Reviews</h2>
        <Button size="sm" onClick={() => setAddOpen(true)}>+ Add review</Button>
      </div>

      <div className="flex gap-2">
        {["pending", "approved", "rejected", ""].map((s) => (
          <button key={s || "all"} onClick={() => { setStatus(s); setPage(1); }}
            className={`rounded-full px-3 py-1 text-sm ${status === s ? "bg-gold text-navy" : "bg-black/5 dark:bg-white/10"}`}>
            {s || "All"}
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
        onRowClick={(r) => { setDetail(r); setReply(r.admin_reply ?? ""); }}
        emptyTitle="No reviews here"
        bulkActions={
          <>
            <Button size="sm" onClick={() => setStatusFor(selected, "approved")}>Approve</Button>
            <Button size="sm" variant="secondary" onClick={() => setStatusFor(selected, "rejected")}>Reject</Button>
          </>
        }
      />

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Review"
        footer={detail && (
          <>
            <Button variant="danger" size="sm" onClick={() => setConfirmDel(detail)}>Delete</Button>
            <Button variant="secondary" size="sm" onClick={() => setStatusFor([detail.id], "rejected")}>Reject</Button>
            <Button size="sm" onClick={() => setStatusFor([detail.id], "approved")}>Approve</Button>
          </>
        )}>
        {detail && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{detail.name} {detail.city ? `· ${detail.city}` : ""}</p>
                <Stars n={Math.round(detail.rating)} />
              </div>
              <Badge tone={statusTone(detail.status)}>{detail.status}</Badge>
            </div>
            <p className="text-sm text-charcoal/80 dark:text-cream/80">{detail.text}</p>
            {detail.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={detail.image_url} alt="" className="max-h-48 rounded-lg" />
            )}
            <p className="text-xs text-charcoal/50 dark:text-cream/50">On: {detail.product?.name ?? "—"}</p>
            <Field label="Public reply">
              <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply shown under the review…" />
            </Field>
            <Button size="sm" variant="secondary" onClick={sendReply}>Save reply</Button>
          </div>
        )}
      </Modal>

      <AddReviewModal open={addOpen} onClose={() => setAddOpen(false)} onDone={() => { setAddOpen(false); load(); }} />

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
                className="block w-full rounded-lg border border-black/5 px-3 py-1.5 text-left text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
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
