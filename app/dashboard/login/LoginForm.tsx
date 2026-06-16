"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "forgot";

function LoginInput({
  label, type, value, onChange, placeholder, children,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative mb-4">
      <label className="mb-1.5 block text-[12px] font-medium text-[#3a3f51]">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#e8e8ee] px-3.5 py-[11px] text-[14px] text-[#3a3f51] outline-none transition focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]"
      />
      {children}
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Login failed");
      return;
    }
    router.replace(redirect);
    router.refresh();
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong");
      return;
    }
    setResetSent(true);
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-5"
      style={{ background: "linear-gradient(135deg, #0F1D35 0%, #1a2d4d 50%, #0F1D35 100%)" }}
    >
      <div className="w-[420px] max-w-full overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        {/* Header */}
        <div className="bg-navy px-8 pb-7 pt-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/comfyclub-logo.png" alt="ComfyClub" className="mx-auto h-9" style={{ filter: "brightness(1.5)" }} />
          <div className="mt-2 text-[11px] uppercase tracking-[2px] text-gold/70">Content Management System</div>
        </div>

        {/* Body */}
        <div className="p-8">
          {mode === "forgot" ? (
            <>
              <h2 className="mb-1.5 font-heading text-[22px] font-semibold text-charcoal">Reset Password</h2>
              <p className="mb-6 text-[13px] leading-relaxed text-[#8b8fa7]">
                Enter your email address and we&apos;ll send you a reset link.
              </p>

              {resetSent ? (
                <div className="mb-4 rounded-[10px] bg-green-100 p-5 text-center">
                  <div className="mb-2 text-[32px]">✓</div>
                  <div className="text-[14px] font-semibold text-green-600">Reset link sent!</div>
                  <div className="mt-1 text-[12px] text-[#666]">Check your inbox for the password reset link.</div>
                </div>
              ) : (
                <form onSubmit={handleForgot}>
                  <LoginInput label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@comfyclub.pk" />
                  {error && <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-[12px] text-red-600">{error}</div>}
                  <button type="submit" disabled={loading} className="w-full rounded-lg bg-gold px-5 py-[13px] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(201,168,76,0.3)] transition disabled:opacity-70">
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              )}

              <button
                onClick={() => { setMode("login"); setResetSent(false); setError(null); }}
                className="mt-4 block w-full text-[13px] font-medium text-gold"
              >
                ← Back to Login
              </button>
            </>
          ) : (
            <>
              <h2 className="mb-1.5 font-heading text-[22px] font-semibold text-charcoal">Welcome Back</h2>
              <p className="mb-6 text-[13px] text-[#8b8fa7]">Sign in to your dashboard</p>

              <form onSubmit={handleLogin}>
                <LoginInput label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@comfyclub.pk" />
                <LoginInput
                  label="Password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter your password"
                >
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-[34px] text-[11px] text-[#8b8fa7]"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </LoginInput>

                {error && <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-[12px] text-red-600">{error}</div>}

                <div className="mb-5 flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="accent-gold" />
                    <span className="text-[12px] text-[#8b8fa7]">Remember me</span>
                  </label>
                  <button type="button" onClick={() => { setMode("forgot"); setError(null); }} className="text-[12px] font-medium text-gold">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" disabled={loading} className="w-full rounded-lg bg-gold px-5 py-[13px] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(201,168,76,0.3)] transition disabled:opacity-70">
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#e8e8ee] px-8 py-4 text-center">
          <span className="text-[11px] text-[#8b8fa7]">© 2026 ComfyClub · Lahore, Pakistan</span>
        </div>
      </div>
    </div>
  );
}
