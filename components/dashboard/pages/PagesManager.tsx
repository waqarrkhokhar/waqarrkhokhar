"use client";

import { useCallback, useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashBadge, DashBtn, DashInput, DashSelect } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Page = { id: string; title: string; slug: string; type: string; status: string; schema_enabled?: boolean; traffic?: number; updated_at: string };
type Form = { title: string; content: string; banner_image: string; meta_title: string; meta_description: string; status: string };
const EMPTY: Form = { title: "", content: "", banner_image: "", meta_title: "", meta_description: "", status: "draft" };

// Normalise a stored slug to exactly one leading and one trailing slash.
const fmtSlug = (s: string) => "/" + String(s).replace(/^\/+|\/+$/g, "") + "/";

const typeLabel: Record<string, string> = { core: "Core Page", policy: "Policy", custom: "Custom Page" };
const typeBadge = (t: string) => (t === "policy" ? "archived" : t === "core" ? "active" : "scheduled");

export default function PagesManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [f, setF] = useState<Form>(EMPTY);
  const [slug, setSlug] = useState("");
  const [pageType, setPageType] = useState("custom");
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState<Page | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Page[] }>("/api/pages");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);

    // Show pages immediately; fetch GA4 traffic afterwards so the slow Google
    // call never blocks the list from rendering.
    setRows(res.data.data);
    apiGet<{ data: { ga4: { topPages?: { path: string; views: number }[] } | null } }>("/api/analytics/google").then((ga) => {
      if (!ga.ok || !ga.data.data.ga4?.topPages) return;
      const views = new Map<string, number>();
      for (const tp of ga.data.data.ga4.topPages) views.set(fmtSlug(tp.path), tp.views);
      setRows((rs) => rs.map((p) => ({ ...p, traffic: views.get(fmtSlug(p.slug)) })));
    });
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function openEdit(id: string) {
    const res = await apiGet<{ data: Record<string, unknown> }>(`/api/pages/${id}`);
    if (!res.ok) return toast.error(res.error);
    const p = res.data.data;
    setSlug(String(p.slug ?? "")); setPageType(String(p.type ?? "custom"));
    setF({ title: String(p.title ?? ""), content: String(p.content ?? ""), banner_image: String(p.banner_image ?? ""), meta_title: String(p.meta_title ?? ""), meta_description: String(p.meta_description ?? ""), status: String(p.status ?? "draft") });
    setEditing(id);
  }
  function openNew() { setF(EMPTY); setSlug(""); setPageType("custom"); setEditing("new"); }

  async function save() {
    if (f.title.trim().length < 2) return toast.error("Title is required");
    setSaving(true);
    const payload = { ...f, content: f.content || null, banner_image: f.banner_image || null, meta_title: f.meta_title || null, meta_description: f.meta_description || null };
    const res = editing === "new"
      ? await apiSend<{ data: { id: string } }>("/api/pages", "POST", payload)
      : await apiSend(`/api/pages/${editing}`, "PATCH", payload);
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Page saved");
    setEditing(null);
    load();
  }

  async function remove() {
    if (!del) return;
    const res = await apiSend(`/api/pages/${del.id}`, "DELETE");
    setDel(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Page deleted");
    load();
  }

  if (editing !== null) {
    return (
      <div>
        <DashPageHeader title={editing === "new" ? "New Page" : `Edit: ${f.title}`}
          breadcrumbs={[{ label: "Pages" }, { label: editing === "new" ? "New" : f.title }]}
          actions={
            <>
              {editing !== "new" && slug && <DashBtn variant="secondary" onClick={() => window.open(fmtSlug(slug), "_blank")}>👁 Preview</DashBtn>}
              <DashBtn variant="secondary" onClick={() => setEditing(null)}>Cancel</DashBtn>
              <DashBtn onClick={save}>{saving ? "Saving…" : "Save Page"}</DashBtn>
            </>
          } />

        {f.status === "published" && slug && (
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
            <span className="text-xs font-medium text-green-600">Live:</span>
            <a href={fmtSlug(slug)} target="_blank" rel="noopener noreferrer" className="text-xs text-ink underline dark:text-cream">comfyclub.pk{fmtSlug(slug)}</a>
          </div>
        )}

        <div className="grid items-start gap-5 lg:grid-cols-[1fr_280px]">
          <DashSection title="Page Content">
            <DashInput label="Title" required value={f.title} onChange={(v) => setF({ ...f, title: v })} />
            {slug && <DashInput label="Slug" value={fmtSlug(slug)} disabled helper={`comfyclub.pk${fmtSlug(slug)}`} />}
            <DashInput label="Content" textarea rows={12} value={f.content} onChange={(v) => setF({ ...f, content: v })} placeholder="Page content (Markdown supported)" />
          </DashSection>
          <div>
            <DashSection title="Publish">
              <DashSelect label="Status" value={f.status} onChange={(v) => setF({ ...f, status: v })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </DashSelect>
              {pageType !== "custom" && <p className="text-[11px] text-muted">This is a {pageType} page.</p>}
            </DashSection>
            <DashSection title="Media"><DashInput label="Banner Image URL" value={f.banner_image} onChange={(v) => setF({ ...f, banner_image: v })} /></DashSection>
            <DashSection title="SEO">
              <DashInput label="Meta Title" value={f.meta_title} onChange={(v) => setF({ ...f, meta_title: v })} helper={`${f.meta_title.length}/70`} />
              <DashInput label="Meta Description" textarea rows={2} value={f.meta_description} onChange={(v) => setF({ ...f, meta_description: v })} helper={`${f.meta_description.length}/160`} />
            </DashSection>
          </div>
        </div>
      </div>
    );
  }

  const columns: Column<Page>[] = [
    {
      key: "title", header: "Page",
      render: (p) => (
        <div>
          <a
            href={fmtSlug(p.slug)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-navy underline decoration-line underline-offset-2 hover:decoration-gold dark:text-cream"
          >
            {p.title}
          </a>
          <div className="text-[11px] text-muted">{fmtSlug(p.slug)}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", render: (p) => <DashBadge status={typeBadge(p.type)} label={typeLabel[p.type] ?? p.type} /> },
    { key: "traffic", header: "Monthly Traffic", render: (p) => <span className="text-muted">{p.traffic != null ? p.traffic.toLocaleString() : "—"}</span> },
    { key: "schema", header: "Schema", render: (p) => p.schema_enabled ? <span className="text-[14px] text-green-600">✓</span> : <span className="text-[14px] text-muted">—</span> },
    { key: "status", header: "Status", render: (p) => <DashBadge status={p.status === "published" ? "published" : "draft"} label={p.status} /> },
    {
      key: "actions", header: "", className: "w-24",
      render: (p) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openEdit(p.id)} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
          <a href={fmtSlug(p.slug)} target="_blank" rel="noopener noreferrer" title="View Live" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🌐</a>
          {p.type === "custom" && <button onClick={() => setDel(p)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashPageHeader title="Pages" subtitle="Manage site pages, policies & SEO landing pages" breadcrumbs={[{ label: "Pages" }]}
        actions={<DashBtn icon="+" onClick={openNew}>Create Page</DashBtn>} />
      <DashTable columns={columns} rows={rows} getId={(p) => p.id} loading={loading} onRowClick={(p) => openEdit(p.id)}
        emptyTitle="No pages yet" emptyDescription="Create a custom or landing page." />
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title={`Delete '${del?.title}'?`} message="This permanently removes the page." confirmLabel="Delete" danger />
    </div>
  );
}
