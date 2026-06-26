"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api/client";

type Counts = { pending_reviews: number; new_leads: number; unresolved_404s: number; total: number };
const EMPTY: Counts = { pending_reviews: 0, new_leads: 0, unresolved_404s: 0, total: 0 };

/**
 * Notification bell. Polls /api/notifications every 60s for the counts the
 * current user is allowed to see (pending reviews, new WhatsApp leads,
 * unresolved 404s) and shows them as a badge + dropdown list.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Counts>(EMPTY);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const fetchCounts = async () => {
      const res = await apiGet<{ data: Counts }>("/api/notifications");
      if (active && res.ok) setCounts(res.data.data);
    };
    fetchCounts();
    const t = setInterval(fetchCounts, 60000);
    return () => { active = false; clearInterval(t); };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items: { href: string; icon: string; label: string; count: number }[] = [
    { href: "/dashboard/leads", icon: "💬", label: "new WhatsApp lead", count: counts.new_leads },
    { href: "/dashboard/reviews", icon: "⭐", label: "review awaiting moderation", count: counts.pending_reviews },
    { href: "/dashboard/seo/redirects", icon: "🚧", label: "unresolved broken link (404)", count: counts.unresolved_404s },
  ].filter((i) => i.count > 0);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label="Notifications"
        className="relative rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
        🔔
        {counts.total > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
            {counts.total > 99 ? "99+" : counts.total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-line bg-white p-2 shadow-lg dark:border-white/10 dark:bg-navy">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal/50 dark:text-cream/50">
            Notifications
          </p>
          {items.length > 0 ? (
            items.map((i) => (
              <Link key={i.href} href={i.href} onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">
                <span>{i.icon} {i.count} {i.label}{i.count > 1 ? "s" : ""}</span>
              </Link>
            ))
          ) : (
            <div className="px-3 py-6 text-center text-sm text-charcoal/60 dark:text-cream/60">
              You&apos;re all caught up.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
