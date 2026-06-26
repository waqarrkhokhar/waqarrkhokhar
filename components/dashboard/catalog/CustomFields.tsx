"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashBadge, DashBtn, DashInput, DashSelect, DashToggle } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Field = { id: string; name: string; type: string; options: string; required: boolean; showOnProduct: boolean };
const TYPES = ["Text", "Number", "Select", "Multi-Select", "Toggle", "Color", "Date"];
const blank: Omit<Field, "id"> = { name: "", type: "Text", options: "", required: false, showOnProduct: true };

export default function CustomFields() {
  const toast = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [canEdit, setCanEdit] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [f, setF] = useState({ ...blank });
  const [del, setDel] = useState<Field | null>(null);

  useEffect(() => {
    apiGet<{ data: { fields: Field[] } }>("/api/custom-fields").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setFields(Array.isArray(r.data.data.fields) ? r.data.data.fields : []);
    });
  }, []);

  async function persist(next: Field[]) {
    const res = await apiSend("/api/custom-fields", "PATCH", { fields: next });
    if (!res.ok) { toast.error(res.error || "Could not save"); return false; }
    setFields(next);
    return true;
  }

  function openNew() { setEditId(null); setF({ ...blank }); setOpen(true); }
  function openEdit(x: Field) { setEditId(x.id); setF({ name: x.name, type: x.type, options: x.options, required: x.required, showOnProduct: x.showOnProduct }); setOpen(true); }

  async function save() {
    if (!f.name.trim()) return toast.error("Field name is required");
    const next = editId
      ? fields.map((x) => (x.id === editId ? { ...x, ...f } : x))
      : [...fields, { id: `${Date.now().toString(36)}${Math.round(performance.now())}`, ...f }];
    if (await persist(next)) {
      toast.success(editId ? "Field updated" : "Field added");
      setOpen(false);
    }
  }

  async function remove() {
    if (!del) return;
    if (await persist(fields.filter((x) => x.id !== del.id))) toast.success(`"${del.name}" deleted`);
    setDel(null);
  }

  const columns: Column<Field>[] = [
    { key: "name", header: "Field Name", render: (x) => <span className="font-medium">{x.name}</span> },
    { key: "type", header: "Type", render: (x) => <DashBadge status="scheduled" label={x.type} /> },
    { key: "options", header: "Options", render: (x) => x.options || "-" },
    { key: "required", header: "Required", render: (x) => (x.required ? "✓" : "-") },
    { key: "actions", header: "", className: "w-20", render: (x) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => openEdit(x)} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
        <button onClick={() => setDel(x)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
      </div>
    ) },
  ];

  return (
    <div>
      <DashPageHeader title="Custom Fields" subtitle="Define dynamic product specification fields"
        breadcrumbs={[{ label: "Catalog" }, { label: "Custom Fields" }]}
        actions={canEdit && <DashBtn icon="+" onClick={openNew}>Add Field</DashBtn>} />

      <DashSection noPad>
        <DashTable columns={columns} rows={fields} getId={(x) => x.id} onRowClick={openEdit}
          emptyTitle="No custom fields yet" emptyDescription="Add fields like Material, Frame Type or Dimensions." />
      </DashSection>

      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-[12px] text-blue-600">
        💡 Field definitions are saved here now. Showing them on each product&apos;s Specifications tab + storefront is part of the upcoming Specifications phase.
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Custom Field" : "Add Custom Field"}
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save Field</Button></>}>
        <div className="space-y-1">
          <DashInput label="Field Name" required value={f.name} onChange={(v) => setF({ ...f, name: v })} placeholder="e.g. Material" />
          <DashSelect label="Field Type" value={f.type} onChange={(v) => setF({ ...f, type: v })}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </DashSelect>
          <DashInput label="Options (comma separated)" value={f.options} onChange={(v) => setF({ ...f, options: v })} placeholder="Velvet, Boucle, Linen" helper="For Select / Multi-Select types" />
          <DashToggle label="Required Field" checked={f.required} onChange={(v) => setF({ ...f, required: v })} />
          <DashToggle label="Show on Product Page" checked={f.showOnProduct} onChange={(v) => setF({ ...f, showOnProduct: v })} />
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove}
        title="Delete field" message={`Delete "${del?.name}"?`} confirmLabel="Delete" danger />
    </div>
  );
}
