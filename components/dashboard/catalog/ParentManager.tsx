"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { DashPageHeader, DashSection, DashBtn, DashBadge, DashInput, DashSelect } from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Parent = {
  id: string;
  name: string;
  slug: string;
  status: string;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  banner_image: string | null;
  description: string | null;
  children_count: number;
  products_count: number;
};

type FormState = {
  name: string; slug: string; status: string; sort_order: string;
  banner_image: string; description: string;
  meta_title: string; meta_description: string; focus_keyword: string;
};

const EMPTY: FormState = {
  name: "", slug: "", status: "published", sort_order: "0",
  banner_image: "", description: "", meta_title: "", meta_description: "", focus_keyword: "",
};

export default function ParentManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Parent | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Parent | null>(null);
  const [collectionsTotal, setCollectionsTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Parent[] }>("/api/parents");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
    setCollectionsTotal(res.data.data.reduce((s, p) => s + (p.children_count || 0), 0));
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setForm(EMPTY);
    setEditing("new");
  }
  function openEdit(p: Parent) {
    setForm({
      name: p.name, slug: p.slug, status: p.status, sort_order: String(p.sort_order),
      banner_image: p.banner_image ?? "", description: p.description ?? "",
      meta_title: p.meta_title ?? "", meta_description: p.meta_description ?? "", focus_keyword: p.focus_keyword ?? "",
    });
    setEditing(p);
  }

  async function save() {
    if (form.name.trim().length < 2) return toast.error("Name is required");
    setSaving(true);
    const payload = {
      name: form.name.trim(), status: form.status, sort_order: parseInt(form.sort_order, 10) || 0,
      banner_image: form.banner_image.trim() || null, description: form.description.trim() || null,
      meta_title: form.meta_title.trim() || null, meta_description: form.meta_description.trim() || null,
      focus_keyword: form.focus_keyword.trim() || null,
    };
    const res = editing !== "new" && editing
      ? await apiSend(`/api/parents/${editing.id}`, "PATCH", payload)
      : await apiSend("/api/parents", "POST", payload);
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(editing === "new" ? "Category created" : "Category updated");
    setEditing(null);
    load();
  }

  async function remove() {
    if (!toDelete) return;
    const res = await apiSend<{ message: string }>(`/api/parents/${toDelete.id}`, "DELETE");
    setToDelete(null);
    if (!res.ok) return toast.error(res.error);
    toast.success(res.data.message);
    load();
  }

  // ── Inline editor view ──
  if (editing !== null) {
    const isNew = editing === "new";
    return (
      <div>
        <DashPageHeader
          title={isNew ? "New Parent Category" : `Edit: ${form.name}`}
          breadcrumbs={[{ label: "Catalog" }, { label: "Categories" }, { label: isNew ? "New" : form.name }]}
          actions={
            <>
              {!isNew && form.slug && <DashBtn variant="secondary" onClick={() => window.open(`${form.slug}?preview=1`, "_blank")}>👁 Preview</DashBtn>}
              <DashBtn variant="secondary" onClick={() => setEditing(null)}>Cancel</DashBtn>
              <DashBtn onClick={save}>{saving ? "Saving…" : "Save"}</DashBtn>
            </>
          }
        />
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-[12px] text-blue-600">
          💡 Parent categories appear as top-level menu items in the storefront navigation. Add collections under them from the Collections screen.
        </div>
        <DashSection title="Category Details">
          <DashInput label="Name" value={form.name} required onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="e.g. Office Furniture" />
          <DashInput label="Slug" value={form.slug} disabled={isNew} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} helper={isNew ? "Auto-generated from the name, e.g. /office-furniture/" : "Top-level URL path"} />
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <DashSelect label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v }))}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </DashSelect>
            <DashInput label="Sort Order" type="number" value={form.sort_order} onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))} />
          </div>
          <DashInput label="Banner Image" value={form.banner_image} onChange={(v) => setForm((f) => ({ ...f, banner_image: v }))} placeholder="Image URL for the category banner" />
          <DashInput label="Description" textarea rows={3} value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
        </DashSection>
        <DashSection title="SEO">
          <DashInput label="Meta Title" value={form.meta_title} onChange={(v) => setForm((f) => ({ ...f, meta_title: v }))} helper={`${form.meta_title.length}/60`} />
          <DashInput label="Meta Description" textarea rows={2} value={form.meta_description} onChange={(v) => setForm((f) => ({ ...f, meta_description: v }))} helper={`${form.meta_description.length}/160`} />
          <DashInput label="Focus Keyword" value={form.focus_keyword} onChange={(v) => setForm((f) => ({ ...f, focus_keyword: v }))} />
        </DashSection>
      </div>
    );
  }

  // ── List view ──
  const columns: Column<Parent>[] = [
    { key: "name", header: "Category", render: (p) => (
      <div><p className="font-semibold text-charcoal dark:text-cream">{p.name}</p><p className="text-[11px] text-muted">{p.slug}</p></div>
    ) },
    { key: "children_count", header: "Collections", render: (p) => `${p.children_count} collection${p.children_count !== 1 ? "s" : ""}` },
    { key: "products_count", header: "Products", render: (p) => p.products_count },
    { key: "status", header: "Status", render: (p) => <DashBadge status={p.status === "published" ? "published" : "draft"} label={p.status} /> },
    { key: "actions", header: "", className: "w-24", render: (p) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => openEdit(p)} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
        <button onClick={() => setToDelete(p)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
      </div>
    ) },
  ];

  return (
    <div>
      <DashPageHeader
        title="Parent Categories"
        subtitle={`${rows.length} top-level categories · ${collectionsTotal} collections`}
        breadcrumbs={[{ label: "Catalog" }, { label: "Categories" }]}
        actions={<DashBtn icon="+" onClick={openNew}>Add Parent Category</DashBtn>}
      />

      <DashTable
        columns={columns}
        rows={rows}
        getId={(p) => p.id}
        loading={loading}
        onRowClick={(p) => openEdit(p)}
        emptyTitle="No categories yet"
        emptyDescription="Create your first parent category (e.g. Sofas)."
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title={`Move '${toDelete?.name}' to trash?`}
        message="It will be hidden from the storefront navigation. Restore it any time from Settings → Trash."
        confirmLabel="Move to Trash"
        danger
      />
    </div>
  );
}
