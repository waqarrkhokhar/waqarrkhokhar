"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashInput, DashBtn } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Verifs = {
  google: string; bing: string; clarity: string; pinterest: string;
  facebook: string; yandex: string; ahrefs: string; norton: string;
};
const EMPTY: Verifs = { google: "", bing: "", clarity: "", pinterest: "", facebook: "", yandex: "", ahrefs: "", norton: "" };

const FIELDS: { key: keyof Verifs; label: string; icon: string; placeholder: string; helper: string; link?: string }[] = [
  { key: "google", label: "Google Search Console", icon: "🔍", placeholder: "google-site-verification content value", helper: "In Search Console choose the “HTML tag” method and paste only the content value here.", link: "https://search.google.com/search-console" },
  { key: "clarity", label: "Microsoft Clarity", icon: "📊", placeholder: "Project ID (e.g. abcd1234ef)", helper: "Clarity → Settings → Overview → copy the Project ID. We add the full Clarity tracking script for you (heatmaps + session recordings).", link: "https://clarity.microsoft.com/" },
  { key: "pinterest", label: "Pinterest", icon: "📌", placeholder: "p:domain_verify content value", helper: "Pinterest Business → Settings → Claim → “Add HTML tag” → paste only the content value.", link: "https://www.pinterest.com/business/hub/" },
  { key: "bing", label: "Bing Webmaster Tools", icon: "🅱️", placeholder: "msvalidate.01 content value", helper: "Bing Webmaster → Add site → “HTML Meta Tag” → paste only the content value.", link: "https://www.bing.com/webmasters" },
  { key: "facebook", label: "Meta / Facebook", icon: "📘", placeholder: "facebook-domain-verification content value", helper: "Meta Business Suite → Brand Safety → Domains → verify by Meta-tag → paste the content value.", link: "https://business.facebook.com/" },
  { key: "yandex", label: "Yandex Webmaster", icon: "🟡", placeholder: "yandex-verification content value", helper: "Yandex Webmaster → Add site → Meta tag → paste the content value.", link: "https://webmaster.yandex.com/" },
  { key: "ahrefs", label: "Ahrefs", icon: "🔗", placeholder: "ahrefs-site-verification content value", helper: "Ahrefs → Site Audit / Dashboard → verify ownership via HTML tag → paste the content value.", link: "https://ahrefs.com/" },
  { key: "norton", label: "Norton Safe Web", icon: "🛡️", placeholder: "norton-safeweb-site-verification content value", helper: "Optional. Norton Safe Web site owner verification meta tag content value.", link: "https://safeweb.norton.com/" },
];

export default function VerificationManager() {
  const toast = useToast();
  const [v, setV] = useState<Verifs>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    apiGet<{ data: { verifications: Partial<Verifs> } }>("/api/verifications").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setV({ ...EMPTY, ...r.data.data.verifications });
    });
  }, []);

  async function save() {
    setSaving(true);
    const res = await apiSend("/api/verifications", "PATCH", { verifications: v });
    setSaving(false);
    if (!res.ok) return toast.error(res.error || "Could not save");
    toast.success("Verification tags saved");
  }

  const set = (k: keyof Verifs) => (val: string) => setV((s) => ({ ...s, [k]: val }));
  const activeCount = Object.values(v).filter((x) => x.trim()).length;

  return (
    <div>
      <DashPageHeader
        title="Site Verification"
        subtitle="Prove you own comfyclub.pk to search engines & platforms, and connect Microsoft Clarity"
        breadcrumbs={[{ label: "SEO" }, { label: "Verification" }]}
        actions={canEdit && <DashBtn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</DashBtn>}
      />

      <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-[13px] leading-relaxed text-blue-700">
        💡 Paste only the <strong>content value</strong> from each tool&apos;s “HTML tag” method — not the whole <code>&lt;meta&gt;</code> line. We place the correct tag in your site&apos;s <code>&lt;head&gt;</code> automatically. {activeCount > 0 && <span className="font-semibold">{activeCount} active.</span>}
      </div>

      {FIELDS.map((f) => (
        <DashSection key={f.key} title={`${f.icon} ${f.label}`}>
          <DashInput label={f.key === "clarity" ? "Project ID" : "Verification content value"} value={v[f.key]} onChange={set(f.key)} placeholder={f.placeholder} helper={f.helper} disabled={!canEdit} />
          {f.link && (
            <a href={f.link} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-gold">Open {f.label} →</a>
          )}
          {v[f.key].trim() && <span className="ml-3 text-[12px] font-medium text-green-600">✓ Live in &lt;head&gt;</span>}
        </DashSection>
      ))}

      {!canEdit && <p className="text-sm text-muted">You don&apos;t have permission to edit verification settings.</p>}
    </div>
  );
}
