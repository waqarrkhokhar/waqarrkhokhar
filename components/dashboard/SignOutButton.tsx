"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/dashboard/login");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      disabled={loading}
      className="rounded-lg px-2 py-1 text-sm text-red-500 hover:bg-red-500/10 disabled:opacity-60"
    >
      {loading ? "…" : "Log out"}
    </button>
  );
}
