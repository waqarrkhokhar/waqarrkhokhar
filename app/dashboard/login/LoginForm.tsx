"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "forgot";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Something went wrong");
      return;
    }
    setNotice("If that email is registered, a reset link is on its way.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="mb-8 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">
            ComfyClub
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-cream">
            {mode === "login" ? "Dashboard Login" : "Reset Password"}
          </h1>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        {notice && (
          <p className="mb-4 rounded-lg bg-green-500/15 px-3 py-2 text-sm text-green-200">
            {notice}
          </p>
        )}

        <form
          onSubmit={mode === "login" ? handleLogin : handleForgot}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm text-cream/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-navy/60 px-3 py-2 text-cream outline-none focus:border-gold"
              placeholder="you@comfyclub.pk"
            />
          </div>

          {mode === "login" && (
            <div>
              <label className="mb-1 block text-sm text-cream/80">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-navy/60 px-3 py-2 text-cream outline-none focus:border-gold"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-2.5 font-medium text-navy transition hover:bg-gold/90 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Log In"
                : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "forgot" : "login");
            setError(null);
            setNotice(null);
          }}
          className="mt-5 w-full text-center text-sm text-cream/60 transition hover:text-gold"
        >
          {mode === "login"
            ? "Forgot your password?"
            : "← Back to login"}
        </button>
      </div>
    </main>
  );
}
