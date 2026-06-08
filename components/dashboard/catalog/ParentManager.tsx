"use client";

import { useCallback, useEffect, useState } from "react";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
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
  description: string | null;
  children_count: number;
  products_count: number;
};

type FormState = {
  name: string;
  status: string;
  sort_order: string;
  description: string;
  meta_title: string;
  meta_description: string;
};

const EMPTY: FormState = {
  name: "", status: "published", sort_order: "0",
  description: "", meta_title: "", meta_description: "",
};

export default function ParentManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Parent | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Parent | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: Parent[] }>("/api/parents");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(p: Parent) {
    setEditing(p);
    setForm({
      name: p.name,
      status: p.status,
      sort_order: String(p.sort_order),
      description: p.description ?? "",
      meta_title: p.meta_title ?? "",
      meta_description: p.meta_description ?? "",
    });
    setOpen(true);
  }

  async function save() {
    if (form.name.trim().length < 2) return toast.error("Name is required");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      status: form.status,
      sort_order: parseInt(form.sort_order, 10) || 0,
      description: form.description.trim() || null,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
    };
    const res = editing
      ? await apiSend(`/api/parents/${editing.id}`, "PATCH", payload)
      : await apiSend("/api/parents", "POST", payload);
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(editing ? "Category updated" : "Category created");
    setOpen(false);
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

  const columns: Column<Parent>[] = [
    { key: "name", header: "Category", render: (p) => (
      <div>
        <p className="font-medium">{p.name}</p>
        <p className="text-xs text-charcoal/50 dark:text-cream/50">{p.slug}</p>
      </div>
    ) },
    { key: "children_count", header: "Collections", render: (p) => p.children_count },
    { key: "products_count", header: "Products", render: (p) => p.products_count },
    { key: "status", header: "Status", render: (p) => <Badge tone={statusTone(p.status)}>{p.status}</Badge> },
    { key: "actions", header: "", render: (p) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => openEdit(p)} className="text-sm text-gold hover:underline">Edit</button>
        <button onClick={() => setToDelete(p)} className="text-sm text-red-500 hover:underline">Delete</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold">Parent Categories</h2>
        <Button size="sm" onClick={openNew}>+ New Category</Button>
      </div>

      <DashTable
        columns={columns}
        rows={rows}
        getId={(p) => p.id}
        loading={loading}
        emptyTitle="No categories yet"
        emptyDescription="Create your first parent category (e.g. Sofas)."
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Category" : "New Category"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={save}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name" hint={editing ? editing.slug : "URL becomes /name/"}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </Field>
            <Field label="Sort order">
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Meta title" hint={`${form.meta_title.length}/60`}>
            <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
          </Field>
          <Field label="Meta description" hint={`${form.meta_description.length}/160`}>
            <Textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title={`Delete '${toDelete?.name}'?`}
        message={`This removes ${toDelete?.children_count ?? 0} collection(s). Their products are kept but become uncategorized.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
