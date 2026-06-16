"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DashPageHeader, DashSection, DashTabs, DashInput, DashSelect, DashToggle, DashBtn,
} from "@/components/dashboard/shared/Dash";
import RichTextEditor from "@/components/dashboard/shared/RichTextEditor";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { computeSeoScore, countWords } from "@/lib/seo/score";
import CollectionProducts from "./CollectionProducts";

type Mode = "create" | "edit";
type Tab = "basic" | "media" | "content" | "homepage" | "products" | "seo";

type SeoContent = { whyBuy: string; shopByRoom: string; howToChoose: string; bottomContent: string; faqContent: string };
const EMPTY_SEO: SeoContent = { whyBuy: "", shopByRoom: "", howToChoose: "", bottomContent: "", faqContent: "" };

export default function CollectionEditor({ mode, collectionId }: { mode: Mode; collectionId?: string }) {
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
    banner_image: "", intro_content: "", content_html: "",
    meta_title: "", meta_description: "", focus_keyword: "", canonical_url: "",
    og_image: "", robots: "index, follow", schema_enabled: true,
  });
  const [seo, setSeo] = useState<SeoContent>(EMPTY_SEO);
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));

  const load = useCallback(async () => {
    if (mode !== "edit" || !collectionId) return;
    const res = await apiGet<{ data: Record<string, unknown> & { parent?: { name: string } } }>(`/api/collections/${collectionId}`);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    const c = res.data.data;
    setSlug(String(c.slug ?? ""));
    setParentName(c.parent?.name ?? "");
    setSeo({ ...EMPTY_SEO, ...((c.seo_content ?? {}) as Partial<SeoContent>) });
    setF({
      name: String(c.name ?? ""), parent_id: String(c.parent_id ?? ""), status: String(c.status ?? "draft"),
      sort_order: String(c.sort_order ?? 0), is_featured: !!c.is_featured, banner_image: String(c.banner_image ?? ""),
      intro_content: String(c.intro_content ?? ""), content_html: String(c.content_html ?? ""), meta_title: String(c.meta_title ?? ""),
      meta_description: String(c.meta_description ?? ""), focus_keyword: String(c.focus_keyword ?? ""),
      canonical_url: String(c.canonical_url ?? ""), og_image: String(c.og_image ?? ""),
      robots: String(c.robots ?? "index, follow"), schema_enabled: c.schema_enabled !== false,
    });
  }, [mode, collectionId, toast]);

  useEffect(() => {
    apiGet<{ data: { id: string; name: string }[] }>("/api/parents").then((r) => r.ok && setParents(r.data.data));
    load();
  }, [load]);

  function payload() {
    const str = (s: string) => (s.trim() ? s.trim() : null);
    return {
      name: f.name.trim(), status: f.status, sort_order: parseInt(f.sort_order, 10) || 0, is_featured: f.is_featured,
      banner_image: str(f.banner_image), intro_content: str(f.intro_content), content_html: str(f.content_html), seo_content: seo,
      meta_title: str(f.meta_title), meta_description: str(f.meta_description), focus_keyword: str(f.focus_keyword),
      canonical_url: str(f.canonical_url), og_image: str(f.og_image), robots: str(f.robots), schema_enabled: f.schema_enabled,
    };
  }

  async function save(overrideStatus?: string) {
    if (f.name.trim().length < 2) { setTab("basic"); return toast.error("Name is required"); }
    if (mode === "create" && !f.parent_id) { setTab("basic"); return toast.error("Pick a parent category"); }
    setSaving(true);
    const body = { ...payload(), ...(overrideStatus ? { status: overrideStatus } : {}) };
    if (mode === "create") {
      const res = await apiSend<{ data: { id: string } }>("/api/collections", "POST", { ...body, parent_id: f.parent_id });
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
    toast.success("Collection moved to trash");
    router.push("/dashboard/collections");
  }

  async function uploadBanner(file: File) {
    const form = new FormData();
    form.append("file", file); form.append("folder", "media");
    const up = await fetch("/api/media/upload", { method: "POST", body: form });
    const json = await up.json().catch(() => ({}));
    if (!up.ok) return toast.error(json.error ?? "Upload failed");
    set("banner_image", json.data.url);
  }

  const score = computeSeoScore({
    metaTitle: f.meta_title, metaDescription: f.meta_description, focusKeyword: f.focus_keyword,
    contentWordCount: countWords(f.intro_content, f.content_html.replace(/<[^>]+>/g, " ")),
    minWords: 300, schemaEnabled: f.schema_enabled, ogImage: f.og_image || f.banner_image, canonical: f.canonical_url, internalLinks: 1,
  });

  if (loading) return <p className="text-sm text-muted">Loading…</p>;

  const TABS: { id: Tab; label: string }[] = [
    { id: "basic", label: "Basic" }, { id: "media", label: "Media" }, { id: "content", label: "Content" },
    { id: "homepage", label: "Homepage" }, { id: "products", label: "Products" }, { id: "seo", label: "SEO" },
  ];

  return (
    <div>
      <DashPageHeader
        title={mode === "create" ? "New Collection" : f.name || "Edit Collection"}
        breadcrumbs={[{ label: "Catalog" }, { label: "Collections", href: "/dashboard/collections" }, { label: mode === "create" ? "New" : f.name }]}
        actions={
          <>
            {mode === "edit" && <DashBtn variant="secondary" onClick={() => window.open(`${slug}${slug.includes("?") ? "&" : "?"}preview=1`, "_blank")}>👁 Preview</DashBtn>}
            {mode === "edit" && <DashBtn variant="danger" onClick={() => setConfirmDelete(true)}>Delete</DashBtn>}
            <DashBtn variant="secondary" onClick={() => save()}>{saving ? "Saving…" : "Save"}</DashBtn>
            <DashBtn onClick={() => save("published")}>Save &amp; Publish</DashBtn>
          </>
        }
      />

      <DashTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "basic" && (
        <DashSection title="Basic Information">
          <DashInput label="Collection Name" value={f.name} required onChange={(v) => set("name", v)} placeholder="e.g. Recliner Sofas" />
          {mode === "create" ? (
            <DashSelect label="Parent Category" required value={f.parent_id} onChange={(v) => set("parent_id", v)}>
              <option value="">- Select -</option>
              {parents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </DashSelect>
          ) : (
            <DashInput label="Parent Category" value={parentName} disabled />
          )}
          <DashInput label="Slug" value={slug} disabled helper={mode === "create" ? "Auto-generated under the parent" : "Nested URL path"} />
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <DashSelect label="Status" value={f.status} onChange={(v) => set("status", v)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </DashSelect>
            <DashInput label="Sort Order" type="number" value={f.sort_order} onChange={(v) => set("sort_order", v)} />
          </div>
        </DashSection>
      )}

      {tab === "media" && (
        <DashSection title="Hero Banner" subtitle="Shown at the top of the collection page">
          <DashInput label="Banner Image URL" value={f.banner_image} onChange={(v) => set("banner_image", v)} placeholder="Upload or paste an image URL" />
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadBanner(file); e.target.value = ""; }} />
          <DashBtn variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>Upload file</DashBtn>
          {f.banner_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.banner_image} alt="" referrerPolicy="no-referrer" className="mt-3 h-40 w-full rounded-lg object-cover" />
          )}
        </DashSection>
      )}

      {tab === "content" && (
        <DashSection title="Collection Content" subtitle="Rich content rendered below the product grid on the storefront">
          <DashInput label="Collection Intro" textarea rows={3} value={f.intro_content} onChange={(v) => set("intro_content", v)} placeholder="Short introduction shown at the top of the collection page" />
          <div className="mb-3 rounded-md bg-blue-50 p-2.5 text-[12px] text-blue-600">
            💡 Use the editor below for the long-form page content (headings, lists, internal links). It renders under the products and pagination. For links, select text → 🔗 Link → paste the URL and tick &ldquo;Open in new tab&rdquo; if needed.
          </div>
          <label className="mb-1.5 block text-xs font-medium text-ink dark:text-cream">Page Content</label>
          <RichTextEditor value={f.content_html} onChange={(v) => set("content_html", v)} />
        </DashSection>
      )}

      {tab === "homepage" && (
        <DashSection title="Homepage Placement">
          <DashToggle label="Featured Collection" checked={f.is_featured} onChange={(v) => set("is_featured", v)} helper="Eligible to appear in featured homepage sections" />
        </DashSection>
      )}

      {tab === "products" && (
        mode === "create" ? (
          <DashSection title="Products">
            <p className="py-6 text-center text-sm text-muted">Save the collection first, then assign products here.</p>
          </DashSection>
        ) : (
          <DashSection title="Products in this Collection" noPad>
            <div className="p-5"><CollectionProducts collectionId={collectionId!} /></div>
          </DashSection>
        )
      )}

      {tab === "seo" && (
        <>
          <DashSection title="Search Engine Optimization">
            <DashInput label="Meta Title" value={f.meta_title} onChange={(v) => set("meta_title", v)} helper={`${f.meta_title.length}/60`} />
            <DashInput label="Meta Description" textarea rows={2} value={f.meta_description} onChange={(v) => set("meta_description", v)} helper={`${f.meta_description.length}/160`} />
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <DashInput label="Focus Keyword" value={f.focus_keyword} onChange={(v) => set("focus_keyword", v)} />
              <DashInput label="Canonical URL" value={f.canonical_url} onChange={(v) => set("canonical_url", v)} />
              <DashInput label="OG Image URL" value={f.og_image} onChange={(v) => set("og_image", v)} />
              <DashInput label="Robots" value={f.robots} onChange={(v) => set("robots", v)} />
            </div>
            <DashToggle label="Enable schema markup (CollectionPage + FAQ)" checked={f.schema_enabled} onChange={(v) => set("schema_enabled", v)} />
          </DashSection>
          <DashSection title="SEO Score">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Score</span>
              <span className={`text-2xl font-bold ${score.score >= 70 ? "text-green-600" : score.score >= 40 ? "text-amber-500" : "text-red-500"}`}>{score.score}</span>
            </div>
            <ul className="space-y-1.5 text-xs">
              {score.checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2"><span>{c.passed ? "✅" : "⬜"}</span><span className={c.passed ? "" : "text-muted"}>{c.label}</span></li>
              ))}
            </ul>
          </DashSection>
        </>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        title="Move this collection to trash?"
        message="It will be hidden from the storefront. Restore it any time from Settings → Trash."
        confirmLabel="Move to Trash"
        danger
      />
    </div>
  );
}
