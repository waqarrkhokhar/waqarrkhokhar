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
type Item =
  | { kind: "leaf"; label: string; href: string; icon: string; cap?: Capability; ready?: boolean }
  | { kind: "group"; label: string; icon: string; children: Leaf[] };

// Sidebar icons (single-path, multi-subpath SVGs from the design prototype).
function SideIcon({ d }: { d: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}

// Navigation mirrors the dashboard prototype's structure + icons. Built routes
// are `ready`; the rest show a "Soon" chip until their phase ships.
const NAV: Item[] = [
  { kind: "leaf", label: "Dashboard", href: "/dashboard", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", ready: true },
  {
    kind: "group",
    label: "Catalog",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    children: [
      { label: "Products", href: "/dashboard/products", cap: "products", ready: true },
      { label: "Collections", href: "/dashboard/collections", cap: "categories", ready: true },
      { label: "Categories", href: "/dashboard/categories", cap: "categories", ready: true },
      { label: "Import / Export", href: "/dashboard/import-export", cap: "import_export", ready: true },
      { label: "Custom Fields", href: "/dashboard/custom-fields", cap: "settings", ready: true },
      { label: "Structure Manager", href: "/dashboard/structure", cap: "settings", ready: true },
    ],
  },
  { kind: "leaf", label: "Homepage", href: "/dashboard/homepage", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z", cap: "settings", ready: true },
  { kind: "leaf", label: "Blog", href: "/dashboard/blog", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8", cap: "blog", ready: true },
  { kind: "leaf", label: "Pages", href: "/dashboard/pages", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", cap: "pages", ready: true },
  {
    kind: "group",
    label: "SEO",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    children: [
      { label: "SEO Dashboard", href: "/dashboard/seo", cap: "seo", ready: true },
      { label: "Metadata Manager", href: "/dashboard/seo/metadata", cap: "seo", ready: true },
      { label: "Schema Manager", href: "/dashboard/seo/schema", cap: "seo", ready: true },
      { label: "Redirect Manager", href: "/dashboard/seo/redirects", cap: "seo", ready: true },
      { label: "Sitemap Manager", href: "/dashboard/seo/sitemap", cap: "seo", ready: true },
      { label: "Robots Manager", href: "/dashboard/seo/robots", cap: "seo", ready: true },
      { label: "Internal Linking", href: "/dashboard/seo/internal-links", cap: "seo", ready: true },
    ],
  },
  { kind: "leaf", label: "Media Library", href: "/dashboard/media", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", cap: "media", ready: true },
  { kind: "leaf", label: "Promotions", href: "/dashboard/promotions", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z", cap: "promotions", ready: true },
  { kind: "leaf", label: "WhatsApp Leads", href: "/dashboard/leads", icon: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z", cap: "leads", ready: true },
  { kind: "leaf", label: "Reviews", href: "/dashboard/reviews", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", cap: "reviews", ready: true },
  {
    kind: "group",
    label: "Analytics",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    children: [
      { label: "Overview", href: "/dashboard/analytics", cap: "analytics", ready: true },
      { label: "Search Analytics", href: "/dashboard/analytics/search", cap: "analytics", ready: true },
      { label: "404 Monitor", href: "/dashboard/seo/redirects", cap: "seo", ready: true },
    ],
  },
  {
    kind: "group",
    label: "Appearance",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
    children: [
      { label: "Header Builder", href: "/dashboard/appearance/header", cap: "settings", ready: true },
      { label: "Footer Builder", href: "/dashboard/appearance/footer", cap: "settings", ready: true },
      { label: "Theme & Display", href: "/dashboard/appearance", cap: "settings", ready: true },
    ],
  },
  {
    kind: "group",
    label: "Settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    children: [
      { label: "General", href: "/dashboard/settings", cap: "settings", ready: true },
      { label: "Users & Roles", href: "/dashboard/users", cap: "users", ready: true },
      { label: "Activity Log", href: "/dashboard/activity", ready: true },
      { label: "Backups", href: "/dashboard/settings/backups", cap: "settings", ready: true },
      { label: "Content Blocks", href: "/dashboard/settings/content-blocks", cap: "settings", ready: true },
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
  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return pathname === base || (base !== "/dashboard" && pathname.startsWith(base));
  };

  const initialExpanded = NAV.filter(
    (s) => s.kind === "group" && s.children.some((c) => isActive(c.href)),
  ).map((s) => s.label);
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

  function childEl(l: Leaf) {
    if (!l.ready) {
      return (
        <span key={l.href} className="flex items-center justify-between py-[7px] pl-[18px] pr-4 text-[13.5px] text-white/30">
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
        className={`block border-l-2 py-[7px] pl-[18px] pr-4 text-[13.5px] transition ${
          active ? "border-gold bg-navyHover font-medium text-white" : "border-transparent text-white/45 hover:text-white/80"
        }`}
      >
        {l.label}
      </Link>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-navyLight px-[18px] py-5">
        <span className="font-heading text-[22px] font-semibold leading-none text-white">ComfyClub</span>
        <span className="text-[11px] uppercase tracking-[1px] text-gold/70">CMS</span>
      </div>

      {/* Nav */}
      <nav className="no-scrollbar flex-1 overflow-y-auto py-3">
        {NAV.map((item) => {
          if (item.kind === "leaf") {
            if (item.cap && !can(user.role, item.cap)) return null;
            if (!item.ready) {
              return (
                <span key={item.href} className="flex items-center gap-2.5 border-l-[3px] border-transparent px-[18px] py-[9px] text-[14.5px] text-white/30">
                  <SideIcon d={item.icon} />
                  <span className="flex-1">{item.label}</span>
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">Soon</span>
                </span>
              );
            }
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 border-l-[3px] px-[18px] py-[9px] text-[14.5px] transition ${
                  active ? "border-gold bg-navyHover font-medium text-white" : "border-transparent text-white/55 hover:bg-navyLight hover:text-white"
                }`}
              >
                <SideIcon d={item.icon} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          }

          const kids = item.children.filter(visibleLeaf);
          if (kids.length === 0) return null;
          const isOpen = expanded.includes(item.label);
          const hasActive = kids.some((c) => isActive(c.href));
          return (
            <div key={item.label}>
              <button
                onClick={() => toggleGroup(item.label)}
                className={`flex w-full items-center gap-2.5 border-l-[3px] border-transparent px-[18px] py-[9px] text-[14.5px] transition ${
                  hasActive ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                <SideIcon d={item.icon} />
                <span className="flex-1 text-left">{item.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              {isOpen && <div className="pb-1 pl-7">{kids.map(childEl)}</div>}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="flex items-center gap-2.5 border-t border-navyLight px-[18px] py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs font-semibold text-white">{initial}</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-medium text-white">{user.name}</p>
          <p className="truncate text-[11px] capitalize text-white/40">{user.role}</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-panel text-ink dark:bg-[#0e1320] dark:text-[#dde1ec]">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] bg-navy dark:bg-[#0a0f1a] lg:block">{sidebar}</aside>
        <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] transform bg-navy transition-transform dark:bg-[#0a0f1a] lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>{sidebar}</aside>
        {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

        <div className="lg:pl-[250px]">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-white px-6 dark:border-white/10 dark:bg-[#191f2e]">
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 text-ink hover:bg-black/5 dark:text-cream dark:hover:bg-white/10 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              </button>
              <form onSubmit={search} className="relative">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search dashboard..."
                  className="w-[200px] rounded-md border border-line bg-panel py-2 pl-8 pr-3 text-sm text-ink outline-none focus:border-gold sm:w-[260px] dark:border-white/10 dark:bg-white/5 dark:text-cream"
                />
              </form>
            </div>
            <div className="flex items-center gap-3.5">
              <ThemeToggle />
              <NotificationBell />
              <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1 text-[13.5px] text-gold hover:underline sm:flex">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
                View Site
              </a>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
