"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type SearchStats = {
  total: number;
  top: { query: string; count: number }[];
  zero_result: { query: string; count: number }[];
};

export default function AnalyticsManager() {
  const toast = useToast();
  const [ga4, setGa4] = useState("");
  const [gtm, setGtm] = useState("");
  const [gsc, setGsc] = useState("");
  const [canEditSettings, setCanEditSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<SearchStats | null>(null);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (!r.ok) { setCanEditSettings(false); return; }
      setGa4(String(r.data.data.ga4_id ?? ""));
      setGtm(String(r.data.data.gtm_id ?? ""));
      setGsc(String(r.data.data.search_console_property ?? ""));
    });
    apiGet<{ data: SearchStats }>("/api/search/analytics").then((r) => r.ok && setStats(r.data.data));
  }, []);

  async function save() {
    setSaving(true);
    const calls = [
      apiSend("/api/settings", "PATCH", { key: "ga4_id", value: ga4.trim() }),
      apiSend("/api/settings", "PATCH", { key: "gtm_id", value: gtm.trim() }),
      apiSend("/api/settings", "PATCH", { key: "search_console_property", value: gsc.trim() }),
    ];
    const res = await Promise.all(calls);
    setSaving(false);
    if (res.some((r) => !r.ok)) return toast.error("Could not save (admin only)");
    toast.success("Analytics settings saved");
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-semibold">Analytics</h2>

      {/* Connections */}
      <section className="rounded-[10px] border border-line bg-white p-5 shadow-card dark:border-white/10 dark:bg-[#191f2e]">
        <h3 className="mb-3 font-heading text-lg font-semibold">Connections</h3>
        {canEditSettings ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="GA4 Measurement ID" hint="e.g. G-XXXXXXXXXX">
                <Input value={ga4} onChange={(e) => setGa4(e.target.value)} placeholder="G-XXXXXXXXXX" />
              </Field>
              <Field label="GTM Container ID" hint="optional">
                <Input value={gtm} onChange={(e) => setGtm(e.target.value)} placeholder="GTM-XXXXXXX" />
              </Field>
              <Field label="Search Console property">
                <Input value={gsc} onChange={(e) => setGsc(e.target.value)} placeholder="https://comfyclub.pk" />
              </Field>
            </div>
            <div className="mt-3">
              <Button size="sm" loading={saving} onClick={save}>Save</Button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Once a GA4 ID is saved, tracking activates across the public site automatically.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted">Ask an Admin to configure the GA4 / GTM IDs.</p>
        )}
      </section>

      {/* Search analytics */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[10px] border border-line bg-white p-5 shadow-card dark:border-white/10 dark:bg-[#191f2e]">
          <h3 className="mb-3 font-heading text-lg font-semibold">Top searches</h3>
          {!stats ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : stats.top.length === 0 ? (
            <p className="text-sm text-muted">No searches logged yet.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {stats.top.map((s) => (
                <li key={s.query} className="flex justify-between">
                  <span>{s.query}</span>
                  <span className="text-muted">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[10px] border border-line bg-white p-5 shadow-card dark:border-white/10 dark:bg-[#191f2e]">
          <h3 className="mb-3 font-heading text-lg font-semibold">Zero-result searches</h3>
          <p className="mb-2 text-xs text-muted">Searches that returned nothing — consider adding these products.</p>
          {!stats ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : stats.zero_result.length === 0 ? (
            <p className="text-sm text-muted">None — every search found results. 🎉</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {stats.zero_result.map((s) => (
                <li key={s.query} className="flex justify-between">
                  <span>{s.query}</span>
                  <span className="text-amber-500">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
