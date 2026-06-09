"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { CurrentUser } from "@/lib/auth/session";
import { can, type Capability } from "@/lib/auth/permissions";
import ThemeToggle from "./ThemeToggle";
import SignOutButton from "./SignOutButton";
import NotificationBell from "./NotificationBell";
import { ToastProvider } from "@/components/ui/Toast";

type Leaf = { label: string; href: string; cap?: Capability; ready?: boolean };
type Section =
  | { kind: "leaf"; item: Leaf }
  | { kind: "group"; label: string; children: Leaf[] };

// Grouped navigation, matching the design prototype (Catalog / SEO / Settings
// groups). `ready` leaves are live; the rest show a "Soon" chip.
const NAV: Section[] = [
  { kind: "leaf", item: { label: "Dashboard", href: "/dashboard", ready: true } },
  { kind: "leaf", item: { label: "Homepage", href: "/dashboard/homepage", cap: "settings", ready: true } },
  {
    kind: "group",
    label: "Catalog",
    children: [
      { label: "Products", href: "/dashboard/products", cap: "products", ready: true },
      { label: "Collections", href: "/dashboard/collections", cap: "categories", ready: true },
      { label: "Categories", href: "/dashboard/categories", cap: "categories", ready: true },
      { label: "Import / Export", href: "/dashboard/import-export", cap: "import_export" },
    ],
  },
  { kind: "leaf", item: { label: "Blog", href: "/dashboard/blog", cap: "blog", ready: true } },
  { kind: "leaf", item: { label: "Pages", href: "/dashboard/pages", cap: "pages" } },
  {
    kind: "group",
    label: "SEO",
    children: [
      { label: "Redirects & 404", href: "/dashboard/seo", cap: "seo", ready: true },
      { label: "Metadata Manager", href: "/dashboard/seo/metadata", cap: "seo" },
      { label: "Schema Manager", href: "/dashboard/seo/schema", cap: "seo" },
    ],
  },
  { kind: "leaf", item: { label: "Media Library", href: "/dashboard/media", cap: "media" } },
  { kind: "leaf", item: { label: "Promotions", href: "/dashboard/promotions", cap: "promotions", ready: true } },
  { kind: "leaf", item: { label: "WhatsApp Leads", href: "/dashboard/leads", cap: "leads" } },
  { kind: "leaf", item: { label: "Reviews", href: "/dashboard/reviews", cap: "reviews", ready: true } },
  { kind: "leaf", item: { label: "Analytics", href: "/dashboard/analytics", cap: "analytics" } },
  {
    kind: "group",
    label: "Settings",
    children: [
      { label: "General", href: "/dashboard/settings", cap: "settings" },
      { label: "Users & Roles", href: "/dashboard/users", cap: "users" },
      { label: "Activity Log", href: "/dashboard/activity" },
      { label: "Appearance", href: "/dashboard/appearance", cap: "settings" },
    ],
  },
];

export default function DashShell({
  user,
  children,
}: {
  user: CurrentUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const visibleLeaf = (l: Leaf) => !l.cap || can(user.role, l.cap);
  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  // Which groups start expanded: those containing the active route.
  const initialExpanded = NAV.filter(
    (s) => s.kind === "group" && s.children.some((c) => isActive(c.href)),
  ).map((s) => (s as { label: string }).label);
  const [expanded, setExpanded] = useState<string[]>(initialExpanded);
  const toggleGroup = (label: string) =>
    setExpanded((e) => (e.includes(label) ? e.filter((x) => x !== label) : [...e, label]));

  const initial = user.name.trim().charAt(0).toUpperCase() || "A";

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/dashboard/products?search=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  }

  function leafEl(l: Leaf, indent = false) {
    const pad = indent ? "pl-9" : "pl-5";
    if (l.ready !== true) {
      return (
        <span key={l.href} className={`flex items-center justify-between ${pad} pr-5 py-2 text-sm text-white/30`}>
          {l.label}
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">Soon</span>
        </span>
      );
    }
    const active = isActive(l.href);
    return (
      <Link
        key={l.href}
        href={l.href}
        onClick={() => setOpen(false)}
        className={`flex items-center border-l-2 ${pad} pr-5 py-2 text-sm transition ${
          active
            ? "border-gold bg-navyHover font-medium text-white"
            : "border-transparent text-white/70 hover:bg-navyLight hover:text-white"
        }`}
      >
        {l.label}
      </Link>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-navyLight px-5 py-5">
        <span className="font-heading text-2xl font-semibold text-white">ComfyClub</span>
        <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold">CMS</span>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto py-3">
        {NAV.map((section) => {
          if (section.kind === "leaf") {
            return visibleLeaf(section.item) ? leafEl(section.item) : null;
          }
          const kids = section.children.filter(visibleLeaf);
          if (kids.length === 0) return null;
          const isOpen = expanded.includes(section.label);
          const hasActive = kids.some((c) => isActive(c.href));
          return (
            <div key={section.label}>
              <button
                onClick={() => toggleGroup(section.label)}
                className={`flex w-full items-center justify-between px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  hasActive ? "text-gold" : "text-white/40 hover:text-white/70"
                }`}
              >
                {section.label}
                <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>
              </button>
              {isOpen && <div className="pb-1">{kids.map((c) => leafEl(c, true))}</div>}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-navyLight px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-semibold text-white">{initial}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-white/50">{user.role}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-panel text-ink dark:bg-[#0e1320] dark:text-[#dde1ec]">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy dark:bg-[#0a0f1a] lg:block">{sidebar}</aside>
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-navy transition-transform dark:bg-[#0a0f1a] lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>{sidebar}</aside>
        {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-white px-4 dark:border-white/10 dark:bg-[#191f2e]">
            <button className="rounded-lg p-2 text-ink hover:bg-black/5 dark:text-cream dark:hover:bg-white/10 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
            <form onSubmit={search} className="relative max-w-sm flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">⌕</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…"
                className="w-full rounded-lg border border-line bg-panel py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-cream" />
            </form>
            <div className="ml-auto"><NotificationBell /></div>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
