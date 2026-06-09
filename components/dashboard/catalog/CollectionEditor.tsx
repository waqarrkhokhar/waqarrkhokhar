"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Badge, statusTone } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { computeSeoScore, countWords } from "@/lib/seo/score";
import CollectionProducts from "./CollectionProducts";

type Mode = "create" | "edit";
type Tab = "basic" | "media" | "content" | "products" | "seo";

type SeoContent = {
  whyBuy: string;
  shopByRoom: string;
  howToChoose: string;
  bottomContent: string;
  faqContent: string;
};

const EMPTY_SEO: SeoContent = {
  whyBuy: "", shopByRoom: "", howToChoose: "", bottomContent: "", faqContent: "",
};

export default function CollectionEditor({
  mode,
  collectionId,
}: {
  mode: Mode;
  collectionId?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("basic");
  const [parents, setParents] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [slug, setSlug] = useState("");
  const [parentName, setParentName] = useState("");

  const [f, setF] = useState({
    name: "", parent_id: "", status: "draft", sort_order: "0", is_featured: false,
    banner_image: "", intro_content: "",
    meta_title: "", meta_description: "", focus_keyword: "", canonical_url: "",
    og_image: "", robots: "index, follow", schema_enabled: true,
  });
  const [seo, setSeo] = useState<SeoContent>(EMPTY_SEO);

  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));

  const load = useCallback(async () => {
    if (mode !== "edit" || !collectionId) return;
    const res = await apiGet<{ data: Record<string, unknown> & { parent?: { name: string } } }>(
      `/api/collections/${collectionId}`,
    );
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    const c = res.data.data;
    setSlug(String(c.slug ?? ""));
    setParentName(c.parent?.name ?? "");
    const sc = (c.seo_content ?? {}) as Partial<SeoContent>;
    setSeo({ ...EMPTY_SEO, ...sc });
    setF({
      name: String(c.name ?? ""),
      parent_id: String(c.parent_id ?? ""),
      status: String(c.status ?? "draft"),
      sort_order: String(c.sort_order ?? 0),
      is_featured: !!c.is_featured,
      banner_image: String(c.banner_image ?? ""),
      intro_content: String(c.intro_content ?? ""),
      meta_title: String(c.meta_title ?? ""),
      meta_description: String(c.meta_description ?? ""),
      focus_keyword: String(c.focus_keyword ?? ""),
      canonical_url: String(c.canonical_url ?? ""),
      og_image: String(c.og_image ?? ""),
      robots: String(c.robots ?? "index, follow"),
      schema_enabled: c.schema_enabled !== false,
    });
  }, [mode, collectionId, toast]);

  useEffect(() => {
    apiGet<{ data: { id: string; name: string }[] }>("/api/parents").then(
      (r) => r.ok && setParents(r.data.data),
    );
    load();
  }, [load]);

  function payload() {
    const str = (s: string) => (s.trim() ? s.trim() : null);
    return {
      name: f.name.trim(),
      status: f.status,
      sort_order: parseInt(f.sort_order, 10) || 0,
      is_featured: f.is_featured,
      banner_image: str(f.banner_image),
      intro_content: str(f.intro_content),
      seo_content: seo,
      meta_title: str(f.meta_title),
      meta_description: str(f.meta_description),
      focus_keyword: str(f.focus_keyword),
      canonical_url: str(f.canonical_url),
      og_image: str(f.og_image),
      robots: str(f.robots),
      schema_enabled: f.schema_enabled,
    };
  }

  async function save(overrideStatus?: string) {
    if (f.name.trim().length < 2) {
      setTab("basic");
      return toast.error("Name is required");
    }
    if (mode === "create" && !f.parent_id) {
      setTab("basic");
      return toast.error("Pick a parent category");
    }
    setSaving(true);
    const body = { ...payload(), ...(overrideStatus ? { status: overrideStatus } : {}) };
    if (mode === "create") {
      const res = await apiSend<{ data: { id: string } }>("/api/collections", "POST", {
        ...body,
        parent_id: f.parent_id,
      });
      setSaving(false);
      if (!res.ok) return toast.error(res.error);
      toast.success("Collection created");
      router.replace(`/dashboard/collections/${res.data.data.id}`);
    } else {
      const res = await apiSend(`/api/collections/${collectionId}`, "PATCH", body);
      setSaving(false);
      if (!res.ok) return toast.error(res.error);
      if (overrideStatus) set("status", overrideStatus);
      toast.success("Saved");
      load();
    }
  }

  async function remove() {
    setConfirmDelete(false);
    const res = await apiSend(`/api/collections/${collectionId}`, "DELETE");
    if (!res.ok) return toast.error(res.error);
    toast.success("Collection deleted");
    router.push("/dashboard/collections");
  }

  async function uploadBanner(file: File) {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "media");
    const up = await fetch("/api/media/upload", { method: "POST", body: form });
    const json = await up.json().catch(() => ({}));
    if (!up.ok) return toast.error(json.error ?? "Upload failed");
    set("banner_image", json.data.url);
  }

  const score = computeSeoScore({
    metaTitle: f.meta_title,
    metaDescription: f.meta_description,
    focusKeyword: f.focus_keyword,
    contentWordCount: countWords(
      f.intro_content, seo.whyBuy, seo.shopByRoom, seo.howToChoose, seo.bottomContent, seo.faqContent,
    ),
    minWords: 300,
    schemaEnabled: f.schema_enabled,
    ogImage: f.og_image || f.banner_image,
    canonical: f.canonical_url,
    internalLinks: 1,
  });

  if (loading) return <p className="text-sm text-charcoal/60 dark:text-cream/60">Loading…</p>;

  const TABS: { id: Tab; label: string }[] = [
    { id: "basic", label: "Basic" },
    { id: "media", label: "Media" },
    { id: "content", label: "Content" },
    { id: "products", label: "Products" },
    { id: "seo", label: "SEO" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard/collections" className="text-sm text-charcoal/60 hover:text-gold dark:text-cream/60">
            ← Back to collections
          </Link>
          <h2 className="mt-1 font-heading text-2xl font-semibold">
            {mode === "create" ? "New Collection" : f.name || "Edit Collection"}
          </h2>
          {mode === "edit" && (
            <p className="text-xs text-charcoal/50 dark:text-cream/50">
              {slug} · <Badge tone={statusTone(f.status)}>{f.status}</Badge>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "edit" && (
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>
          )}
          <Button variant="secondary" size="sm" loading={saving} onClick={() => save()}>Save</Button>
          <Button size="sm" loading={saving} onClick={() => save("published")}>Save &amp; Publish</Button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-line dark:border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
              tab === t.id ? "border-b-2 border-gold text-navy dark:text-gold" : "text-charcoal/60 dark:text-cream/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "basic" && (
        <div className="grid max-w-xl gap-4">
          <Field label="Name" hint={mode === "edit" ? slug : "URL nests under the parent"}>
            <Input value={f.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          {mode === "create" ? (
            <Field label="Parent category">
              <Select value={f.parent_id} onChange={(e) => set("parent_id", e.target.value)}>
                <option value="">— Select —</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </Field>
          ) : (
            <Field label="Parent category"><Input value={parentName} disabled /></Field>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <Select value={f.status} onChange={(e) => set("status", e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </Field>
            <Field label="Sort order">
              <Input type="number" value={f.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
            Featured collection
          </label>
        </div>
      )}

      {tab === "media" && (
        <div className="max-w-xl space-y-3">
          <Field label="Banner image URL">
            <Input value={f.banner_image} onChange={(e) => set("banner_image", e.target.value)} />
          </Field>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadBanner(file);
              e.target.value = "";
            }}
          />
          <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>Upload file</Button>
          {f.banner_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.banner_image} alt="" className="mt-2 h-40 w-full rounded-xl object-cover" />
          )}
        </div>
      )}

      {tab === "content" && (
        <div className="grid max-w-3xl gap-4">
          <Field label="Intro text"><Textarea value={f.intro_content} onChange={(e) => set("intro_content", e.target.value)} /></Field>
          {([
            ["whyBuy", "Why Buy"],
            ["shopByRoom", "Shop by Room"],
            ["howToChoose", "How to Choose"],
            ["bottomContent", "Bottom content"],
            ["faqContent", "FAQ content"],
          ] as const).map(([key, label]) => (
            <Field key={key} label={label}>
              <Textarea value={seo[key]} onChange={(e) => setSeo({ ...seo, [key]: e.target.value })} />
            </Field>
          ))}
        </div>
      )}

      {tab === "products" &&
        (mode === "create" ? (
          <p className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-charcoal/60 dark:border-white/10 dark:text-cream/60">
            Save the collection first, then assign products here.
          </p>
        ) : (
          <CollectionProducts collectionId={collectionId!} />
        ))}

      {tab === "seo" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <Field label="Meta title" hint={`${f.meta_title.length}/60`}>
              <Input value={f.meta_title} onChange={(e) => set("meta_title", e.target.value)} />
            </Field>
            <Field label="Meta description" hint={`${f.meta_description.length}/160`}>
              <Textarea value={f.meta_description} onChange={(e) => set("meta_description", e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Focus keyword"><Input value={f.focus_keyword} onChange={(e) => set("focus_keyword", e.target.value)} /></Field>
              <Field label="Canonical URL"><Input value={f.canonical_url} onChange={(e) => set("canonical_url", e.target.value)} /></Field>
              <Field label="OG image URL"><Input value={f.og_image} onChange={(e) => set("og_image", e.target.value)} /></Field>
              <Field label="Robots"><Input value={f.robots} onChange={(e) => set("robots", e.target.value)} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={f.schema_enabled} onChange={(e) => set("schema_enabled", e.target.checked)} />
              Enable schema markup (CollectionPage + FAQ)
            </label>
          </div>
          <div className="rounded-xl border border-line p-4 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">SEO score</span>
              <span className={`text-2xl font-bold ${score.score >= 70 ? "text-green-600" : score.score >= 40 ? "text-amber-500" : "text-red-500"}`}>
                {score.score}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs">
              {score.checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2">
                  <span>{c.passed ? "✅" : "⬜"}</span>
                  <span className={c.passed ? "" : "text-charcoal/50 dark:text-cream/50"}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        title="Delete this collection?"
        message="Products are kept but become uncategorized. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
