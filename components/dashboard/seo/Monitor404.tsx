"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Field";
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
    { key: "url", header: "URL", render: (e) => <span className="font-mono text-xs">{e.url}</span> },
    { key: "hits", header: "Hits", render: (e) => e.hits },
    {
      key: "last_seen",
      header: "Last seen",
      render: (e) => new Date(e.last_seen).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (e) => (
        <div className="flex gap-2">
          <button onClick={() => openFix(e)} className="text-sm text-gold hover:underline">
            Create redirect
          </button>
          <button onClick={() => dismiss(e)} className="text-sm text-charcoal/50 hover:underline dark:text-cream/50">
            Dismiss
          </button>
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
        <div className="space-y-3">
          <p className="text-sm text-charcoal/70 dark:text-cream/70">
            Redirect <span className="font-mono">{fixing?.url}</span> to:
          </p>
          <Input placeholder="/new-destination/" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
