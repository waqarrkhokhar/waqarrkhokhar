"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashInput, DashBtn } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { cleanToken, type VerifKey } from "@/lib/seo/verification";

type Verifs = {
  google: string; bing: string; clarity: string; pinterest: string;
  facebook: string; yandex: string; ahrefs: string; norton: string;
  facebook_pixel: string;
};
const EMPTY: Verifs = { google: "", bing: "", clarity: "", pinterest: "", facebook: "", yandex: "", ahrefs: "", norton: "", facebook_pixel: "" };

const FIELDS: { key: keyof Verifs; label: string; icon: string; placeholder: string; helper: string; link?: string }[] = [
  { key: "google", label: "Google Search Console", icon: "🔍", placeholder: "Paste the whole HTML tag or just the code", helper: "In Search Console choose the “HTML tag” method. You can paste the entire <meta …> line — we clean it and keep only the correct code.", link: "https://search.google.com/search-console" },
  { key: "clarity", label: "Microsoft Clarity", icon: "📊", placeholder: "Project ID (e.g. abcd1234ef)", helper: "Clarity → Settings → Overview → copy the Project ID. We add the full Clarity tracking script for you (heatmaps + session recordings).", link: "https://clarity.microsoft.com/" },
  { key: "pinterest", label: "Pinterest", icon: "📌", placeholder: "Paste the whole HTML tag or just the code", helper: "Pinterest Business → Settings → Claim → “Add HTML tag”. Paste the whole tag — we keep only the code.", link: "https://www.pinterest.com/business/hub/" },
  { key: "bing", label: "Bing Webmaster Tools", icon: "🅱️", placeholder: "Paste the whole HTML tag or just the code", helper: "Bing Webmaster → Add site → “HTML Meta Tag”. Paste the whole tag — we keep only the code.", link: "https://www.bing.com/webmasters" },
  { key: "facebook", label: "Meta / Facebook — Domain Verification", icon: "📘", placeholder: "Paste the whole HTML tag or just the code", helper: "Meta Business Suite → Brand Safety → Domains → verify by Meta-tag. Paste the whole tag — we keep only the code.", link: "https://business.facebook.com/" },
  { key: "facebook_pixel", label: "Meta / Facebook — Pixel (tracking)", icon: "🎯", placeholder: "Pixel ID (numbers only, e.g. 123456789012345)", helper: "Meta Events Manager → Data sources → your Pixel → copy the Pixel ID (numbers). We add the Meta Pixel tracking script + PageView for you.", link: "https://business.facebook.com/events_manager2/" },
  { key: "yandex", label: "Yandex Webmaster", icon: "🟡", placeholder: "Paste the whole HTML tag or just the code", helper: "Yandex Webmaster → Add site → Meta tag. Paste the whole tag — we keep only the code.", link: "https://webmaster.yandex.com/" },
  { key: "ahrefs", label: "Ahrefs", icon: "🔗", placeholder: "Paste the whole HTML tag or just the code", helper: "Ahrefs → Site Audit / Dashboard → verify ownership via HTML tag. Paste the whole tag — we keep only the code.", link: "https://ahrefs.com/" },
  { key: "norton", label: "Norton Safe Web", icon: "🛡️", placeholder: "Paste the whole HTML tag or just the code", helper: "Optional. Norton Safe Web site owner verification tag. Paste the whole tag — we keep only the code.", link: "https://safeweb.norton.com/" },
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
    // Clean every value up-front so the owner immediately sees the exact token
    // that will go live (pasting a whole <meta> tag becomes just the code).
    const cleaned = Object.fromEntries(
      (Object.keys(v) as VerifKey[]).map((k) => [k, cleanToken(k, v[k])]),
    ) as Verifs;
    setV(cleaned);
    setSaving(true);
    const res = await apiSend("/api/verifications", "PATCH", { verifications: cleaned });
    setSaving(false);
    if (!res.ok) return toast.error(res.error || "Could not save");
    toast.success("Saved — the correct tags are now live in your site’s <head>");
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
        💡 Just paste what each tool gives you — the <strong>whole</strong> <code>&lt;meta&gt;</code> tag is fine. We automatically keep only the correct code and place it in your site&apos;s <code>&lt;head&gt;</code>, so a mis-paste can never break verification again. {activeCount > 0 && <span className="font-semibold">{activeCount} active.</span>}
      </div>

      <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-700">
        ℹ️ <strong>Google Analytics (GA4)</strong> and <strong>Google Tag Manager</strong> are connected on the <strong>Analytics</strong> page — kept separate so their IDs are never overwritten by mistake.
      </div>

      {FIELDS.map((f) => {
        const isScript = f.key === "clarity" || f.key === "facebook_pixel";
        const label = f.key === "clarity" ? "Project ID" : f.key === "facebook_pixel" ? "Pixel ID" : "Verification code (or paste the whole tag)";
        return (
        <DashSection key={f.key} title={`${f.icon} ${f.label}`}>
          <DashInput label={label} value={v[f.key]} onChange={set(f.key)} placeholder={f.placeholder} helper={f.helper} disabled={!canEdit} />
          {f.link && (
            <a href={f.link} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-gold">Open {f.label} →</a>
          )}
          {v[f.key].trim() && <span className="ml-3 text-[12px] font-medium text-green-600">✓ {isScript ? "Tracking live on the site" : "Live in <head>"}</span>}
        </DashSection>
        );
      })}

      {!canEdit && <p className="text-sm text-muted">You don&apos;t have permission to edit verification settings.</p>}
    </div>
  );
}
