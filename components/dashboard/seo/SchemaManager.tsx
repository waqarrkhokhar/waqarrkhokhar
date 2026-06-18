"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashBadge, DashBtn, DashToggle } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

// Schema types ComfyClub generates automatically on the storefront.
type AutoSchema = { name: string; type: string; where: string };
const AUTO: AutoSchema[] = [
  { name: "Product", type: "Product", where: "Product pages" },
  { name: "Aggregate Rating", type: "AggregateRating", where: "Products with reviews" },
  { name: "Review", type: "Review", where: "Product pages" },
  { name: "Article", type: "Article", where: "Blog posts" },
];

type CustomSchema = { id: string; name: string; type: string; json: string; enabled: boolean };

// Starter templates for the most common JSON-LD types a store may want to add.
const TEMPLATES: Record<string, object> = {
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ComfyClub",
    url: "https://comfyclub.pk",
    logo: "https://comfyclub.pk/logo.png",
    sameAs: ["https://www.facebook.com/comfyclub", "https://www.instagram.com/comfyclub"],
  },
  LocalBusiness: {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: "ComfyClub",
    image: "https://comfyclub.pk/logo.png",
    "@id": "https://comfyclub.pk",
    url: "https://comfyclub.pk",
    telephone: "+92-XXX-XXXXXXX",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your street",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    openingHours: "Mo-Sa 10:00-20:00",
  },
  WebSite: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ComfyClub",
    url: "https://comfyclub.pk",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://comfyclub.pk/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  BreadcrumbList: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://comfyclub.pk" },
      { "@type": "ListItem", position: 2, name: "Sofas", item: "https://comfyclub.pk/sofas/" },
    ],
  },
  FAQPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you deliver across Pakistan?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, we ship nationwide." },
      },
    ],
  },
  CollectionPage: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sofas",
    url: "https://comfyclub.pk/sofas/",
  },
  Service: {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Made-to-order furniture",
    provider: { "@type": "Organization", name: "ComfyClub" },
    areaServed: "PK",
  },
  Custom: { "@context": "https://schema.org", "@type": "" },
};
const TYPE_OPTIONS = Object.keys(TEMPLATES);

const newId = () => Math.random().toString(36).slice(2, 10);

export default function SchemaManager() {
  const toast = useToast();
  const [list, setList] = useState<CustomSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CustomSchema | null>(null);
  const [confirmDel, setConfirmDel] = useState<CustomSchema | null>(null);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (r.ok && Array.isArray(r.data.data.custom_schemas)) {
        setList(r.data.data.custom_schemas as CustomSchema[]);
      }
      setLoading(false);
    });
  }, []);

  async function persist(next: CustomSchema[]) {
    setList(next);
    const r = await apiSend("/api/settings", "PATCH", { key: "custom_schemas", value: next });
    if (!r.ok) toast.error(r.error);
  }

  function startAdd() {
    setEditing({ id: newId(), name: "", type: "Organization", json: JSON.stringify(TEMPLATES.Organization, null, 2), enabled: true });
  }

  async function save() {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error("Give this schema a name");
    try {
      JSON.parse(editing.json);
    } catch {
      return toast.error("The JSON-LD is not valid JSON. Please fix it.");
    }
    const exists = list.some((s) => s.id === editing.id);
    const next = exists ? list.map((s) => (s.id === editing.id ? editing : s)) : [...list, editing];
    await persist(next);
    setEditing(null);
    toast.success("Schema saved and live on the storefront");
  }

  async function toggle(s: CustomSchema) {
    await persist(list.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x)));
    toast.success(s.enabled ? "Schema turned off" : "Schema turned on");
  }

  async function remove() {
    if (!confirmDel) return;
    await persist(list.filter((s) => s.id !== confirmDel.id));
    setConfirmDel(null);
    toast.success("Schema deleted");
  }

  const columns: Column<CustomSchema>[] = [
    {
      key: "name", header: "Schema",
      render: (s) => <div><div className="font-medium text-charcoal dark:text-cream">{s.name || "Untitled"}</div><div className="text-[11px] text-muted">{s.type}</div></div>,
    },
    { key: "status", header: "Status", render: (s) => <DashBadge status={s.enabled ? "active" : "draft"} label={s.enabled ? "Live" : "Off"} /> },
    {
      key: "actions", header: "", className: "w-40",
      render: (s) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => toggle(s)} title={s.enabled ? "Turn off" : "Turn on"} className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">{s.enabled ? "⏸️" : "▶️"}</button>
          <button onClick={() => setEditing({ ...s })} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
          <button onClick={() => setConfirmDel(s)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashPageHeader
        title="Schema Manager"
        subtitle="Structured data (JSON-LD) for rich results in Google"
        breadcrumbs={[{ label: "SEO" }, { label: "Schema Manager" }]}
        actions={<DashBtn icon="+" onClick={startAdd}>Add Schema</DashBtn>}
      />

      <DashSection title="Your Custom Schemas" subtitle="Added here, validated, and emitted on every page of the storefront" noPad>
        <DashTable
          columns={columns}
          rows={list}
          getId={(s) => s.id}
          loading={loading}
          onRowClick={(s) => setEditing({ ...s })}
          emptyTitle="No custom schemas yet"
          emptyDescription="Click Add Schema to publish Organization, LocalBusiness, FAQ, and more."
        />
      </DashSection>

      <DashSection title="Automatic Schemas" subtitle="Generated for you and always live - no setup needed" className="mt-5" noPad>
        <DashTable
          columns={[
            { key: "name", header: "Schema", render: (s) => <div><div className="font-medium text-charcoal dark:text-cream">{s.name}</div><div className="text-[11px] text-muted">{s.type}</div></div> },
            { key: "where", header: "Applied To", render: (s) => <span className="text-muted">{s.where}</span> },
            { key: "live", header: "Status", render: () => <DashBadge status="active" label="Live" /> },
          ] as Column<AutoSchema>[]}
          rows={AUTO}
          getId={(s) => s.type}
        />
      </DashSection>

      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-[13px] text-blue-700">
        💡 After saving, paste a page URL into Google&apos;s <a className="underline" href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">Rich Results Test</a> to confirm your schema is detected, then request indexing in Search Console.
      </div>

      {/* Add / edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing && list.some((s) => s.id === editing.id) ? "Edit Schema" : "Add Schema"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>Save &amp; Publish</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-charcoal dark:text-cream">Name</span>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Organization"
                  className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-charcoal dark:text-cream">Type</span>
                <select
                  value={editing.type}
                  onChange={(e) => {
                    const t = e.target.value;
                    const tpl = TEMPLATES[t];
                    setEditing({ ...editing, type: t, json: tpl ? JSON.stringify(tpl, null, 2) : editing.json });
                  }}
                  className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5"
                >
                  {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-charcoal dark:text-cream">JSON-LD</span>
              <textarea
                value={editing.json}
                onChange={(e) => setEditing({ ...editing, json: e.target.value })}
                spellCheck={false}
                rows={14}
                className="w-full rounded-md border border-line bg-white px-3 py-2.5 font-mono text-[12.5px] leading-relaxed outline-none focus:border-gold dark:border-white/10 dark:bg-white/5"
              />
              <span className="mt-1 block text-[12px] text-muted">Edit the template above. It is validated as JSON before saving.</span>
            </label>
            <DashToggle
              label="Enabled (live on the storefront)"
              checked={editing.enabled}
              onChange={(v) => setEditing({ ...editing, enabled: v })}
            />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={remove}
        title="Delete schema"
        message={confirmDel ? `Delete "${confirmDel.name || "this schema"}"? It will be removed from the storefront.` : ""}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
