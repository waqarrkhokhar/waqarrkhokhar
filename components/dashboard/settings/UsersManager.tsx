"use client";

import { useCallback, useEffect, useState } from "react";
import { DashPageHeader, DashSection, DashBadge, DashBtn } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";

type User = { id: string; name: string; email: string; role: string; status: string; last_login: string | null };

const ROLES = [
  { name: "Super Admin", desc: "Full access to everything, including users & settings" },
  { name: "Admin", desc: "Everything except user management" },
  { name: "SEO Manager", desc: "SEO, blog, media & analytics" },
  { name: "Product Manager", desc: "Products, collections, categories, media & reviews" },
  { name: "Content Editor", desc: "Blog posts, pages & media uploads" },
];
const roleBadge = (r: string) => (r === "Super Admin" || r === "Admin" ? "active" : "scheduled");
const statusBadge = (s: string) => (s === "active" ? "active" : s === "invited" ? "pending" : "archived");

export default function UsersManager() {
  const toast = useToast();
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<User | null>(null);
  const [invite, setInvite] = useState<{ name: string; email: string; role: string } | null>(null);
  const [inviting, setInviting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<{ data: User[] }>("/api/users");
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setRows(res.data.data);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!edit) return;
    const res = await apiSend(`/api/users/${edit.id}`, "PATCH", { name: edit.name, role: edit.role, status: edit.status });
    if (!res.ok) return toast.error(res.error);
    toast.success("User updated");
    setEdit(null);
    load();
  }

  async function sendInvite() {
    if (!invite) return;
    if (invite.name.trim().length < 2) return toast.error("Enter the person's name");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(invite.email)) return toast.error("Enter a valid email");
    setInviting(true);
    const res = await apiSend("/api/users", "POST", { name: invite.name.trim(), email: invite.email.trim(), role: invite.role });
    setInviting(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`Invitation sent to ${invite.email}`);
    setInvite(null);
    load();
  }

  const columns: Column<User>[] = [
    { key: "name", header: "Name", render: (u) => (
      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${u.status === "invited" ? "bg-amber-100 text-amber-700" : "bg-gold/15 text-gold"}`}>{u.name.charAt(0).toUpperCase()}</div>
        <div><div className="font-medium text-charcoal dark:text-cream">{u.name}</div><div className="text-[11px] text-muted">{u.email}</div></div>
      </div>
    ) },
    { key: "role", header: "Role", render: (u) => <DashBadge status={roleBadge(u.role)} label={u.role} /> },
    { key: "last_login", header: "Last Login", render: (u) => u.last_login ? new Date(u.last_login).toLocaleDateString() : "-" },
    { key: "status", header: "Status", render: (u) => <DashBadge status={statusBadge(u.status)} label={u.status} /> },
  ];

  return (
    <div>
      <DashPageHeader title="Users & Roles" subtitle="Manage team access and permissions" breadcrumbs={[{ label: "Settings" }, { label: "Users" }]}
        actions={<DashBtn icon="+" onClick={() => setInvite({ name: "", email: "", role: "Content Editor" })}>Invite User</DashBtn>} />

      <DashSection title="Roles & Permissions" subtitle="What each role can access">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role, i) => (
            <div key={role.name} className={`rounded-[10px] border border-line p-4 ${i === 0 ? "bg-gold/10" : "bg-white dark:bg-white/5"} dark:border-white/10`}>
              <div className="text-[14px] font-semibold text-charcoal dark:text-cream">{role.name}</div>
              <div className="mt-1 text-[11px] leading-relaxed text-muted">{role.desc}</div>
            </div>
          ))}
        </div>
      </DashSection>

      <DashSection title="Team Members" noPad>
        <DashTable columns={columns} rows={rows} getId={(u) => u.id} loading={loading} onRowClick={(u) => setEdit({ ...u })}
          emptyTitle="No team members" emptyDescription="People who sign in to the dashboard appear here." />
      </DashSection>

      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-[12px] text-blue-600">
        💡 Invite a team member above — they receive an email to set their password, then appear here as “invited” until they sign in.
      </div>

      <Modal open={!!invite} onClose={() => setInvite(null)} title="Invite Team Member"
        footer={<><Button variant="ghost" onClick={() => setInvite(null)}>Cancel</Button><Button onClick={sendInvite} loading={inviting}>Send Invitation</Button></>}>
        {invite && (
          <div className="space-y-3">
            <Field label="Full Name"><Input value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} placeholder="e.g. Ayesha Khan" /></Field>
            <Field label="Email"><Input type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="person@comfyclub.pk" /></Field>
            <Field label="Role">
              <Select value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
                {ROLES.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
              </Select>
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit ? `Edit: ${edit.name}` : "Edit User"}
        footer={<><Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save}>Save Changes</Button></>}>
        {edit && (
          <div className="space-y-3">
            <Field label="Full Name"><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Email"><Input value={edit.email} disabled /></Field>
            <Field label="Role">
              <Select value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })}>
                {ROLES.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                {["active", "suspended", "invited"].map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
