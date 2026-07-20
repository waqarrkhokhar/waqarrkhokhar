"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashCard, DashBtn } from "@/components/dashboard/shared/Dash";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type SearchStats = { total: number; top: { query: string; count: number }[]; zero_result: { query: string; count: number }[] };
type LeadStats = { total: number; this_week: number; this_month: number; by_type: Record<string, number> };
type Ga4 = { totals: { pageViews: number; users: number; sessions: number }; topPages: { path: string; views: number }[] };
type Gsc = { totals: { clicks: number; impressions: number; ctr: number; position: number }; topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[] };
type Live = { configured: boolean; ga4: Ga4 | null; gsc: Gsc | null; ga4_error?: string | null; gsc_error?: string | null };
const num = (n: number) => n.toLocaleString();

// Google Search Console *ownership verification* is managed in ONE place only:
// Dashboard → SEO → Site Verification. It is deliberately NOT duplicated here,
// so a blank box on this screen can never overwrite (wipe) the live tag.
type IntKey = "ga4" | "gtm";
const DEFS: Record<IntKey, { name: string; icon: string; field: string; placeholder: string; desc: string; settingKey: string; manage: string; activeLabel: string }> = {
  ga4: { name: "Google Analytics 4", icon: "📈", field: "Measurement ID", placeholder: "G-XXXXXXXXXX", desc: "Live traffic & event tracking", settingKey: "ga4_id", manage: "https://analytics.google.com", activeLabel: "Tracking active on the live site" },
  gtm: { name: "Google Tag Manager", icon: "🏷️", field: "Container ID", placeholder: "GTM-XXXXXXX", desc: "Tag management without code", settingKey: "gtm_id", manage: "https://tagmanager.google.com", activeLabel: "Container loaded on the live site" },
};

