"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api/client";

type Counts = { pending_reviews: number; new_leads: number; unresolved_404s: number; total: number };
const EMPTY: Counts = { pending_reviews: 0, new_leads: 0, unresolved_404s: 0, total: 0 };
const SEEN_KEY = "cc_notif_seen";

/**
 * Notification bell. Polls /api/notifications every 60s. The badge shows the
 * unread total and CLEARS once you open the panel (it re-appears only when a
 * new item arrives). The list is scrollable with a subtle scrollbar.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Counts>(EMPTY);
  const [seen, setSeen] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchCounts = useCallback(async () => {
    const res = await apiGet<{ data: Counts }>("/api/notifications");
    if (res.ok) setCounts(res.data.data);
  }, []);

  useEffect(() => {
    setSeen(Number(localStorage.getItem(SEEN_KEY) || 0));
    fetchCounts();
    const t = setInterval(fetchCounts, 60000);
    return () => clearInterval(t);
  }, [fetchCounts]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next) {
        setSeen(counts.total);
        try { localStorage.setItem(SEEN_KEY, String(counts.total)); } catch { /* ignore */ }
      }
      return next;
    });
  }

  const items: { href: string; icon: string; label: string; count: number; tint: string }[] = [
    { href: "/dashboard/leads", icon: "💬", label: "new WhatsApp lead", count: counts.new_leads, tint: "bg-green-100 text-green-700" },
    { href: "/dashboard/reviews", icon: "⭐", label: "review awaiting moderation", count: counts.pending_reviews, tint: "bg-amber-100 text-amber-700" },
    { href: "/dashboard/seo/redirects", icon: "🚧", label: "unresolved broken link (404)", count: counts.unresolved_404s, tint: "bg-red-100 text-red-600" },
  ].filter((i) => i.count > 0);

  const showBadge = counts.total > seen;

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggle} aria-label="Notifications"
        className="relative rounded-lg p-2 text-ink transition hover:bg-black/5 dark:text-cream dark:hover:bg-white/10">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {showBadge && (
          <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold tabular-nums text-white ring-2 ring-white dark:ring-[#191f2e]">
            {counts.total > 99 ? "99+" : counts.total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-white/90 shadow-pop backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 dark:border-white/10 dark:bg-[#191f2e]/90 dark:supports-[backdrop-filter]:bg-[#191f2e]/80">
          <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-white/10">
            <span className="text-[14px] font-semibold text-charcoal dark:text-cream">Notifications</span>
            {items.length > 0 && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold">{counts.total} to review</span>
            )}
          </div>
          <div className="dash-scroll max-h-[340px] overflow-y-auto p-1.5">
            {items.length > 0 ? (
              items.map((i) => (
                <Link key={i.href} href={i.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                  <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[15px] ${i.tint}`}>{i.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium leading-tight text-charcoal dark:text-cream">
                      {i.count} {i.label}{i.count > 1 ? "s" : ""}
                    </span>
                    <span className="text-[11.5px] text-muted">Tap to review →</span>
                  </span>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 px-3 py-10 text-center">
                <span className="text-2xl">✅</span>
                <span className="text-[13.5px] text-muted">You&apos;re all caught up.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
