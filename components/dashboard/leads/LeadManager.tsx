"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashPageHeader, DashCard, DashBtn, DashBadge } from "@/components/dashboard/shared/Dash";
import { Field, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Lead = {
  id: string;
  product_name: string | null;
  message_type: string;
  source_page: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

type Stats = {
  total: number;
  this_week: number;
  this_month: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
  top_products: { product_name: string; count: number }[];
};

const STATUSES = ["new", "contacted", "converted", "lost"];
const typeBadge = (t: string) => (t === "order" ? "active" : t === "quote" ? "pending" : "scheduled");
const statusBadge = (s: string) => (s === "converted" ? "approved" : s === "lost" ? "archived" : s === "contacted" ? "scheduled" : "pending");

export default function LeadManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [detail, setDetail] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) p.set("status", status);
    if (type) p.set("message_type", type);
    const res = await apiGet<{ data: Lead[]; pagination: { totalPages: number } }>(`/api/leads?${p}`);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
  }, [page, status, type, toast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    apiGet<{ data: Stats }>("/api/leads/stats").then((r) => r.ok && setStats(r.data.data));
  }, []);

  async function updateLead(patch: { status?: string; notes?: string }) {
    if (!detail) return;
    const res = await apiSend(`/api/leads/${detail.id}`, "PATCH", patch);
    if (!res.ok) return toast.error(res.error);
    toast.success("Updated");
    load();
    setDetail(null);
  }

  const columns: Column<Lead>[] = [
    { key: "created_at", header: "Date", render: (l) => (
      <div className="whitespace-nowrap">
        <div>{new Date(l.created_at).toLocaleDateString()}</div>
        <div className="text-[11px] text-muted">{new Date(l.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    ) },
    { key: "product_name", header: "Product", render: (l) => <span className={l.product_name ? "font-medium" : "text-muted"}>{l.product_name ?? "General enquiry"}</span> },
    { key: "source_page", header: "Source", render: (l) => <span className="text-muted">{l.source_page ?? "—"}</span> },
    { key: "message_type", header: "Type", render: (l) => <DashBadge status={typeBadge(l.message_type)} label={l.message_type[0].toUpperCase() + l.message_type.slice(1)} /> },
    { key: "status", header: "Status", render: (l) => <DashBadge status={statusBadge(l.status)} label={l.status} /> },
  ];

  const cards = [
    { label: "This Week", value: stats?.this_week, icon: "📊", tint: "bg-blue-100" },
    { label: "This Month", value: stats?.this_month, icon: "📈", tint: "bg-blue-100" },
    { label: "Total", value: stats?.total, icon: "📱", tint: "bg-green-100" },
    { label: "Orders", value: stats?.by_type.order, icon: "🛒", tint: "bg-gold/15" },
    { label: "Quotes", value: stats?.by_type.quote, icon: "📝", tint: "bg-amber-100" },
    { label: "Consultations", value: stats?.by_type.consultation, icon: "💬", tint: "bg-blue-100" },
  ];

  return (
    <div>
      <DashPageHeader
        title="WhatsApp Leads"
        subtitle="Track all WhatsApp interactions from the storefront"
        breadcrumbs={[{ label: "Leads" }]}
        actions={<a href="/api/leads/export" download><DashBtn variant="secondary" icon="↓">Export CSV</DashBtn></a>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <DashCard key={c.label} label={c.label} value={c.value ?? "—"} icon={c.icon} tint={c.tint} />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5">
          <option value="">All types</option>
          {["order", "quote", "consultation", "general"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <DashTable columns={columns} rows={rows} getId={(l) => l.id} loading={loading}
        page={page} totalPages={totalPages} onPageChange={setPage}
        onRowClick={(l) => { setDetail(l); setNotes(l.notes ?? ""); }}
        emptyTitle="No leads yet" emptyDescription="WhatsApp clicks from your storefront will appear here." />

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Lead details"
        footer={detail && <Button onClick={() => updateLead({ notes })}>Save notes</Button>}>
        {detail && (
          <div className="space-y-3">
            <p className="text-sm"><span className="text-muted">Product:</span> {detail.product_name ?? "General enquiry"}</p>
            <p className="text-sm"><span className="text-muted">Type:</span> {detail.message_type}</p>
            <p className="text-sm"><span className="text-muted">From page:</span> {detail.source_page ?? "—"}</p>
            <Field label="Status">
              <Select value={detail.status} onChange={(e) => updateLead({ status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Notes">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call notes, follow-up…" />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
