"use client";

import { useEffect, useState } from "react";
import { DashSection, DashBtn } from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Session = {
  id: string;
  device: string;
  browser: string;
  location: string | null;
  ip: string | null;
  created_at: string;
  last_active: string;
  current: boolean;
};

function fmt(d: string) {
  try {
    return new Date(d).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return d;
  }
}

function deviceIcon(device: string) {
  if (/iPhone|Android phone/.test(device)) return "📱";
  if (/iPad|tablet/.test(device)) return "📲";
  if (/Mac|Windows|Linux|PC/.test(device)) return "💻";
  return "🖥️";
}

export default function SessionsManager() {
  const toast = useToast();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);

  async function load() {
    const r = await apiGet<{ data: Session[] }>("/api/auth/sessions");
    setSessions(r.ok ? r.data.data : []);
  }
  useEffect(() => {
    load();
  }, []);

  async function terminate(id: string) {
    setBusy(id);
    const r = await apiSend(`/api/auth/sessions?id=${id}`, "DELETE");
    setBusy(null);
    if (!r.ok) return toast.error(r.error || "Could not sign out that device");
    toast.success("That device has been signed out");
    load();
  }

  async function terminateOthers() {
    setConfirmAll(false);
    setBusy("others");
    const r = await apiSend(`/api/auth/sessions?others=1`, "DELETE");
    setBusy(null);
    if (!r.ok) return toast.error(r.error || "Could not sign out other devices");
    toast.success("Signed out all other devices");
    load();
  }

  const others = (sessions ?? []).filter((s) => !s.current).length;

  return (
    <DashSection
      title="Active Login Sessions"
      subtitle="Devices currently signed in to your ComfyClub dashboard"
      actions={
        others > 0 ? (
          <DashBtn variant="ghost" size="sm" onClick={() => setConfirmAll(true)} disabled={busy === "others"}>
            {busy === "others" ? "Signing out…" : "Sign out all other devices"}
          </DashBtn>
        ) : undefined
      }
    >
      {sessions === null ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-muted">No active sessions found.</p>
      ) : (
        <ul className="space-y-2.5">
          {sessions.map((s) => (
            <li
              key={s.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3.5 ${
                s.current ? "border-green-300 bg-green-50 dark:border-green-500/30 dark:bg-green-500/5" : "border-line dark:border-white/10"
              }`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-ink dark:text-cream">
                  <span aria-hidden>{deviceIcon(s.device)}</span>
                  <span className="truncate">{s.browser} on {s.device}</span>
                  {s.current && <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">This device</span>}
                </div>
                <div className="mt-1 text-[12px] text-muted">📍 {s.location || "Location unavailable"}{s.ip ? ` · ${s.ip}` : ""}</div>
                <div className="text-[12px] text-muted">🕑 Last active {fmt(s.last_active)} &nbsp;·&nbsp; Signed in {fmt(s.created_at)}</div>
              </div>
              {!s.current && (
                <DashBtn variant="secondary" size="sm" onClick={() => terminate(s.id)} disabled={busy === s.id}>
                  {busy === s.id ? "Signing out…" : "Terminate"}
                </DashBtn>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[12px] text-muted">
        Location is estimated from each device&apos;s IP address and may be approximate. If you don&apos;t recognise a device, terminate it and change your password.
      </p>

      <ConfirmDialog
        open={confirmAll}
        onClose={() => setConfirmAll(false)}
        onConfirm={terminateOthers}
        title="Sign out all other devices?"
        message="This ends every session except the one you're using right now. Those devices will need to log in again."
        confirmLabel="Sign out others"
      />
    </DashSection>
  );
}
