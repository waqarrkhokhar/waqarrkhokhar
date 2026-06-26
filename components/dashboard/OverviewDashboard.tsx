"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api/client";
import type { ProductHealth } from "@/components/dashboard/products/types";
import {
  DashPageHeader,
  DashCard,
  DashSection,
  DashBtn,
  DashBadge,
  DashProgress,
} from "@/components/dashboard/shared/Dash";

type Lead = {
  id: string;
  product_name: string | null;
  source_page: string | null;
  message_type: "order" | "quote" | "consultation" | "general";
  created_at: string;
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

const typeBadge = (t: Lead["message_type"]) =>
  t === "order" ? "active" : t === "quote" ? "pending" : "scheduled";

export default function OverviewDashboard({ firstName }: { firstName: string }) {
  const [health, setHealth] = useState<ProductHealth | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [collections, setCollections] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [leadsToday, setLeadsToday] = useState<number | null>(null);

  useEffect(() => {
    apiGet<{ data: ProductHealth }>("/api/products/health").then((r) => r.ok && setHealth(r.data.data));
    apiGet<{ data: { count: number } }>("/api/reviews/pending").then((r) => r.ok && setPending(r.data.data.count));
    apiGet<{ data: unknown[] }>("/api/collections").then((r) => r.ok && setCollections(r.data.data.length));
    apiGet<{ data: Lead[] }>("/api/leads?limit=6").then((r) => r.ok && setLeads(r.data.data));
    apiGet<{ data: { today: number } }>("/api/leads/stats").then((r) => r.ok && setLeadsToday(r.data.data.today));
  }, []);

  const total = health?.total ?? "-";
  const seoMax = health?.total || 1;

  return (
    <div>
      <DashPageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${firstName} - here's your ComfyClub snapshot.`}
        actions={
          <>
            <DashBtn variant="secondary" href="/dashboard/analytics">Analytics</DashBtn>
            <DashBtn icon="+" href="/dashboard/products/new">Add Product</DashBtn>
          </>
        }
      />

      {/* Key metrics */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashCard label="Total Products" value={total} icon="📦" tint="bg-gold/15" href="/dashboard/products" />
        <DashCard label="WhatsApp Leads (Today)" value={leadsToday ?? "-"} icon="💬" tint="bg-green-100" href="/dashboard/leads" />
        <DashCard label="Pending Reviews" value={pending ?? "-"} icon="⭐" tint="bg-amber-100" href="/dashboard/reviews" />
        <DashCard label="Collections" value={collections ?? "-"} icon="🗂️" tint="bg-blue-100" href="/dashboard/collections" />
      </div>

      {/* Main grid */}
      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        {/* Recent leads */}
        <div className="lg:col-span-2">
          <DashSection
            title="Recent WhatsApp Leads"
            actions={<DashBtn variant="ghost" size="sm" href="/dashboard/leads">View All →</DashBtn>}
            noPad
          >
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-panel dark:bg-white/5">
                  <th className="px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted">Product</th>
                  <th className="px-3.5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted">Source</th>
                  <th className="px-3.5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted">Type</th>
                  <th className="px-3.5 py-2.5 text-right text-[11px] font-medium uppercase tracking-wide text-muted">Time</th>
                </tr>
              </thead>
              <tbody>
                {leads === null ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-muted">Loading…</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-muted">No leads yet.</td></tr>
                ) : (
                  leads.map((o) => (
                    <tr key={o.id} className="border-b border-line dark:border-white/10">
                      <td className="px-5 py-3 font-medium text-ink dark:text-cream">{o.product_name ?? "General enquiry"}</td>
                      <td className="px-3.5 py-3 text-muted">{o.source_page ?? "-"}</td>
                      <td className="px-3.5 py-3"><DashBadge status={typeBadge(o.message_type)} label={o.message_type[0].toUpperCase() + o.message_type.slice(1)} /></td>
                      <td className="px-3.5 py-3 text-right text-xs text-muted">{timeAgo(o.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </DashSection>
        </div>

        {/* Catalog + quick actions */}
        <div className="flex flex-col gap-5">
          <DashSection title="Catalog">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Published", value: health?.published, color: "text-green-600" },
                { label: "Draft", value: health?.draft, color: "text-amber-500" },
                { label: "Collections", value: collections, color: "text-blue-500" },
                { label: "Archived", value: health?.archived, color: "text-gold" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-panel px-3.5 py-3 text-center dark:bg-white/5">
                  <div className={`font-heading text-[22px] font-bold ${s.color}`}>{s.value ?? "-"}</div>
                  <div className="mt-0.5 text-[11px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </DashSection>

          <DashSection title="Quick Actions">
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Add Product", icon: "📦", href: "/dashboard/products/new" },
                { label: "Import CSV", icon: "↑", href: "/dashboard/import-export" },
                { label: "New Blog Post", icon: "✏️", href: "/dashboard/blog/new" },
                { label: "Create Promotion", icon: "📢", href: "/dashboard/promotions" },
                { label: "Moderate Reviews", icon: "⭐", href: "/dashboard/reviews" },
              ].map((a) => (
                <a key={a.label} href={a.href} className="flex items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2.5 text-[13px] text-ink transition hover:border-gold hover:bg-panel dark:border-white/10 dark:bg-white/5 dark:text-cream">
                  <span className="text-[15px]">{a.icon}</span>
                  <span className="flex-1">{a.label}</span>
                  <span className="text-xs text-muted">→</span>
                </a>
              ))}
            </div>
          </DashSection>
        </div>
      </div>

      {/* Bottom: needs attention + SEO health (real, from product health) */}
      <div className="grid gap-5 lg:grid-cols-2">
        <DashSection title="Needs Attention" actions={<DashBtn variant="ghost" size="sm" href="/dashboard/products">Manage →</DashBtn>}>
          {health ? (
            <div className="flex flex-col gap-0.5">
              {[
                { label: "Missing images", value: health.missing_images },
                { label: "Missing description", value: health.missing_description },
                { label: "No price", value: health.no_price },
                { label: "No reviews", value: health.no_reviews },
              ].map((a, i, arr) => (
                <div key={a.label} className={`flex items-center gap-2.5 py-2 ${i < arr.length - 1 ? "border-b border-line dark:border-white/10" : ""}`}>
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${a.value > 0 ? "bg-amber-500" : "bg-green-500"}`} />
                  <span className="flex-1 text-[13px] text-ink dark:text-cream">{a.label}</span>
                  <span className={`text-sm font-semibold ${a.value > 0 ? "text-amber-600" : "text-muted"}`}>{a.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-sm text-muted">Loading…</p>
          )}
        </DashSection>

        <DashSection title="Catalog Completeness" actions={<DashBtn variant="ghost" size="sm" href="/dashboard/products">Details →</DashBtn>}>
          {health ? (
            <>
              <DashProgress value={health.total - health.missing_description} max={seoMax} label="With descriptions" color="#22c55e" />
              <DashProgress value={health.total - health.missing_images} max={seoMax} label="With images" color="#22c55e" />
              <DashProgress value={health.total - health.no_price} max={seoMax} label="With pricing" color="#f59e0b" />
              <DashProgress value={health.published} max={seoMax} label="Published" color="#22c55e" />
              <DashProgress value={health.total - health.no_reviews} max={seoMax} label="With reviews" color="#3b82f6" />
            </>
          ) : (
            <p className="py-4 text-sm text-muted">Loading…</p>
          )}
        </DashSection>
      </div>
    </div>
  );
}
