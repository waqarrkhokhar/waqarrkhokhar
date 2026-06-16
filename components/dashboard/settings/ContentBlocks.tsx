"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashBtn } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type Block = { id: string; name: string; content: string; updated: string };

export default function ContentBlocks() {
  const toast = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [canEdit, setCanEdit] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [f, setF] = useState({ name: "", content: "" });
  const [del, setDel] = useState<Block | null>(null);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      if (!r.ok) { setCanEdit(false); return; }
      setBlocks(Array.isArray(r.data.data.content_blocks) ? (r.data.data.content_blocks as Block[]) : []);
    });
  }, []);

  async function persist(next: Block[]) {
    const res = await apiSend("/api/settings", "PATCH", { key: "content_blocks", value: next });
    if (!res.ok) return toast.error("Could not save (admin only)");
    setBlocks(next);
  }

  function openNew() { setEditId(null); setF({ name: "", content: "" }); setOpen(true); }
  function openEdit(b: Block) { setEditId(b.id); setF({ name: b.name, content: b.content }); setOpen(true); }

  async function save() {
    if (!f.name.trim()) return toast.error("Block name is required");
    const now = new Date().toISOString();
    const next = editId
      ? blocks.map((b) => (b.id === editId ? { ...b, name: f.name, content: f.content, updated: now } : b))
      : [...blocks, { id: Date.now().toString(36), name: f.name, content: f.content, updated: now }];
    await persist(next);
    toast.success(editId ? "Block updated" : "Block added");
    setOpen(false);
  }

  async function remove() {
    if (!del) return;
    await persist(blocks.filter((b) => b.id !== del.id));
    toast.success(`"${del.name}" deleted`);
    setDel(null);
  }

  const columns: Column<Block>[] = [
    { key: "name", header: "Block Name", render: (b) => <span className="font-medium">{b.name}</span> },
    { key: "content", header: "Preview", render: (b) => <span className="line-clamp-1 text-xs text-muted">{b.content.replace(/<[^>]+>/g, "")}</span> },
    { key: "updated", header: "Last Updated", render: (b) => b.updated ? new Date(b.updated).toLocaleDateString() : "-" },
    { key: "actions", header: "", className: "w-20", render: (b) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => openEdit(b)} title="Edit" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">✏️</button>
        <button onClick={() => setDel(b)} title="Delete" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10">🗑️</button>
      </div>
    ) },
  ];

  return (
    <div>
      <DashPageHeader title="Content Blocks" subtitle="Reusable snippets - update once, reuse anywhere"
        breadcrumbs={[{ label: "Settings" }, { label: "Content Blocks" }]}
        actions={canEdit && <DashBtn icon="+" onClick={openNew}>Add Block</DashBtn>} />

      <DashSection noPad>
        <DashTable columns={columns} rows={blocks} getId={(b) => b.id} onRowClick={openEdit}
          emptyTitle="No content blocks yet" emptyDescription="Create snippets like a shipping note or warranty blurb to reuse across pages." />
      </DashSection>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Block" : "Add Block"}
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        <div className="space-y-3">
          <Field label="Block Name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Shipping Note" /></Field>
          <Field label="Content"><Textarea className="min-h-32" value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} placeholder="Reusable text or HTML…" /></Field>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete block" message={`Delete "${del?.name}"?`} confirmLabel="Delete" danger />
    </div>
  );
}
