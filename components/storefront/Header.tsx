"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavParent } from "@/lib/storefront/data";
import SearchOverlay from "./SearchOverlay";

export default function Header({ nav, logo, brand }: { nav: NavParent[]; logo?: string; brand?: string }) {
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [openParent, setOpenParent] = useState<string | null>(null);
  const brandName = brand || "ComfyClub";

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-black/5 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-[58px] max-w-[1400px] items-center justify-between px-4 sm:px-6">
          {/* Mobile hamburger */}
          <button
            onClick={() => setDrawer(true)}
            aria-label="Menu"
            className="text-navy md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>

          {/* Logo */}
          <Link href="/" className="font-heading text-2xl font-semibold tracking-wide text-navy" aria-label={brandName}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={brandName} className="h-9 w-auto max-w-[180px] object-contain" />
            ) : (
              brandName
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((p) => (
              <div
                key={p.id}
                className="relative"
                onMouseEnter={() => setOpenParent(p.id)}
                onMouseLeave={() => setOpenParent(null)}
              >
                <Link
                  href={p.slug}
                  className="border-b-2 border-transparent py-5 text-[13.5px] font-medium uppercase tracking-wider text-charcoal transition hover:border-gold"
                >
                  {p.name}
                </Link>
                {openParent === p.id && p.children.length > 0 && (
                  <div className="absolute left-0 top-full w-56 rounded bg-white py-2 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    {p.children.map((c) => (
                      <Link
                        key={c.id}
                        href={c.slug}
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-cream hover:text-gold"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact-us/" className="text-[13.5px] font-medium uppercase tracking-wider text-charcoal hover:text-gold">
              Contact Us
            </Link>
          </nav>

          {/* Search */}
          <button onClick={() => setSearch(true)} aria-label="Search" className="text-navy">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[300px] overflow-y-auto bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={brandName} className="h-8 w-auto max-w-[150px] object-contain" />
              ) : (
                <span className="font-heading text-xl font-semibold text-navy">{brandName}</span>
              )}
              <button onClick={() => setDrawer(false)} aria-label="Close">✕</button>
            </div>
            <nav className="space-y-1">
              {nav.map((p) => (
                <div key={p.id}>
                  <Link href={p.slug} onClick={() => setDrawer(false)} className="block py-2 text-sm font-semibold uppercase tracking-wide text-charcoal">
                    {p.name}
                  </Link>
                  <div className="ml-3 border-l border-black/5 pl-3">
                    {p.children.map((c) => (
                      <Link key={c.id} href={c.slug} onClick={() => setDrawer(false)} className="block py-1.5 text-sm text-charcoal/70 hover:text-gold">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Link href="/contact-us/" onClick={() => setDrawer(false)} className="block py-2 text-sm font-semibold uppercase tracking-wide text-charcoal">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      )}

      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  );
}
