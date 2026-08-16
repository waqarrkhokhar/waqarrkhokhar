"use client";

import { useEffect, useState } from "react";
import { DashSection, DashBtn } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

export default function TwoFactorCard({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const toast = useToast();
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [required, setRequired] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await apiGet<{ data: { enrolled: boolean; factorId: string | null } }>("/api/auth/mfa");
    if (r.ok) { setEnrolled(r.data.data.enrolled); setFactorId(r.data.data.factorId); } else setEnrolled(false);
    if (isSuperAdmin) {
      const s = await apiGet<{ data: Record<string, unknown> }>("/api/settings");
      if (s.ok) setRequired(s.data.data.mfa_required === true);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function disable() {
    if (!factorId) return;
    setBusy(true);
    const r = await apiSend("/api/auth/mfa", "POST", { action: "disable", factorId });
    setBusy(false);
    if (!r.ok) return toast.error(r.error || "Could not turn off 2FA");
    toast.success("2-step verification turned off");
    load();
  }

  async function toggleRequired(v: boolean) {
    setBusy(true);
    const r = await apiSend("/api/settings", "PATCH", { key: "mfa_required", value: v });
    setBusy(false);
    if (!r.ok) return toast.error(r.error || "Could not save");
    setRequired(v);
    toast.success(v ? "2FA is now required for all admins" : "2FA requirement turned off");
  }

  return (
    <DashSection title="Two-Step Verification (2FA)" subtitle="Protect the dashboard with a 6-digit code from an authenticator app">
      {enrolled === null ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3.5 dark:border-white/10">
            <div>
              <div className="text-[14px] font-semibold text-ink dark:text-cream">Your account</div>
              <div className="text-[12px] text-muted">{enrolled ? "✅ 2-step verification is ON" : "⚠️ Not set up yet"}</div>
            </div>
            {enrolled ? (
              <DashBtn variant="secondary" size="sm" onClick={disable} disabled={busy}>Turn off</DashBtn>
            ) : (
              <a href="/dashboard/2fa-setup"><DashBtn size="sm">Set up 2FA</DashBtn></a>
            )}
          </div>

          {isSuperAdmin && (
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-line p-3.5 dark:border-white/10">
              <div>
                <div className="text-[14px] font-semibold text-ink dark:text-cream">Require 2FA for all admins</div>
                <div className="text-[12px] text-muted">When ON, every admin must set up 2FA before using the dashboard. Set up your own first so you don&apos;t get locked out.</div>
              </div>
              <input type="checkbox" checked={required} onChange={(e) => toggleRequired(e.target.checked)} disabled={busy} className="h-5 w-5 flex-shrink-0 accent-gold" />
            </label>
          )}
        </div>
      )}
    </DashSection>
  );
}
