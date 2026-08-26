"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm({
  initialError,
}: {
  initialError: string | null;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }
    // Security: changing the password signs out every OTHER device/session for
    // this account, so anyone previously logged in must sign in again.
    await supabase.auth.signOut({ scope: "others" }).catch(() => {});
    setLoading(false);
    setDone(true);
    setTimeout(() => router.replace("/dashboard/login"), 1800);
  }

  if (done) {
    return (
      <p className="rounded-lg bg-green-500/15 px-3 py-2 text-center text-sm text-green-200">
        Password updated! Redirecting you to login…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm text-cream/80">New password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-navy/60 px-3 py-2 text-cream outline-none focus:border-gold"
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-cream/80">
          Confirm password
        </label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-navy/60 px-3 py-2 text-cream outline-none focus:border-gold"
          placeholder="Re-enter password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gold py-2.5 font-medium text-navy transition hover:bg-gold/90 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Update Password"}
      </button>
    </form>
  );
}
