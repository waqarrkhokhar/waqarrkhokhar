"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { apiGet } from "@/lib/api/client";
import type { ProductHealth } from "@/components/dashboard/products/types";

type Stat = { label: string; value: string | number; icon: string; tint: string; href: string };

export default function OverviewDashboard({ firstName }: { firstName: string }) {
  const [health, setHealth] = useState<ProductHealth | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [collections, setCollections] = useState<number | null>(null);

  useEffect(() => {
    apiGet<{ data: ProductHealth }>("/api/products/health").then((r) => r.ok && setHealth(r.data.data));
    apiGet<{ data: { count: number } }>("/api/reviews/pending").then((r) => r.ok && setPending(r.data.data.count));
    apiGet<{ data: unknown[] }>("/api/collections").then((r) => r.ok && setCollections(r.data.data.length));
  }, []);

  const stats: Stat[] = [
    { label: "Total Products", value: health?.total ?? "—", icon: "📦", tint: "bg-gold/15", href: "/dashboard/products" },
    { label: "Published", value: health?.published ?? "—", icon: "✅", tint: "bg-green-500/15", href: "/dashboard/products" },
    { label: "Pending Reviews", value: pending ?? "—", icon: "⭐", tint: "bg-amber-500/15", href: "/dashboard/reviews" },
    { label: "Collections", value: collections ?? "—", icon: "🗂️", tint: "bg-blue-500/15", href: "/dashboard/collections" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted">Welcome back, {firstName} — here&apos;s your ComfyClub snapshot.</p>
        </div>
        <Link href="/dashboard/products/new"><Button size="sm">+ Add Product</Button></Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="rounded-[10px] border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#191f2e]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">{s.label}</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${s.tint}`}>{s.icon}</span>
            </div>
            <p className="mt-2 font-heading text-3xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Catalog summary */}
        <section className="rounded-[10px] border border-line bg-white p-5 shadow-card dark:border-white/10 dark:bg-[#191f2e]">
          <h3 className="mb-3 font-heading text-lg font-semibold">Catalog</h3>
          {health ? (
            <ul className="space-y-2 text-sm">
              {[
                ["Published", health.published],
                ["Drafts", health.draft],
                ["Archived", health.archived],
                ["Scheduled", health.scheduled],
              ].map(([l, v]) => (
                <li key={l} className="flex justify-between">
                  <span className="text-muted">{l}</span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Skeleton className="h-24 w-full" />
          )}
        </section>

        {/* Needs attention */}
        <section className="rounded-[10px] border border-line bg-white p-5 shadow-card dark:border-white/10 dark:bg-[#191f2e]">
          <h3 className="mb-3 font-heading text-lg font-semibold">Needs attention</h3>
          {health ? (
            <ul className="space-y-2 text-sm">
              {[
                ["Missing images", health.missing_images],
                ["Missing description", health.missing_description],
                ["No price", health.no_price],
                ["No reviews", health.no_reviews],
              ].map(([l, v]) => (
                <li key={l} className="flex justify-between">
                  <span className="text-muted">{l}</span>
                  <span className={`font-medium ${Number(v) > 0 ? "text-amber-500" : ""}`}>{v}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Skeleton className="h-24 w-full" />
          )}
        </section>

        {/* Quick actions */}
        <section className="rounded-[10px] border border-line bg-white p-5 shadow-card dark:border-white/10 dark:bg-[#191f2e]">
          <h3 className="mb-3 font-heading text-lg font-semibold">Quick actions</h3>
          <div className="grid gap-2">
            {[
              ["+ New Product", "/dashboard/products/new"],
              ["+ New Collection", "/dashboard/collections/new"],
              ["+ New Blog Post", "/dashboard/blog/new"],
              ["Moderate Reviews", "/dashboard/reviews"],
            ].map(([l, href]) => (
              <Link key={href} href={href}
                className="rounded-lg border border-line px-3 py-2 text-sm transition hover:border-gold hover:text-gold dark:border-white/10">
                {l}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {pending != null && pending > 0 && (
        <Link href="/dashboard/reviews"
          className="flex items-center justify-between rounded-[10px] border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm">
          <span>⭐ You have <strong>{pending}</strong> review{pending > 1 ? "s" : ""} awaiting moderation.</span>
          <span className="text-gold">Manage →</span>
        </Link>
      )}
    </div>
  );
}
