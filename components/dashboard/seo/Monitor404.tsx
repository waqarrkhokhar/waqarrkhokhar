"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashInput } from "@/components/dashboard/shared/Dash";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type ErrorLog = {
  id: string;
  url: string;
  referrer: string | null;
  hits: number;
  last_seen: string;
  is_resolved: boolean;
};

export default function Monitor404() {
  const toast = useToast();
  const [rows, setRows] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState<ErrorLog | null>(null);
  const [target, setTarget] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: ErrorLog[] }>("/api/errors?resolved=false");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openFix(e: ErrorLog) {
    setFixing(e);
    setTarget("");
  }

  async function createRedirect() {
    if (!fixing || !target.trim()) return;
    setSaving(true);
    const res = await apiSend("/api/redirects", "POST", {
      source_url: fixing.url,
      target_url: target.trim(),
      type: 301,
    });
    if (res.ok) {
      await apiSend(`/api/errors/${fixing.id}`, "PATCH", { is_resolved: true });
    }
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Redirect created");
    setFixing(null);
    load();
  }

  async function dismiss(e: ErrorLog) {
    const res = await apiSend(`/api/errors/${e.id}`, "PATCH", { is_resolved: true });
    if (!res.ok) return toast.error(res.error);
    load();
  }

  const columns: Column<ErrorLog>[] = [
    { key: "url", header: "URL", render: (e) => <code className="rounded bg-panel px-1.5 py-0.5 text-[12px] dark:bg-white/10">{e.url}</code> },
    { key: "referrer", header: "Referrer", render: (e) => <span className="text-muted">{e.referrer || "—"}</span> },
    { key: "hits", header: "Hits", render: (e) => e.hits },
    {
      key: "last_seen",
      header: "Last Seen",
      render: (e) => <span className="whitespace-nowrap text-muted">{new Date(e.last_seen).toLocaleDateString()}</span>,
    },
    {
      key: "actions", header: "", className: "w-44",
      render: (e) => (
        <div className="flex items-center justify-end gap-2" onClick={(ev) => ev.stopPropagation()}>
          <button onClick={() => openFix(e)} className="rounded border border-line px-2.5 py-1 text-xs hover:border-gold dark:border-white/10">Create redirect</button>
          <button onClick={() => dismiss(e)} title="Dismiss" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✕</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashTable
        columns={columns}
        rows={rows}
        getId={(e) => e.id}
        loading={loading}
        emptyTitle="No 404s logged"
        emptyDescription="Broken URLs visitors hit will show up here."
      />

      <Modal
        open={!!fixing}
        onClose={() => setFixing(null)}
        title="Create redirect"
        footer={
          <>
            <Button variant="ghost" onClick={() => setFixing(null)}>Cancel</Button>
            <Button loading={saving} onClick={createRedirect}>Create 301</Button>
          </>
        }
      >
        <p className="mb-2 text-[13px] text-muted">
          Redirect <code className="rounded bg-panel px-1.5 py-0.5 text-[12px] dark:bg-white/10">{fixing?.url}</code> to:
        </p>
        <DashInput label="Destination URL" value={target} onChange={setTarget} placeholder="/new-destination/" />
      </Modal>
    </div>
  );
}
