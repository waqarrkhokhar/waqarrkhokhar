"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashCard, DashBtn, DashProgress } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type SearchStats = {
  total: number;
  top: { query: string; count: number }[];
  zero_result: { query: string; count: number }[];
};

type IntKey = "ga4" | "gsc" | "gtm";
const DEFS: Record<IntKey, { name: string; icon: string; field: string; placeholder: string; desc: string; settingKey: string }> = {
  ga4: { name: "Google Analytics 4", icon: "📈", field: "Measurement ID", placeholder: "G-XXXXXXXXXX", desc: "Track traffic, events & conversions", settingKey: "ga4_id" },
  gsc: { name: "Google Search Console", icon: "🔍", field: "Property URL", placeholder: "https://comfyclub.pk", desc: "Monitor rankings, impressions & CTR", settingKey: "search_console_property" },
  gtm: { name: "Google Tag Manager", icon: "🏷️", field: "Container ID", placeholder: "GTM-XXXXXXX", desc: "Manage tags without code changes", settingKey: "gtm_id" },
};

const SAMPLE_PAGES = [
  { label: "Homepage", page: "/", views: 3420, clicks: 187, ctr: "5.5%" },
  { label: "Sofa Chairs", page: "/sofas/sofa-chair/", views: 2890, clicks: 156, ctr: "5.4%" },
  { label: "2 Seater Sofas", page: "/seater-sofas/2-seater-sofas/", views: 2134, clicks: 98, ctr: "4.6%" },
  { label: "Sofa Cum Beds", page: "/sofas/sofa-come-bed/", views: 1876, clicks: 87, ctr: "4.6%" },
  { label: "Wingback Chair (PDP)", page: "/product/button-tufted-wingback-accent-chair/", views: 1234, clicks: 78, ctr: "6.3%" },
];
const SAMPLE_CTA = [
  { cta: "Product WhatsApp Order", clicks: 198, pct: 41 },
  { cta: "Product Request Quote", clicks: 102, pct: 21 },
  { cta: "Card WhatsApp Button", clicks: 87, pct: 18 },
  { cta: "Floating WhatsApp FAB", clicks: 54, pct: 11 },
  { cta: "Footer Chat Button", clicks: 46, pct: 9 },
];

