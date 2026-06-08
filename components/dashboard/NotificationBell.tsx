"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Notification bell. Phase 3 ships the working UI (dropdown, unread badge,
 * outside-click close). The data source (pending reviews, new leads, 404
 * alerts via SWR polling) is wired in Phase 12 — for now it shows a clean
 * "all caught up" state rather than a dead-end.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = 0; // populated in Phase 12

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"
      >
        🔔
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-black/5 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-navy">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal/50 dark:text-cream/50">
            Notifications
          </p>
          <div className="px-3 py-6 text-center text-sm text-charcoal/60 dark:text-cream/60">
            You&apos;re all caught up.
          </div>
        </div>
      )}
    </div>
  );
}
