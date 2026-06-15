"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashInput, DashBtn } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type FooterCfg = { brand: string; copyright: string };
const EMPTY: FooterCfg = {
  brand: "Pakistan's premium handcrafted furniture brand. We create sofas, chairs, and seating made to order using solid hardwood frames and premium upholstery — designed to last generations.",
  copyright: `© ${new Date().getFullYear()} ComfyClub · Lahore, Pakistan · Mon–Sat 8 AM – 9 PM`,
};

export default function FooterBuilder() {
  const toast = useToast();
  const [f, setF] = useState<FooterCfg>(EMPTY);
  const [canEdit, setCanEdit] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setF({ ...EMPTY, ...((r.data.data.footer_config as Partial<FooterCfg>) ?? {}) });
    });
  }, []);

  async function save() {
    setSaving(true);
    const res = await apiSend("/api/settings", "PATCH", { key: "footer_config", value: f });
    setSaving(false);
    if (!res.ok) return toast.error("Could not save (admin only)");
    toast.success("Footer saved");
  }

  return (
    <div>
      <DashPageHeader title="Footer Builder" subtitle="Brand blurb, copyright and footer content"
        breadcrumbs={[{ label: "Appearance" }, { label: "Footer" }]}
        actions={canEdit && <DashBtn onClick={save}>{saving ? "Saving…" : "Save Footer"}</DashBtn>} />

      <DashSection title="Brand">
        <DashInput label="Brand Description" textarea rows={3} value={f.brand} onChange={(v) => setF({ ...f, brand: v })} disabled={!canEdit} helper="Short paragraph under the logo in the footer" />
      </DashSection>

      <DashSection title="Legal">
        <DashInput label="Copyright Text" value={f.copyright} onChange={(v) => setF({ ...f, copyright: v })} disabled={!canEdit} />
      </DashSection>

      <DashSection title="Footer Menus & Contact" subtitle="Where the rest of the footer comes from">
        <ul className="ml-5 list-disc space-y-1.5 text-[13px] text-muted">
          <li><strong className="text-ink dark:text-cream">Sofas / Seater menus</strong> — built from your Parent Categories &amp; Collections.</li>
          <li><strong className="text-ink dark:text-cream">Contact details &amp; social links</strong> — edited in <a href="/dashboard/settings" className="text-gold">Settings → General</a>.</li>
          <li><strong className="text-ink dark:text-cream">Quick Links</strong> — About, Blog, Contact and the policy pages.</li>
        </ul>
      </DashSection>
    </div>
  );
}
