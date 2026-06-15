"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashInput, DashBtn } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Biz = { name: string; tagline: string; whatsapp: string; email: string; phone: string; address: string };
type Social = { facebook: string; instagram: string; tiktok: string; linkedin: string; youtube: string };

const EMPTY_BIZ: Biz = { name: "ComfyClub", tagline: "Furniture Worth Keeping", whatsapp: "", email: "", phone: "", address: "" };
const EMPTY_SOCIAL: Social = { facebook: "", instagram: "", tiktok: "", linkedin: "", youtube: "" };

export default function SettingsManager() {
  const toast = useToast();
  const [biz, setBiz] = useState<Biz>(EMPTY_BIZ);
  const [social, setSocial] = useState<Social>(EMPTY_SOCIAL);
  const [siteUrl, setSiteUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setBiz({ ...EMPTY_BIZ, ...((r.data.data.business_info as Partial<Biz>) ?? {}) });
      setSocial({ ...EMPTY_SOCIAL, ...((r.data.data.social_links as Partial<Social>) ?? {}) });
      setSiteUrl(String(r.data.data.site_url ?? ""));
    });
  }, []);

  async function save() {
    setSaving(true);
    const res = await Promise.all([
      apiSend("/api/settings", "PATCH", { key: "business_info", value: biz }),
      apiSend("/api/settings", "PATCH", { key: "social_links", value: social }),
      apiSend("/api/settings", "PATCH", { key: "site_url", value: siteUrl.trim().replace(/\/$/, "") }),
    ]);
    setSaving(false);
    if (res.some((r) => !r.ok)) return toast.error("Could not save (admin only)");
    toast.success("Settings saved");
  }

  const sb = (k: keyof Biz) => (v: string) => setBiz((s) => ({ ...s, [k]: v }));
  const ss = (k: keyof Social) => (v: string) => setSocial((s) => ({ ...s, [k]: v }));

  return (
    <div>
      <DashPageHeader title="General Settings" subtitle="Business info, contact details and social links used across the storefront"
        breadcrumbs={[{ label: "Settings" }, { label: "General" }]}
        actions={canEdit && <DashBtn onClick={save}>{saving ? "Saving…" : "Save Settings"}</DashBtn>} />

      <DashSection title="Website Information">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <DashInput label="Website Name" value={biz.name} onChange={sb("name")} disabled={!canEdit} />
          <DashInput label="Tagline" value={biz.tagline} onChange={sb("tagline")} disabled={!canEdit} />
        </div>
      </DashSection>

      <DashSection title="SEO / Canonical" subtitle="The site's primary URL. Used for the canonical tag on every page and in sitemaps">
        <DashInput label="Canonical Site URL" value={siteUrl} onChange={setSiteUrl} placeholder="https://comfyclub.pk" helper="No trailing slash. Every page gets a self-referencing canonical based on this domain." disabled={!canEdit} />
      </DashSection>

      <DashSection title="Contact Information" subtitle="Shown in the footer and used for WhatsApp / email links">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <DashInput label="WhatsApp Number" value={biz.whatsapp} onChange={sb("whatsapp")} placeholder="+923394100052" disabled={!canEdit} />
          <DashInput label="Phone" value={biz.phone} onChange={sb("phone")} placeholder="+923394100052" disabled={!canEdit} />
          <DashInput label="Email" value={biz.email} onChange={sb("email")} placeholder="comfyclub.pk@gmail.com" disabled={!canEdit} />
          <DashInput label="Address" value={biz.address} onChange={sb("address")} placeholder="Jan Muhammad Road, Nawab Town, Lahore" disabled={!canEdit} />
        </div>
      </DashSection>

      <DashSection title="Social Links">
        <DashInput label="Facebook" value={social.facebook} onChange={ss("facebook")} placeholder="https://facebook.com/…" disabled={!canEdit} />
        <DashInput label="Instagram" value={social.instagram} onChange={ss("instagram")} placeholder="https://instagram.com/…" disabled={!canEdit} />
        <DashInput label="TikTok" value={social.tiktok} onChange={ss("tiktok")} placeholder="https://tiktok.com/@…" disabled={!canEdit} />
        <DashInput label="LinkedIn" value={social.linkedin} onChange={ss("linkedin")} placeholder="https://linkedin.com/company/…" disabled={!canEdit} />
        <DashInput label="YouTube" value={social.youtube} onChange={ss("youtube")} placeholder="https://youtube.com/@…" disabled={!canEdit} />
      </DashSection>

      {!canEdit && <p className="text-sm text-muted">You don&apos;t have permission to edit settings.</p>}
    </div>
  );
}