export default function AnalyticsManager() {
  const toast = useToast();
  const [values, setValues] = useState<Record<IntKey, string>>({ ga4: "", gsc: "", gtm: "" });
  const [canEdit, setCanEdit] = useState(true);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [connect, setConnect] = useState<IntKey | null>(null);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setValues({
        ga4: String(r.data.data.ga4_id ?? ""),
        gsc: String(r.data.data.search_console_property ?? ""),
        gtm: String(r.data.data.gtm_id ?? ""),
      });
    });
    apiGet<{ data: SearchStats }>("/api/search/analytics").then((r) => r.ok && setStats(r.data.data));
  }, []);

  async function setIntegration(key: IntKey, value: string) {
    const res = await apiSend("/api/settings", "PATCH", { key: DEFS[key].settingKey, value });
    if (!res.ok) return toast.error("Could not save (admin only)");
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleConnect() {
    if (!connect || !input.trim()) return toast.error("Please enter a valid ID");
    setSaving(true);
    await setIntegration(connect, input.trim());
    setSaving(false);
    toast.success(`${DEFS[connect].name} connected`);
    setConnect(null);
    setInput("");
  }

  const anyConnected = Object.values(values).some(Boolean);

  const pageCols: Column<typeof SAMPLE_PAGES[number]>[] = [
    { key: "label", header: "Page", render: (r) => <div><div className="font-medium">{r.label}</div><div className="text-[11px] text-muted">{r.page}</div></div> },
    { key: "views", header: "Views", render: (r) => r.views.toLocaleString() },
    { key: "clicks", header: "WA Clicks", render: (r) => r.clicks },
    { key: "ctr", header: "CTR", render: (r) => r.ctr },
  ];

  return (
    <div>
      <DashPageHeader title="Analytics Overview" breadcrumbs={[{ label: "Analytics" }, { label: "Overview" }]} />

      {/* Integrations */}
      <DashSection title="Connected Integrations" subtitle="Connect Google Analytics, Search Console & Tag Manager to power your reports">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(DEFS) as IntKey[]).map((key) => {
            const def = DEFS[key];
            const conn = values[key];
            return (
              <div key={key} className={`flex flex-col gap-2.5 rounded-[10px] border p-4 ${conn ? "border-green-300 bg-green-50" : "border-line bg-white dark:border-white/10 dark:bg-white/5"}`}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-lg dark:border-white/10">{def.icon}</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-charcoal dark:text-cream">{def.name}</div>
                    <div className="text-[11px] text-muted">{def.desc}</div>
                  </div>
                </div>
                {conn ? (
                  <>
                    <div className="flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
                      <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-green-500" />
                      <span className="flex-1 truncate font-mono text-xs text-ink dark:text-cream">{conn}</span>
                    </div>
                    {canEdit && <DashBtn variant="ghost" size="sm" onClick={() => setIntegration(key, "")}>Disconnect</DashBtn>}
                  </>
                ) : (
                  canEdit
                    ? <DashBtn full size="sm" onClick={() => { setConnect(key); setInput(""); }}>Connect</DashBtn>
                    : <p className="text-[11px] text-muted">Ask an Admin to connect.</p>
                )}
              </div>
            );
          })}
        </div>
      </DashSection>

      {!anyConnected && (
        <div className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-[12px] text-blue-600">
          💡 The metrics below are sample figures. Connect GA4 &amp; Search Console above to see live numbers from your store.
        </div>
      )}

      {/* Metric cards */}
      <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        <DashCard label="Page Views (30d)" value="12,847" change={15} icon="👁️" tint="bg-blue-100" />
        <DashCard label="Organic Traffic" value="8,234" change={22} icon="🌐" tint="bg-green-100" />
        <DashCard label="WhatsApp Clicks" value="487" change={18} icon="💬" tint="bg-green-100" />
        <DashCard label="Impressions" value="45.2K" change={12} icon="📊" tint="bg-blue-100" />
        <DashCard label="Avg CTR" value="4.2%" icon="🖱️" tint="bg-blue-100" />
        <DashCard label="Avg Position" value="12.4" change={-3} icon="🏆" tint="bg-gold/15" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashSection title="Top Landing Pages" noPad>
          <DashTable columns={pageCols} rows={SAMPLE_PAGES} getId={(r) => r.page} />
        </DashSection>
        <DashSection title="CTA Click Distribution">
          {SAMPLE_CTA.map((c) => (
            <div key={c.cta} className="mb-3">
              <div className="mb-1 flex justify-between text-xs"><span>{c.cta}</span><span className="text-muted">{c.clicks} ({c.pct}%)</span></div>
              <DashProgress value={c.pct} max={100} color="#C9A84C" />
            </div>
          ))}
        </DashSection>
      </div>

      {/* Real site-search data */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <DashSection title="Top Site Searches" subtitle="Real searches logged on your storefront">
          {!stats ? <p className="text-sm text-muted">Loading…</p>
            : stats.top.length === 0 ? <p className="text-sm text-muted">No searches logged yet.</p>
            : (
              <ul className="space-y-1.5 text-sm">
                {stats.top.map((s) => <li key={s.query} className="flex justify-between"><span>{s.query}</span><span className="text-muted">{s.count}</span></li>)}
              </ul>
            )}
        </DashSection>
        <DashSection title="Zero-Result Searches" subtitle="Searches that found nothing — consider adding these products">
          {!stats ? <p className="text-sm text-muted">Loading…</p>
            : stats.zero_result.length === 0 ? <p className="text-sm text-muted">None — every search found results. 🎉</p>
            : (
              <ul className="space-y-1.5 text-sm">
                {stats.zero_result.map((s) => <li key={s.query} className="flex justify-between"><span>{s.query}</span><span className="text-amber-500">{s.count}</span></li>)}
              </ul>
            )}
        </DashSection>
      </div>

      {/* Connect modal */}
      <Modal open={!!connect} onClose={() => setConnect(null)} title={connect ? `Connect ${DEFS[connect].name}` : ""}
        footer={<><Button variant="ghost" onClick={() => setConnect(null)}>Cancel</Button><Button loading={saving} onClick={handleConnect}>Connect</Button></>}>
        {connect && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-panel p-3.5 dark:bg-white/5">
              <div className="text-2xl">{DEFS[connect].icon}</div>
              <p className="text-xs leading-relaxed text-muted">Paste your {DEFS[connect].field} below. Once saved, tracking activates across the public site automatically.</p>
            </div>
            <Field label={DEFS[connect].field}>
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={DEFS[connect].placeholder} />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
