"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashInput, DashToggle, DashBtn } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Bar = { enabled: boolean; message: string; bg: string; color: string };
const EMPTY: Bar = { enabled: true, message: "We Ship Across Pakistan · WhatsApp Us Anytime", bg: "#0F1D35", color: "#C9A84C" };

export default function HeaderBuilder() {
  const toast = useToast();
  const [bar, setBar] = useState<Bar>(EMPTY);
  const [canEdit, setCanEdit] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setBar({ ...EMPTY, ...((r.data.data.announcement_bar as Partial<Bar>) ?? {}) });
    });
  }, []);

  async function save() {
    setSaving(true);
    const res = await apiSend("/api/settings", "PATCH", { key: "announcement_bar", value: bar });
    setSaving(false);
    if (!res.ok) return toast.error("Could not save (admin only)");
    toast.success("Header saved");
  }

  return (
    <div>
      <DashPageHeader title="Header Builder" subtitle="Announcement bar and top navigation"
        breadcrumbs={[{ label: "Appearance" }, { label: "Header" }]}
        actions={canEdit && <DashBtn onClick={save}>{saving ? "Saving…" : "Save Header"}</DashBtn>} />

      <DashSection title="Announcement Bar" subtitle="The slim bar above the header — updates the storefront instantly">
        <DashToggle label="Show Announcement Bar" checked={bar.enabled} onChange={(v) => setBar({ ...bar, enabled: v })} />
        <DashInput label="Message" value={bar.message} onChange={(v) => setBar({ ...bar, message: v })} disabled={!canEdit} />
        <div className="grid grid-cols-2 gap-x-4">
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-ink dark:text-cream">Background Colour</label>
            <input type="color" value={bar.bg} onChange={(e) => setBar({ ...bar, bg: e.target.value })} className="h-10 w-full rounded-md border border-line dark:border-white/10" />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-ink dark:text-cream">Text Colour</label>
            <input type="color" value={bar.color} onChange={(e) => setBar({ ...bar, color: e.target.value })} className="h-10 w-full rounded-md border border-line dark:border-white/10" />
          </div>
        </div>
        {/* Live preview */}
        <div className="rounded-md px-4 py-2 text-center text-[12.5px] tracking-wide" style={{ background: bar.bg, color: bar.color }}>
          {bar.message || "Announcement preview"}
        </div>
      </DashSection>

      <DashSection title="Navigation" subtitle="Top-menu items come from your published Parent Categories">
        <p className="text-[13px] leading-relaxed text-muted">
          The header menu is built automatically from your <strong className="text-ink dark:text-cream">Parent Categories</strong>. To add, rename or reorder menu items, use <strong className="text-ink dark:text-cream">Catalog → Categories</strong> (and Structure Manager for ordering). This keeps the menu and your catalog perfectly in sync.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <DashBtn variant="secondary" href="/dashboard/categories">Manage Categories</DashBtn>
        </div>
      </DashSection>
    </div>
  );
}
