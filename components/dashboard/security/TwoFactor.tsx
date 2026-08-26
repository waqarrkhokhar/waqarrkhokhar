"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-5" style={{ background: "linear-gradient(135deg, #0F1D35 0%, #1a2d4d 50%, #0F1D35 100%)" }}>
      <div className="w-[440px] max-w-full overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="bg-navy px-8 pb-7 pt-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/comfyclub-logo.png" alt="ComfyClub" className="mx-auto h-9" style={{ filter: "brightness(1.5)" }} />
          <div className="mt-2 text-[11px] uppercase tracking-[2px] text-gold/70">Two-Step Verification</div>
        </div>
        <div className="p-8">
          <h2 className="mb-1.5 font-heading text-[22px] font-semibold text-charcoal">{title}</h2>
          <p className="mb-6 text-[13px] leading-relaxed text-[#8b8fa7]">{subtitle}</p>
          {children}
          <button
            type="button"
            onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }).catch(() => {}); window.location.href = "/dashboard/login"; }}
            className="mt-4 block w-full text-[13px] font-medium text-[#8b8fa7]"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function CodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      placeholder="000000"
      className="w-full rounded-lg border border-[#e8e8ee] px-3.5 py-3 text-center text-[22px] tracking-[8px] text-charcoal outline-none transition focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]"
      autoFocus
    />
  );
}

async function verify(factorId: string, code: string) {
  const res = await fetch("/api/auth/mfa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify", factorId, code }) });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, error: json.error as string | undefined };
}

/** First-time enrollment: show QR, confirm a code. */
export function TwoFactorSetup() {
  const router = useRouter();
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/mfa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "enroll" }) });
      const json = await res.json().catch(() => ({}));
      setLoading(false);
      if (!res.ok) { setError(json.error ?? "Could not start setup"); return; }
      setQr(json.data.qr); setSecret(json.data.secret); setFactorId(json.data.factorId);
    })();
  }, []);

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const r = await verify(factorId, code);
    setBusy(false);
    if (!r.ok) { setError(r.error ?? "Invalid code"); setCode(""); return; }
    router.replace("/dashboard"); router.refresh();
  }

  return (
    <Shell title="Set up 2-step verification" subtitle="Scan this QR code with Google Authenticator, Authy, or any authenticator app — then enter the 6-digit code it shows.">
      {loading ? (
        <p className="text-sm text-[#8b8fa7]">Preparing…</p>
      ) : (
        <>
          {qr && (
            <div className="mx-auto mb-3 w-[210px] rounded-lg bg-white p-3 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr.startsWith("data:") || qr.startsWith("http") ? qr : `data:image/svg+xml;utf8,${encodeURIComponent(qr)}`}
                alt="Scan this QR code with your authenticator app"
                className="h-[186px] w-[186px]"
              />
            </div>
          )}
          {secret && (
            <div className="mb-4 rounded-md bg-panel px-3 py-2.5 text-center">
              <div className="text-[11px] text-[#8b8fa7]">Can&apos;t scan? In your app choose &ldquo;Enter a setup key&rdquo; and paste this ({secret.length} characters — don&apos;t retype it):</div>
              <div className="mt-1 break-all font-mono text-[13px] tracking-wide text-charcoal">{secret}</div>
              <button
                type="button"
                onClick={() => { navigator.clipboard?.writeText(secret); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="mt-1.5 text-[12px] font-semibold text-gold"
              >
                {copied ? "✓ Copied" : "Copy key"}
              </button>
            </div>
          )}
          <form onSubmit={confirm}>
            <label className="mb-1.5 block text-[12px] font-medium text-[#3a3f51]">6-digit code</label>
            <CodeInput value={code} onChange={setCode} />
            {error && <div className="mt-3 rounded-md bg-red-100 px-3 py-2 text-[12px] text-red-600">{error}</div>}
            <button type="submit" disabled={busy || code.length !== 6} className="mt-4 w-full rounded-lg bg-gold px-5 py-[13px] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(201,168,76,0.3)] transition disabled:opacity-50">
              {busy ? "Verifying…" : "Turn on 2-step verification"}
            </button>
          </form>
        </>
      )}
    </Shell>
  );
}

/** Login challenge: enter the current code from the app. */
export function TwoFactorChallenge() {
  const router = useRouter();
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/mfa").then((r) => r.json()).then((j) => setFactorId(j.data?.factorId ?? "")).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const r = await verify(factorId, code);
    setBusy(false);
    if (!r.ok) { setError(r.error ?? "Invalid code"); setCode(""); return; }
    router.replace("/dashboard"); router.refresh();
  }

  return (
    <Shell title="Enter your code" subtitle="Open your authenticator app and enter the current 6-digit code for ComfyClub.">
      <form onSubmit={submit}>
        <CodeInput value={code} onChange={setCode} />
        {error && <div className="mt-3 rounded-md bg-red-100 px-3 py-2 text-[12px] text-red-600">{error}</div>}
        <button type="submit" disabled={busy || code.length !== 6} className="mt-4 w-full rounded-lg bg-gold px-5 py-[13px] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(201,168,76,0.3)] transition disabled:opacity-50">
          {busy ? "Verifying…" : "Verify & continue"}
        </button>
      </form>
    </Shell>
  );
}
