"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Field, Textarea, Select } from "@/components/ui/Field";
import { Badge, statusTone } from "@/components/ui/Badge";
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
    { key: "product_name", header: "Product", render: (l) => l.product_name ?? "General inquiry" },
    { key: "message_type", header: "Type", render: (l) => <Badge tone="info">{l.message_type}</Badge> },
    { key: "status", header: "Status", render: (l) => <Badge tone={statusTone(l.status)}>{l.status}</Badge> },
    { key: "created_at", header: "Date", render: (l) => new Date(l.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold">WhatsApp Leads</h2>
        <a href="/api/leads/export" download><Button size="sm" variant="secondary">Export CSV</Button></a>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Total", stats.total],
            ["This week", stats.this_week],
            ["This month", stats.this_month],
            ["Converted", stats.by_status.converted ?? 0],
          ].map(([l, v]) => (
            <div key={l} className="rounded-[10px] border border-line bg-white p-4 shadow-card dark:border-white/10 dark:bg-[#191f2e]">
              <p className="font-heading text-3xl font-bold">{v}</p>
              <p className="text-xs text-muted">{l}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-40">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="w-40">
          <option value="">All types</option>
          {["order", "quote", "consultation", "general"].map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
      </div>

      <DashTable columns={columns} rows={rows} getId={(l) => l.id} loading={loading}
        page={page} totalPages={totalPages} onPageChange={setPage}
        onRowClick={(l) => { setDetail(l); setNotes(l.notes ?? ""); }}
        emptyTitle="No leads yet" emptyDescription="WhatsApp clicks from your storefront will appear here." />

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Lead details"
        footer={detail && <Button onClick={() => updateLead({ notes })}>Save notes</Button>}>
        {detail && (
          <div className="space-y-3">
            <p className="text-sm"><span className="text-muted">Product:</span> {detail.product_name ?? "General inquiry"}</p>
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
