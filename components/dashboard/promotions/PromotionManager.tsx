"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Promo = {
  id: string;
  title: string;
  type: string;
  content: string | null;
  cta_text: string | null;
  cta_url: string | null;
  background_color: string | null;
  text_color: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  display_delay_seconds: number;
  display_frequency: string;
  impressions: number;
  clicks: number;
  status: string;
};

const TYPES = [
  ["announcement_bar", "Announcement Bar"],
  ["popup", "Popup"],
  ["hero_banner", "Hero Banner"],
  ["collection_banner", "Collection Banner"],
] as const;

const blank = {
  title: "", type: "announcement_bar", content: "", cta_text: "", cta_url: "",
  background_color: "#0F1D35", text_color: "#FFFFFF",
  start_date: "", end_date: "", is_active: false,
  display_delay_seconds: "0", display_frequency: "every_visit",
};

export default function PromotionManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [f, setF] = useState({ ...blank });
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Promo | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Promo[] }>("/api/promotions");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditId(null);
    setF({ ...blank });
    setOpen(true);
  }
  function openEdit(p: Promo) {
    setEditId(p.id);
    setF({
      title: p.title, type: p.type, content: p.content ?? "", cta_text: p.cta_text ?? "",
      cta_url: p.cta_url ?? "", background_color: p.background_color ?? "#0F1D35",
      text_color: p.text_color ?? "#FFFFFF",
      start_date: p.start_date ? p.start_date.slice(0, 16) : "",
      end_date: p.end_date ? p.end_date.slice(0, 16) : "",
      is_active: p.is_active, display_delay_seconds: String(p.display_delay_seconds),
      display_frequency: p.display_frequency,
    });
    setOpen(true);
  }

  async function save() {
    if (f.title.trim().length < 2) return toast.error("Title required");
    setSaving(true);
    const payload = {
      title: f.title.trim(), type: f.type, content: f.content.trim() || null,
      cta_text: f.cta_text.trim() || null, cta_url: f.cta_url.trim() || null,
      background_color: f.background_color || null, text_color: f.text_color || null,
      start_date: f.start_date ? new Date(f.start_date).toISOString() : null,
      end_date: f.end_date ? new Date(f.end_date).toISOString() : null,
      is_active: f.is_active,
      display_delay_seconds: parseInt(f.display_delay_seconds, 10) || 0,
      display_frequency: f.display_frequency,
    };
    const res = editId
      ? await apiSend(`/api/promotions/${editId}`, "PATCH", payload)
      : await apiSend("/api/promotions", "POST", payload);
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(editId ? "Promotion updated" : "Promotion created");
    setOpen(false);
    load();
  }

  async function remove() {
    if (!toDelete) return;
    const res = await apiSend(`/api/promotions/${toDelete.id}`, "DELETE");
    setToDelete(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Deleted");
    load();
  }

  const columns: Column<Promo>[] = [
    { key: "title", header: "Title", render: (p) => <span className="font-medium">{p.title}</span> },
    { key: "type", header: "Type", render: (p) => TYPES.find((t) => t[0] === p.type)?.[1] ?? p.type },
    { key: "status", header: "Status", render: (p) => <Badge tone={statusTone(p.status)}>{p.status}</Badge> },
    { key: "stats", header: "Impr / Clicks", render: (p) => `${p.impressions} / ${p.clicks}` },
    { key: "actions", header: "", render: (p) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => openEdit(p)} className="text-sm text-gold hover:underline">Edit</button>
        <button onClick={() => setToDelete(p)} className="text-sm text-red-500 hover:underline">Delete</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold">Promotions</h2>
        <Button size="sm" onClick={openNew}>+ New Promotion</Button>
      </div>

      <DashTable columns={columns} rows={rows} getId={(p) => p.id} loading={loading}
        emptyTitle="No promotions yet" emptyDescription="Create an announcement bar, popup, or banner." />

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Promotion" : "New Promotion"} size="lg"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button loading={saving} onClick={save}>Save</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <Field label="Type">
            <Select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </Field>
          <div className="sm:col-span-2"><Field label="Content"><Textarea value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} /></Field></div>
          <Field label="Button text"><Input value={f.cta_text} onChange={(e) => setF({ ...f, cta_text: e.target.value })} /></Field>
          <Field label="Button link"><Input value={f.cta_url} onChange={(e) => setF({ ...f, cta_url: e.target.value })} placeholder="/sofas/" /></Field>
          <Field label="Background colour"><Input type="color" value={f.background_color} onChange={(e) => setF({ ...f, background_color: e.target.value })} /></Field>
          <Field label="Text colour"><Input type="color" value={f.text_color} onChange={(e) => setF({ ...f, text_color: e.target.value })} /></Field>
          <Field label="Start date"><Input type="datetime-local" value={f.start_date} onChange={(e) => setF({ ...f, start_date: e.target.value })} /></Field>
          <Field label="End date"><Input type="datetime-local" value={f.end_date} onChange={(e) => setF({ ...f, end_date: e.target.value })} /></Field>
          <Field label="Popup delay (seconds)"><Input type="number" value={f.display_delay_seconds} onChange={(e) => setF({ ...f, display_delay_seconds: e.target.value })} /></Field>
          <Field label="Frequency">
            <Select value={f.display_frequency} onChange={(e) => setF({ ...f, display_frequency: e.target.value })}>
              <option value="every_visit">Every visit</option>
              <option value="once_per_session">Once per session</option>
              <option value="once_per_day">Once per day</option>
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} />
            Active (live within the date window)
          </label>
        </div>
      </Modal>

      <ConfirmDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove}
        title={`Delete '${toDelete?.title}'?`} confirmLabel="Delete" danger />
    </div>
  );
}
