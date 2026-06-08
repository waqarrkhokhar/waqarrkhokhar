"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CurrentUser } from "@/lib/auth/session";
import { can, type Capability } from "@/lib/auth/permissions";
import ThemeToggle from "./ThemeToggle";
import SignOutButton from "./SignOutButton";
import NotificationBell from "./NotificationBell";
import { ToastProvider } from "@/components/ui/Toast";

type NavItem = {
  label: string;
  href: string;
  cap?: Capability; // omitted = visible to any authenticated user
  ready?: boolean; // false = built in a later phase (shown disabled)
};

// Order follows the dashboard information architecture. `ready` flags flip on
// as each phase ships, so the menu never contains dead links.
const NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", ready: true },
  { label: "Products", href: "/dashboard/products", cap: "products", ready: true },
  { label: "Collections", href: "/dashboard/collections", cap: "categories" },
  { label: "Categories", href: "/dashboard/categories", cap: "categories" },
  { label: "Reviews", href: "/dashboard/reviews", cap: "reviews" },
  { label: "Blog", href: "/dashboard/blog", cap: "blog" },
  { label: "Pages", href: "/dashboard/pages", cap: "pages" },
  { label: "Media", href: "/dashboard/media", cap: "media" },
  { label: "SEO", href: "/dashboard/seo", cap: "seo" },
  { label: "Promotions", href: "/dashboard/promotions", cap: "promotions" },
  { label: "WhatsApp Leads", href: "/dashboard/leads", cap: "leads" },
  { label: "Analytics", href: "/dashboard/analytics", cap: "analytics" },
  { label: "Import / Export", href: "/dashboard/import-export", cap: "import_export" },
  { label: "Activity Log", href: "/dashboard/activity" },
  { label: "Users", href: "/dashboard/users", cap: "users" },
  { label: "Settings", href: "/dashboard/settings", cap: "settings" },
];

export default function DashShell({
  user,
  children,
}: {
  user: CurrentUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = NAV.filter((n) => !n.cap || can(user.role, n.cap));

  return (
    <ToastProvider>
    <div className="min-h-screen bg-cream text-charcoal dark:bg-navy dark:text-cream">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-black/5 bg-white p-4 transition-transform dark:border-white/10 dark:bg-navy/95 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 px-2">
          <p className="font-heading text-2xl font-semibold text-navy dark:text-cream">
            ComfyClub
          </p>
          <p className="text-xs uppercase tracking-widest text-gold">CMS</p>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const isReady = item.ready === true;
            if (!isReady) {
              return (
                <span
                  key={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-charcoal/40 dark:text-cream/30"
                >
                  {item.label}
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] uppercase tracking-wide dark:bg-white/10">
                    Soon
                  </span>
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-gold/15 font-medium text-navy dark:text-gold"
                    : "text-charcoal/80 hover:bg-black/5 dark:text-cream/80 dark:hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-4 rounded-lg bg-black/5 p-3 dark:bg-white/5">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-charcoal/60 dark:text-cream/60">
            {user.role}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/5 bg-cream/80 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-navy/80">
          <button
            className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="font-heading text-xl font-semibold">Dashboard</h1>
          <div className="ml-auto">
            <NotificationBell />
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
