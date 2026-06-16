"use client";

import { useCallback, useEffect, useState } from "react";
import { DashPageHeader, DashBadge } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { useToast } from "@/components/ui/Toast";
import { apiGet } from "@/lib/api/client";

type Log = {
  id: string;
  user_name: string | null;
  action: string;
  entity_type: string;
  entity_name: string | null;
  created_at: string;
};

const actionBadge = (a: string) =>
  a === "created" ? "active" : a === "deleted" || a === "rejected" ? "deleted" : a === "approved" ? "approved" : "scheduled";

const TYPES = ["", "product", "collection", "category", "review", "blog", "page", "promotion", "setting", "user", "media", "lead"];

export default function ActivityLog() {
  const toast = useToast();
  const [rows, setRows] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "30" });
    if (type) p.set("entity_type", type);
    const res = await apiGet<{ data: Log[]; pagination: { totalPages: number } }>(`/api/activity?${p}`);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
  }, [page, type, toast]);

  useEffect(() => { load(); }, [load]);

  const columns: Column<Log>[] = [
    { key: "user_name", header: "User", render: (l) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-[11px] font-semibold text-gold">{(l.user_name ?? "?").charAt(0).toUpperCase()}</div>
        <span className="font-medium text-charcoal dark:text-cream">{l.user_name ?? "System"}</span>
      </div>
    ) },
    { key: "action", header: "Action", render: (l) => <DashBadge status={actionBadge(l.action)} label={l.action} /> },
    { key: "entity", header: "Item", render: (l) => (
      <span className="text-ink dark:text-cream">
        <span className="text-muted">{l.entity_type}</span>{l.entity_name ? ` · ${l.entity_name}` : ""}
      </span>
    ) },
    { key: "created_at", header: "When", render: (l) => <span className="whitespace-nowrap text-muted">{new Date(l.created_at).toLocaleString()}</span> },
  ];

  return (
    <div>
      <DashPageHeader title="Activity Log" subtitle="Recent changes made in the dashboard"
        breadcrumbs={[{ label: "Settings" }, { label: "Activity Log" }]} />

      <div className="mb-4 flex flex-wrap gap-2">
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="rounded-md border border-line bg-white px-3 py-2.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5">
          {TYPES.map((t) => <option key={t || "all"} value={t}>{t ? t[0].toUpperCase() + t.slice(1) : "All types"}</option>)}
        </select>
      </div>

      <DashTable columns={columns} rows={rows} getId={(l) => l.id} loading={loading}
        page={page} totalPages={totalPages} onPageChange={setPage}
        emptyTitle="No activity yet" emptyDescription="Changes made in the dashboard will appear here." />
    </div>
  );
}
