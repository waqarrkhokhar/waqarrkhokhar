"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api/client";

/**
 * Notification bell. Shows the pending-review count (polled every 60s) as the
 * unread badge. Additional notification sources (new leads, 404 alerts) are
 * added in Phase 12.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const fetchCount = async () => {
      const res = await apiGet<{ data: { count: number } }>("/api/reviews/pending");
      if (active && res.ok) setPending(res.data.data.count);
    };
    fetchCount();
    const t = setInterval(fetchCount, 60000);
    return () => { active = false; clearInterval(t); };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label="Notifications"
        className="relative rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
        🔔
        {pending > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
            {pending}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-black/5 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-navy">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal/50 dark:text-cream/50">
            Notifications
          </p>
          {pending > 0 ? (
            <Link href="/dashboard/reviews" onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">
              ⭐ {pending} review{pending > 1 ? "s" : ""} awaiting moderation
            </Link>
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