export default function AnalyticsManager() {
  const toast = useToast();
  const [values, setValues] = useState<Record<IntKey, string>>({ ga4: "", gtm: "" });
  const [canEdit, setCanEdit] = useState(true);
  const [search, setSearch] = useState<SearchStats | null>(null);
  const [leads, setLeads] = useState<LeadStats | null>(null);
  const [connect, setConnect] = useState<IntKey | null>(null);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [live, setLive] = useState<Live | null>(null);
  const [propId, setPropId] = useState("");
  const [savingProp, setSavingProp] = useState(false);
  const [gscProp, setGscProp] = useState("");
  const [savingGsc, setSavingGsc] = useState(false);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setValues({
        ga4: String(r.data.data.ga4_id ?? ""),
        gtm: String(r.data.data.gtm_id ?? ""),
      });
      setPropId(String(r.data.data.ga4_property_id ?? ""));
      setGscProp(String(r.data.data.search_console_property ?? ""));
    });
    apiGet<{ data: SearchStats }>("/api/search/analytics").then((r) => r.ok && setSearch(r.data.data));
    apiGet<{ data: LeadStats }>("/api/leads/stats").then((r) => r.ok && setLeads(r.data.data));
    apiGet<{ data: Live }>("/api/analytics/google").then((r) => r.ok && setLive(r.data.data));
  }, []);

  function refreshLive() {
    apiGet<{ data: Live }>("/api/analytics/google").then((r) => r.ok && setLive(r.data.data));
  }

  const [refreshing, setRefreshing] = useState(false);

  async function refreshNow() {
    setRefreshing(true);
    const r = await apiGet<{ data: Live }>("/api/analytics/google");
    setRefreshing(false);
    if (r.ok) {
      setLive(r.data.data);
      toast.success("Refreshed");
    } else {
      toast.error("Could not refresh");
    }
  }

  async function saveProp() {
    if (!propId.trim()) return toast.error("Enter your GA4 Property ID first");
    setSavingProp(true);
    const res = await apiSend("/api/settings", "PATCH", { key: "ga4_property_id", value: propId.trim() });
    setSavingProp(false);
    if (!res.ok) return toast.error("Could not save (admin only)");
    toast.success("GA4 Property ID saved — checking for data…");
    refreshLive();
  }

  async function saveGscProp() {
    if (!gscProp.trim()) return toast.error("Enter your Search Console property first");
    setSavingGsc(true);
    const res = await apiSend("/api/settings", "PATCH", { key: "search_console_property", value: gscProp.trim() });
    setSavingGsc(false);
    if (!res.ok) return toast.error("Could not save (admin only)");
    toast.success("Search Console property saved — checking for data…");
    refreshLive();
  }

  async function setIntegration(key: IntKey, value: string) {
    const res = await apiSend("/api/settings", "PATCH", { key: DEFS[key].settingKey, value });
    if (!res.ok) return toast.error("Could not save (admin only)");
    setValues((v) => ({ ...v, [key]: value }));
    toast.success(value ? `${DEFS[key].name} connected` : `${DEFS[key].name} disconnected`);
  }

  async function handleConnect() {
    if (!connect || !input.trim()) return toast.error("Please enter a valid value");
    setSaving(true);
    await setIntegration(connect, input.trim());
    setSaving(false);
    setConnect(null);
    setInput("");
  }

  return (
    <div>
      <DashPageHeader title="Analytics" subtitle="Connect your Google properties and view your real store activity"
        breadcrumbs={[{ label: "Analytics" }, { label: "Overview" }]} />

      {/* Integrations - real connections */}
      <DashSection title="Connected Integrations" subtitle="Connecting GA4 / GTM activates tracking on the live site; Search Console verifies ownership">
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
                    <p className="text-[11px] text-green-700">✓ {def.activeLabel}</p>
                    <div className="flex gap-1.5">
                      <a href={def.manage} target="_blank" rel="noopener noreferrer" className="flex-1"><DashBtn variant="secondary" size="sm" full>Open in Google</DashBtn></a>
                      {canEdit && <DashBtn variant="ghost" size="sm" onClick={() => setIntegration(key, "")}>Disconnect</DashBtn>}
                    </div>
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

      {/* Live Google reports (last 28 days) */}
      {live && !live.configured && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-700">
          🔌 Live GA4 &amp; Search Console data isn&apos;t connected yet. Add a Google service-account key (free): set <code>GOOGLE_SERVICE_ACCOUNT_JSON</code> in Vercel and redeploy, then enter your GA4 Property ID below.
        </div>
      )}

      <DashSection title="Google Analytics — Last 28 Days" subtitle="Live from your GA4 property"
        actions={
          <div className="flex gap-1.5">
            <DashBtn variant="ghost" size="sm" onClick={refreshNow} disabled={refreshing}>{refreshing ? "Refreshing…" : "↻ Refresh"}</DashBtn>
            <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"><DashBtn variant="ghost" size="sm">Open GA4 →</DashBtn></a>
          </div>
        }>
        {/* Property ID input — always available */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="GA4 Property ID (numeric — GA4 → Admin → Property Settings)">
              <Input value={propId} onChange={(e) => setPropId(e.target.value)} placeholder="123456789" />
            </Field>
          </div>
          <Button loading={savingProp} onClick={saveProp} className="w-full sm:w-auto">Save</Button>
        </div>

        {propId && live?.ga4 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5">
              <DashCard label="Page Views" value={num(live.ga4.totals.pageViews)} icon="👁️" tint="bg-blue-100" />
              <DashCard label="Active Users" value={num(live.ga4.totals.users)} icon="👤" tint="bg-green-100" />
              <DashCard label="Sessions" value={num(live.ga4.totals.sessions)} icon="📊" tint="bg-gold/15" />
            </div>
            {live.ga4.topPages.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-xs font-semibold text-muted">Top Pages</div>
                <ul className="space-y-1.5 text-sm">
                  {live.ga4.topPages.map((p) => <li key={p.path} className="flex justify-between gap-3"><span className="truncate">{p.path}</span><span className="flex-shrink-0 text-muted">{num(p.views)}</span></li>)}
                </ul>
              </div>
            )}
          </>
        ) : propId ? (
          <div className="rounded-md bg-amber-50 px-3 py-2.5 text-[12px] text-amber-700">
            {live?.ga4_error && <p className="mb-1"><strong>Status:</strong> {live.ga4_error}</p>}
            <p>Next: make sure the service-account email has <strong>Viewer</strong> access in GA4 (Admin → Property Access Management). New GA4 data also takes ~24–48h to appear. Then tap <strong>↻ Refresh</strong>.</p>
          </div>
        ) : (
          <p className="text-sm text-muted">Enter your GA4 Property ID above and tap Save to pull live traffic.</p>
        )}
      </DashSection>

      <DashSection title="Search Console — Last 28 Days" subtitle="Live clicks, impressions & rankings"
        actions={
          <div className="flex gap-1.5">
            <DashBtn variant="ghost" size="sm" onClick={refreshNow} disabled={refreshing}>{refreshing ? "Refreshing…" : "↻ Refresh"}</DashBtn>
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"><DashBtn variant="ghost" size="sm">Open GSC →</DashBtn></a>
          </div>
        }>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Search Console property (e.g. sc-domain:comfyclub.pk or https://comfyclub.pk/)">
              <Input value={gscProp} onChange={(e) => setGscProp(e.target.value)} placeholder="sc-domain:comfyclub.pk" />
            </Field>
          </div>
          <Button loading={savingGsc} onClick={saveGscProp} className="w-full sm:w-auto">Save</Button>
        </div>

        {gscProp && live?.gsc ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4">
              <DashCard label="Clicks" value={num(live.gsc.totals.clicks)} icon="🖱️" tint="bg-green-100" />
              <DashCard label="Impressions" value={num(live.gsc.totals.impressions)} icon="📊" tint="bg-blue-100" />
              <DashCard label="Avg CTR" value={`${(live.gsc.totals.ctr * 100).toFixed(1)}%`} icon="📈" tint="bg-blue-100" />
              <DashCard label="Avg Position" value={live.gsc.totals.position.toFixed(1)} icon="🏆" tint="bg-gold/15" />
            </div>
            {live.gsc.topQueries.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-xs font-semibold text-muted">Top Search Queries</div>
                <ul className="space-y-1.5 text-sm">
                  {live.gsc.topQueries.map((q) => <li key={q.query} className="flex justify-between gap-3"><span className="truncate">{q.query}</span><span className="flex-shrink-0 text-muted">{num(q.clicks)} clicks · pos {q.position.toFixed(1)}</span></li>)}
                </ul>
              </div>
            )}
          </>
        ) : gscProp ? (
          <div className="rounded-md bg-amber-50 px-3 py-2.5 text-[12px] text-amber-700">
            {live?.gsc_error && <p className="mb-1"><strong>Status:</strong> {live.gsc_error}</p>}
            <p>Next: add the service-account email as a <strong>user</strong> in Search Console (Settings → Users and permissions). Data takes 2–3 days to appear. Then tap <strong>↻ Refresh</strong>.</p>
          </div>
        ) : (
          <p className="text-sm text-muted">Enter your Search Console property above and tap Save to pull live rankings.</p>
        )}
      </DashSection>

      {/* Real store activity */}
      <DashSection title="Store Activity" subtitle="Real numbers from your storefront">
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <DashCard label="WhatsApp Leads (Total)" value={leads?.total ?? "-"} icon="💬" tint="bg-green-100" href="/dashboard/leads" />
          <DashCard label="Leads This Month" value={leads?.this_month ?? "-"} icon="📈" tint="bg-blue-100" href="/dashboard/leads" />
          <DashCard label="Orders via WhatsApp" value={leads?.by_type?.order ?? "-"} icon="🛒" tint="bg-gold/15" href="/dashboard/leads" />
          <DashCard label="Site Searches" value={search?.total ?? "-"} icon="🔎" tint="bg-blue-100" />
        </div>
      </DashSection>

      <div className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-[12px] text-blue-600">
        💡 Traffic, impressions and ranking reports live inside Google Analytics &amp; Search Console. Once connected above, open them with the “Open in Google” buttons. In-dashboard charts from Google&apos;s APIs are a later phase.
      </div>

      {/* Real site search */}
      <div className="grid gap-5 lg:grid-cols-2">
        <DashSection title="Top Site Searches" subtitle="What visitors search for on your store">
          {!search ? <p className="text-sm text-muted">Loading…</p>
            : search.top.length === 0 ? <p className="text-sm text-muted">No searches logged yet.</p>
            : <ul className="space-y-1.5 text-sm">{search.top.map((s) => <li key={s.query} className="flex justify-between"><span>{s.query}</span><span className="text-muted">{s.count}</span></li>)}</ul>}
        </DashSection>
        <DashSection title="Zero-Result Searches" subtitle="Searches that found nothing - consider adding these products">
          {!search ? <p className="text-sm text-muted">Loading…</p>
            : search.zero_result.length === 0 ? <p className="text-sm text-muted">None - every search found results. 🎉</p>
            : <ul className="space-y-1.5 text-sm">{search.zero_result.map((s) => <li key={s.query} className="flex justify-between"><span>{s.query}</span><span className="text-amber-500">{s.count}</span></li>)}</ul>}
        </DashSection>
      </div>

      <Modal open={!!connect} onClose={() => setConnect(null)} title={connect ? `Connect ${DEFS[connect].name}` : ""}
        footer={<><Button variant="ghost" onClick={() => setConnect(null)}>Cancel</Button><Button loading={saving} onClick={handleConnect}>Connect</Button></>}>
        {connect && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-panel p-3.5 dark:bg-white/5">
              <div className="text-2xl">{DEFS[connect].icon}</div>
              <p className="text-xs leading-relaxed text-muted">
                {`Paste your ${DEFS[connect].field}. Once saved, it activates on the live site automatically.`}
              </p>
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
