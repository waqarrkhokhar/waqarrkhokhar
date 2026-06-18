"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashBtn, DashBadge, DashInput, DashSelect } from "@/components/dashboard/shared/Dash";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Redirect = {
  id: string;
  source_url: string;
  target_url: string;
  type: number;
  is_active: boolean;
  hits: number;
};

export default function RedirectManager() {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [type, setType] = useState("301");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Redirect[] }>("/api/redirects");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function add() {
    if (!source.trim() || !target.trim()) return toast.error("From and To URLs are required");
    setAdding(true);
    const res = await apiSend("/api/redirects", "POST", {
      source_url: source.trim(), target_url: target.trim(), type: parseInt(type, 10),
    });
    setAdding(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Redirect added");
    setSource(""); setTarget(""); setType("301"); setAddOpen(false);
    load();
  }

  async function toggle(r: Redirect) {
    const res = await apiSend(`/api/redirects/${r.id}`, "PATCH", { is_active: !r.is_active });
    if (!res.ok) return toast.error(res.error);
    load();
  }

  async function remove(r: Redirect) {
    const res = await apiSend(`/api/redirects/${r.id}`, "DELETE");
    if (!res.ok) return toast.error(res.error);
    load();
  }

  async function importCsv(file: File) {
    const form = new FormData();
    form.append("file", file);
    const up = await fetch("/api/redirects/import", { method: "POST", body: form });
    const json = await up.json().catch(() => ({}));
    if (!up.ok) return toast.error(json.error ?? "Import failed");
    toast.success(json.message ?? "Imported");
    load();
  }

  const code = (v: string) => <code className="rounded bg-panel px-1.5 py-0.5 text-[12px] dark:bg-white/10">{v}</code>;

  const columns: Column<Redirect>[] = [
    { key: "source_url", header: "From URL", render: (r) => code(r.source_url) },
    { key: "target_url", header: "To URL", render: (r) => code(r.target_url) },
    { key: "type", header: "Type", render: (r) => <DashBadge status={r.type === 301 ? "active" : "scheduled"} label={String(r.type)} /> },
    { key: "hits", header: "Hits", render: (r) => r.hits },
    { key: "status", header: "Status", render: (r) => <DashBadge status={r.is_active ? "active" : "archived"} label={r.is_active ? "active" : "off"} /> },
    {
      key: "actions", header: "", className: "w-28",
      render: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => toggle(r)} title={r.is_active ? "Turn off" : "Turn on"} className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">{r.is_active ? "⏸️" : "▶️"}</button>
          <button onClick={() => remove(r)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <DashBtn variant="secondary" icon="↑" onClick={() => fileRef.current?.click()}>Bulk Import</DashBtn>
        <DashBtn icon="+" onClick={() => setAddOpen(true)}>Add Redirect</DashBtn>
        <input ref={fileRef} type="file" accept=".csv" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.target.value = ""; }} />
      </div>

      <DashTable
        columns={columns}
        rows={rows}
        getId={(r) => r.id}
        loading={loading}
        emptyTitle="No redirects yet"
        emptyDescription="Add one above, or import your WordPress URL map as CSV."
      />

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Redirect"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={add} loading={adding}>Save</Button></>}
      >
        <DashInput label="From URL" required value={source} onChange={setSource} placeholder="/old-page-url" />
        <DashInput label="To URL" required value={target} onChange={setTarget} placeholder="/new-page-url" />
        <DashSelect label="Type" value={type} onChange={setType}>
          <option value="301">301 (Permanent)</option>
          <option value="302">302 (Temporary)</option>
        </DashSelect>
      </Modal>
    </div>
  );
}
