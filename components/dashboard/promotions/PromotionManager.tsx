"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashPageHeader, DashSection, DashInput, DashSelect, DashToggle, DashBtn, DashBadge } from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
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
const typeLabel = (t: string) => TYPES.find((x) => x[0] === t)?.[1] ?? t;
const statusBadge = (s: string) => (s === "active" ? "active" : s === "scheduled" ? "scheduled" : s === "expired" ? "archived" : "draft");

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
  const [editId, setEditId] = useState<string | "new" | null>(null);
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

  function openNew() { setEditId("new"); setF({ ...blank }); }
  function openEdit(p: Promo) {
    setEditId(p.id);
    setF({
      title: p.title, type: p.type, content: p.content ?? "", cta_text: p.cta_text ?? "",
      cta_url: p.cta_url ?? "", background_color: p.background_color ?? "#0F1D35", text_color: p.text_color ?? "#FFFFFF",
      start_date: p.start_date ? p.start_date.slice(0, 16) : "", end_date: p.end_date ? p.end_date.slice(0, 16) : "",
      is_active: p.is_active, display_delay_seconds: String(p.display_delay_seconds), display_frequency: p.display_frequency,
    });
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
      is_active: f.is_active, display_delay_seconds: parseInt(f.display_delay_seconds, 10) || 0,
      display_frequency: f.display_frequency,
    };
    const res = editId && editId !== "new"
      ? await apiSend(`/api/promotions/${editId}`, "PATCH", payload)
      : await apiSend("/api/promotions", "POST", payload);
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(editId === "new" ? "Promotion created" : "Promotion updated");
    setEditId(null);
    load();
  }

  async function remove() {
    if (!toDelete) return;
    const res = await apiSend(`/api/promotions/${toDelete.id}`, "DELETE");
    setToDelete(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Promotion moved to trash");
    load();
  }

  // ── Inline editor ──
  if (editId !== null) {
    const isPopup = f.type === "popup";
    return (
      <div>
        <DashPageHeader
          title={editId === "new" ? "New Promotion" : "Edit Promotion"}
          breadcrumbs={[{ label: "Promotions" }, { label: editId === "new" ? "New" : "Edit" }]}
          actions={
            <>
              <DashBtn variant="secondary" onClick={() => setEditId(null)}>Cancel</DashBtn>
              <DashBtn onClick={save}>{saving ? "Saving…" : "Save"}</DashBtn>
            </>
          }
        />
        <DashSection title="Promotion Details">
          <DashInput label="Promotion Name" required value={f.title} onChange={(v) => setF({ ...f, title: v })} placeholder="e.g. Summer Sale 2026" />
          <DashSelect label="Type" required value={f.type} onChange={(v) => setF({ ...f, type: v })}>
            {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </DashSelect>
          <DashInput label="Content / Message" textarea rows={3} value={f.content} onChange={(v) => setF({ ...f, content: v })} />
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <DashInput label="Button Text" value={f.cta_text} onChange={(v) => setF({ ...f, cta_text: v })} placeholder="Shop Now" />
            <DashInput label="Button Link" value={f.cta_url} onChange={(v) => setF({ ...f, cta_url: v })} placeholder="/sofas/" />
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-ink dark:text-cream">Background Colour</label>
              <input type="color" value={f.background_color} onChange={(e) => setF({ ...f, background_color: e.target.value })} className="h-10 w-full rounded-md border border-line dark:border-white/10" />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-ink dark:text-cream">Text Colour</label>
              <input type="color" value={f.text_color} onChange={(e) => setF({ ...f, text_color: e.target.value })} className="h-10 w-full rounded-md border border-line dark:border-white/10" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <DashInput label="Start Date" type="datetime-local" value={f.start_date} onChange={(v) => setF({ ...f, start_date: v })} />
            <DashInput label="End Date" type="datetime-local" value={f.end_date} onChange={(v) => setF({ ...f, end_date: v })} />
          </div>
        </DashSection>

        <DashSection title="Display Settings">
          {isPopup && <DashInput label="Delay (seconds)" type="number" value={f.display_delay_seconds} onChange={(v) => setF({ ...f, display_delay_seconds: v })} helper="Wait before showing the popup" />}
          <DashSelect label="Frequency" value={f.display_frequency} onChange={(v) => setF({ ...f, display_frequency: v })}>
            <option value="every_visit">Every visit</option>
            <option value="once_per_session">Once per session</option>
            <option value="once_per_day">Once per day</option>
          </DashSelect>
          <DashToggle label="Active" checked={f.is_active} onChange={(v) => setF({ ...f, is_active: v })} helper="Goes live within the start/end date window" />
        </DashSection>
      </div>
    );
  }

  // ── List ──
  const columns: Column<Promo>[] = [
    { key: "title", header: "Promotion", render: (p) => <span className="font-medium text-charcoal dark:text-cream">{p.title}</span> },
    { key: "type", header: "Type", render: (p) => <DashBadge status="scheduled" label={typeLabel(p.type)} /> },
    { key: "window", header: "Window", render: (p) => (
      <span className="whitespace-nowrap text-xs text-muted">
        {p.start_date ? new Date(p.start_date).toLocaleDateString() : "-"} → {p.end_date ? new Date(p.end_date).toLocaleDateString() : "-"}
      </span>
    ) },
    { key: "stats", header: "Impr / Clicks", render: (p) => `${p.impressions} / ${p.clicks}` },
    { key: "status", header: "Status", render: (p) => <DashBadge status={statusBadge(p.status)} label={p.status} /> },
    { key: "actions", header: "", className: "w-20", render: (p) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => openEdit(p)} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
        <button onClick={() => setToDelete(p)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
      </div>
    ) },
  ];

  return (
    <div>
      <DashPageHeader
        title="Promotions"
        subtitle="Manage sales banners, popups, and announcements"
        breadcrumbs={[{ label: "Promotions" }]}
        actions={<DashBtn icon="+" onClick={openNew}>Create Promotion</DashBtn>}
      />
      <DashTable columns={columns} rows={rows} getId={(p) => p.id} loading={loading}
        onRowClick={openEdit}
        emptyTitle="No promotions yet" emptyDescription="Create an announcement bar, popup, or banner." />
      <ConfirmDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove}
        title={`Move '${toDelete?.title}' to trash?`} message="Restore it any time from the Trash page." confirmLabel="Move to Trash" danger />
    </div>
  );
}
