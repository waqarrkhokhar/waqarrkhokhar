"use client";

import { DashPageHeader, DashSection, DashBtn } from "@/components/dashboard/shared/Dash";

export default function Backups() {
  return (
    <div>
      <DashPageHeader title="Backups" subtitle="How your data is protected" breadcrumbs={[{ label: "Settings" }, { label: "Backups" }]} />

      <DashSection title="Automatic Database Backups">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-xl">🛡️</span>
          <div className="text-[13px] leading-relaxed text-ink dark:text-cream">
            <p>Your entire database (products, collections, reviews, leads, blog, settings) is backed up <strong>automatically every day</strong> by Supabase, with point-in-time recovery on paid plans.</p>
            <p className="mt-2 text-muted">Manage and restore these from your Supabase project → <strong>Database → Backups</strong>.</p>
          </div>
        </div>
        <div className="mt-4">
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"><DashBtn variant="secondary">Open Supabase Backups</DashBtn></a>
        </div>
      </DashSection>

      <DashSection title="Export a Snapshot" subtitle="Download a copy of your catalog you can keep offline">
        <p className="mb-3 text-[13px] leading-relaxed text-muted">A CSV of every product - handy as a quick offline backup or for editing in a spreadsheet.</p>
        <a href="/api/products/export" download><DashBtn icon="↓">Download Products CSV</DashBtn></a>
      </DashSection>

      <DashSection title="Media Files">
        <p className="text-[13px] leading-relaxed text-muted">Uploaded images live in Supabase Storage and are covered by Supabase&apos;s storage durability. You can browse and download them anytime from the <a href="/dashboard/media" className="text-gold">Media Library</a>.</p>
      </DashSection>
    </div>
  );
}
