"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
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

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!source.trim() || !target.trim()) return;
    setAdding(true);
    const res = await apiSend("/api/redirects", "POST", {
      source_url: source.trim(),
      target_url: target.trim(),
      type: parseInt(type, 10),
    });
    setAdding(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Redirect added");
    setSource("");
    setTarget("");
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

  const columns: Column<Redirect>[] = [
    { key: "source_url", header: "From", render: (r) => <span className="font-mono text-xs">{r.source_url}</span> },
    { key: "target_url", header: "To", render: (r) => <span className="font-mono text-xs">{r.target_url}</span> },
    { key: "type", header: "Type", render: (r) => <Badge tone="info">{r.type}</Badge> },
    { key: "hits", header: "Hits", render: (r) => r.hits },
    {
      key: "is_active",
      header: "Active",
      render: (r) => (
        <button onClick={() => toggle(r)} className="text-sm text-gold hover:underline">
          {r.is_active ? "On" : "Off"}
        </button>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <button onClick={() => remove(r)} className="text-sm text-red-500 hover:underline">
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex flex-wrap items-end gap-2 rounded-xl border border-line p-4 dark:border-white/10">
        <div className="flex-1 min-w-40">
          <label className="text-xs text-charcoal/60 dark:text-cream/60">From (old URL)</label>
          <Input placeholder="/old-url/" value={source} onChange={(e) => setSource(e.target.value)} />
        </div>
        <div className="flex-1 min-w-40">
          <label className="text-xs text-charcoal/60 dark:text-cream/60">To (new URL)</label>
          <Input placeholder="/new-url/" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-24">
          <option value="301">301</option>
          <option value="302">302</option>
        </Select>
        <Button type="submit" size="sm" loading={adding}>Add</Button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importCsv(f);
            e.target.value = "";
          }}
        />
        <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
          Import CSV
        </Button>
      </form>

      <DashTable
        columns={columns}
        rows={rows}
        getId={(r) => r.id}
        loading={loading}
        emptyTitle="No redirects yet"
        emptyDescription="Add one above, or import your WordPress URL map as CSV."
      />
    </div>
  );
}
