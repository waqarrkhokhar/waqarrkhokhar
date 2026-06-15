"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashBtn } from "@/components/dashboard/shared/Dash";
import { apiGet } from "@/lib/api/client";

type Parent = { id: string; name: string; slug: string };
type Collection = { id: string; name: string; slug: string; parent: { id: string } | null; products_count: number };

export default function StructureManager() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    apiGet<{ data: Parent[] }>("/api/parents").then((r) => r.ok && setParents(r.data.data));
    apiGet<{ data: Collection[] }>("/api/collections").then((r) => r.ok && setCollections(r.data.data));
  }, []);

  return (
    <div>
      <DashPageHeader title="Structure Manager" subtitle="Visual hierarchy of your catalog"
        breadcrumbs={[{ label: "Catalog" }, { label: "Structure Manager" }]}
        actions={<DashBtn variant="secondary" href="/dashboard/categories">Manage Categories</DashBtn>} />

      <DashSection title="Catalog Hierarchy" subtitle="Parent categories → sub-collections. Products in a sub-collection also appear on its parent category page.">
        {parents.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No categories yet.</p>
        ) : (
          parents.map((p) => {
            const kids = collections.filter((c) => c.parent?.id === p.id);
            return (
              <div key={p.id} className="mb-4">
                <div className="flex items-center gap-2.5 rounded-lg bg-navy px-3.5 py-3 text-white">
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] opacity-70">Parent</span>
                  <span className="flex-1 font-medium">{p.name}</span>
                  <span className="text-[11px] opacity-50">{p.slug}</span>
                  <span className="text-[11px] opacity-40">{kids.length} sub</span>
                </div>
                {kids.map((c) => (
                  <div key={c.id} className="ml-7 mt-1 flex items-center gap-2.5 rounded-lg border border-line bg-white px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5">
                    <span className="rounded bg-gold/15 px-2 py-0.5 text-[10px] text-gold">Sub</span>
                    <span className="flex-1 text-[13px] font-medium text-ink dark:text-cream">{c.name}</span>
                    <span className="text-[11px] text-muted">{c.slug}</span>
                    <span className={`text-[11px] ${c.products_count > 0 ? "text-green-600" : "text-muted"}`}>{c.products_count} products</span>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </DashSection>

      <div className="rounded-lg bg-blue-50 px-4 py-3 text-[12px] text-blue-600">
        💡 To reorder, rename or move items, use <strong>Catalog → Categories</strong> and each collection&apos;s <strong>Sort Order</strong> field. Drag-to-reorder is coming to this screen.
      </div>
    </div>
  );
}
