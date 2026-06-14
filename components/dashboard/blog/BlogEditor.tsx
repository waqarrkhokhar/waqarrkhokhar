"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DashPageHeader, DashSection, DashTabs, DashInput, DashSelect, DashBtn,
} from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { computeSeoScore, countWords } from "@/lib/seo/score";
import { slugify } from "@/lib/slug";
import { BLOG_CATEGORIES } from "@/lib/blog/schema";

type Mode = "create" | "edit";
type Tab = "content" | "faq" | "links" | "seo";
type Faq = { q: string; a: string };
type ILink = { type: string; name: string; url: string };

export default function BlogEditor({ mode, postId }: { mode: Mode; postId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("content");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [slug, setSlug] = useState("");

  const [f, setF] = useState({
    title: "", content: "", excerpt: "", featured_image: "",
    category: BLOG_CATEGORIES[0] as string, tags: "", author: "",
    status: "draft", scheduled_at: "",
    meta_title: "", meta_description: "", focus_keyword: "", canonical_url: "",
  });
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [links, setLinks] = useState<ILink[]>([]);

  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  const load = useCallback(async () => {
    if (mode !== "edit" || !postId) return;
    const res = await apiGet<{ data: Record<string, unknown> }>(`/api/blog/${postId}`);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    const p = res.data.data;
    setSlug(String(p.slug ?? ""));
    setFaqs(Array.isArray(p.faqs) ? (p.faqs as Faq[]) : []);
    setLinks(Array.isArray(p.internal_links) ? (p.internal_links as ILink[]) : []);
    setF({
      title: String(p.title ?? ""), content: String(p.content ?? ""), excerpt: String(p.excerpt ?? ""),
      featured_image: String(p.featured_image ?? ""), category: String(p.category ?? BLOG_CATEGORIES[0]),
      tags: Array.isArray(p.tags) ? (p.tags as string[]).join(", ") : "", author: String(p.author ?? ""),
      status: String(p.status ?? "draft"), scheduled_at: p.scheduled_at ? String(p.scheduled_at).slice(0, 16) : "",
      meta_title: String(p.meta_title ?? ""), meta_description: String(p.meta_description ?? ""),
      focus_keyword: String(p.focus_keyword ?? ""), canonical_url: String(p.canonical_url ?? ""),
    });
  }, [mode, postId, toast]);

  useEffect(() => { load(); }, [load]);

  /** Insert markdown around the current selection in the content textarea. */
  function wrap(before: string, after = "", placeholder = "") {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    const sel = f.content.slice(start, end) || placeholder;
    const next = f.content.slice(0, start) + before + sel + after + f.content.slice(end);
    set("content", next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + sel.length;
    });
  }

  function payload(overrideStatus?: string) {
    const str = (s: string) => (s.trim() ? s.trim() : null);
    return {
      title: f.title.trim(), content: f.content.trim() || null, excerpt: str(f.excerpt),
      featured_image: str(f.featured_image), category: f.category,
      tags: f.tags.trim() ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
      author: str(f.author), status: overrideStatus ?? f.status,
      scheduled_at: (overrideStatus ?? f.status) === "scheduled" && f.scheduled_at ? new Date(f.scheduled_at).toISOString() : null,
      meta_title: str(f.meta_title), meta_description: str(f.meta_description),
      focus_keyword: str(f.focus_keyword), canonical_url: str(f.canonical_url),
      faqs: faqs.filter((q) => q.q.trim()), internal_links: links.filter((l) => l.url.trim()),
    };
  }

  async function save(overrideStatus?: string) {
    if (f.title.trim().length < 5) { setTab("content"); return toast.error("Title must be at least 5 characters"); }
    if (!f.content.trim()) { setTab("content"); return toast.error("Content is required"); }
    setSaving(true);
    if (mode === "create") {
      const res = await apiSend<{ data: { id: string } }>("/api/blog", "POST", payload(overrideStatus));
      setSaving(false);
      if (!res.ok) return toast.error(res.error);
      toast.success("Post created");
      router.replace(`/dashboard/blog/${res.data.data.id}`);
    } else {
      const res = await apiSend(`/api/blog/${postId}`, "PATCH", payload(overrideStatus));
      setSaving(false);
      if (!res.ok) return toast.error(res.error);
      if (overrideStatus) set("status", overrideStatus);
      toast.success("Saved");
      load();
    }
  }

  async function remove() {
    setConfirmDelete(false);
    const res = await apiSend(`/api/blog/${postId}`, "DELETE");
    if (!res.ok) return toast.error(res.error);
    toast.success("Post deleted");
    router.push("/dashboard/blog");
  }

  async function upload(file: File) {
    const form = new FormData();
    form.append("file", file); form.append("folder", "blog");
    const up = await fetch("/api/media/upload", { method: "POST", body: form });
    const json = await up.json().catch(() => ({}));
    if (!up.ok) return toast.error(json.error ?? "Upload failed");
    set("featured_image", json.data.url);
  }

  const score = computeSeoScore({
    metaTitle: f.meta_title, metaDescription: f.meta_description, focusKeyword: f.focus_keyword,
    contentWordCount: countWords(f.content, f.excerpt), minWords: 300, schemaEnabled: true,
    ogImage: f.featured_image, canonical: f.canonical_url, internalLinks: links.length,
  });

  if (loading) return <p className="text-sm text-muted">Loading…</p>;
  const previewSlug = slug || slugify(f.title || "new-post");

  const TABS: { id: Tab; label: string }[] = [
    { id: "content", label: "Content" },
    { id: "faq", label: `FAQs (${faqs.length})` },
    { id: "links", label: `Internal Links (${links.length})` },
    { id: "seo", label: "SEO" },
  ];

  const TOOLBAR: [string, () => void, string?][] = [
    ["H2", () => wrap("\n## ", "", "Heading")],
    ["H3", () => wrap("\n### ", "", "Subheading")],
    ["B", () => wrap("**", "**", "bold"), "font-bold"],
    ["I", () => wrap("_", "_", "italic"), "italic"],
    ["• List", () => wrap("\n- ", "", "item")],
    ["1. List", () => wrap("\n1. ", "", "item")],
    ["❝", () => wrap("\n> ", "", "quote")],
    ["Link", () => wrap("[", "](https://)", "text")],
    ["Image", () => wrap("\n![alt](", ")", "https://")],
    ["—", () => wrap("\n\n---\n\n")],
  ];

  return (
    <div>
      <DashPageHeader
        title={mode === "create" ? "New Blog Post" : `Edit: ${f.title || "Untitled"}`}
        breadcrumbs={[{ label: "Blog", href: "/dashboard/blog" }, { label: mode === "create" ? "New" : "Edit" }]}
        actions={
          <>
            {mode === "edit" && <DashBtn variant="secondary" onClick={() => window.open(`/blog/${previewSlug}/`, "_blank")}>Preview</DashBtn>}
            {mode === "edit" && <DashBtn variant="danger" onClick={() => setConfirmDelete(true)}>Delete</DashBtn>}
            <DashBtn variant="secondary" onClick={() => save()}>{saving ? "Saving…" : "Save Draft"}</DashBtn>
            <DashBtn onClick={() => save("published")}>Publish</DashBtn>
          </>
        }
      />

      {f.status === "published" && previewSlug && (
        <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
          <span className="text-xs font-medium text-green-600">Live:</span>
          <a href={`/blog/${previewSlug}/`} target="_blank" rel="noopener noreferrer" className="text-xs text-ink underline dark:text-cream">comfyclub.pk/blog/{previewSlug}/</a>
        </div>
      )}

      <DashTabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_280px]">
        <div>
          {tab === "content" && (
            <DashSection title="Post Content">
              <DashInput label="Title" required value={f.title} onChange={(v) => { set("title", v); if (mode === "create") setSlug(slugify(v)); }} placeholder="Enter blog post title" />
              <DashInput label="URL Slug" value={previewSlug} disabled helper={`/blog/${previewSlug}/`} />
              <label className="mb-1.5 block text-xs font-medium text-ink dark:text-cream">Content</label>
              <div className="flex flex-wrap gap-0.5 rounded-t-md border border-b-0 border-line bg-panel px-2 py-1.5 dark:border-white/10 dark:bg-white/5">
                {TOOLBAR.map(([label, fn, cls]) => (
                  <button key={label} type="button" onClick={fn} className={`rounded px-2 py-1 text-[13px] text-ink hover:bg-white dark:text-cream dark:hover:bg-white/10 ${cls ?? ""}`}>{label}</button>
                ))}
              </div>
              <textarea ref={contentRef} value={f.content} onChange={(e) => set("content", e.target.value)} rows={16}
                placeholder="Write your blog post in Markdown…"
                className="w-full rounded-b-md border border-line bg-white px-3.5 py-3 font-mono text-[13px] leading-relaxed text-ink outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-cream" />
              <div className="mt-1 text-[11px] text-muted">Markdown · {countWords(f.content)} words · ~{Math.max(1, Math.ceil(countWords(f.content) / 200))} min read</div>
            </DashSection>
          )}

          {tab === "faq" && (
            <DashSection title="FAQ Block" subtitle="Rendered as expandable accordions with FAQ schema markup">
              {faqs.map((q, i) => (
                <div key={i} className="mb-2.5 rounded-lg border border-line bg-panel p-3.5 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted">FAQ #{i + 1}</span>
                    <button onClick={() => setFaqs(faqs.filter((_, x) => x !== i))} className="text-red-500">×</button>
                  </div>
                  <DashInput label="Question" value={q.q} onChange={(v) => setFaqs(faqs.map((x, j) => j === i ? { ...x, q: v } : x))} placeholder="e.g. What fabric options do you offer?" />
                  <DashInput label="Answer" textarea rows={2} value={q.a} onChange={(v) => setFaqs(faqs.map((x, j) => j === i ? { ...x, a: v } : x))} placeholder="Answer…" />
                </div>
              ))}
              <DashBtn variant="secondary" size="sm" icon="+" onClick={() => setFaqs([...faqs, { q: "", a: "" }])}>Add FAQ</DashBtn>
            </DashSection>
          )}

          {tab === "links" && (
            <DashSection title="Internal Links" subtitle="Link to related products, collections and pages for better SEO">
              {links.map((l, i) => (
                <div key={i} className="mb-2 grid gap-2 rounded-lg border border-line p-3 dark:border-white/10 sm:grid-cols-3">
                  <DashInput label="Type" value={l.type} onChange={(v) => setLinks(links.map((x, j) => j === i ? { ...x, type: v } : x))} />
                  <DashInput label="Name" value={l.name} onChange={(v) => setLinks(links.map((x, j) => j === i ? { ...x, name: v } : x))} />
                  <DashInput label="URL" value={l.url} onChange={(v) => setLinks(links.map((x, j) => j === i ? { ...x, url: v } : x))} />
                  <div className="flex justify-end sm:col-span-3"><button onClick={() => setLinks(links.filter((_, x) => x !== i))} className="text-xs text-red-500">Remove</button></div>
                </div>
              ))}
              <DashBtn variant="secondary" size="sm" icon="+" onClick={() => setLinks([...links, { type: "Product", name: "", url: "" }])}>Add Link</DashBtn>
            </DashSection>
          )}

          {tab === "seo" && (
            <>
              <DashSection title="Search Engine Preview">
                <div className="max-w-xl rounded-lg bg-panel p-4 dark:bg-white/5">
                  <div className="text-[18px] leading-tight text-[#1a0dab] dark:text-blue-400">{f.meta_title || f.title || "Blog Post Title"} | ComfyClub</div>
                  <div className="mt-0.5 text-[13px] text-green-700">comfyclub.pk/blog/{previewSlug}/</div>
                  <div className="mt-1 text-[13px] leading-snug text-muted">{f.meta_description || f.excerpt || "No description set — add a compelling meta description."}</div>
                </div>
              </DashSection>
              <DashSection title="SEO Metadata">
                <DashInput label="Meta Title" value={f.meta_title} onChange={(v) => set("meta_title", v)} placeholder={`${f.title} | ComfyClub`} helper={`${f.meta_title.length}/60`} />
                <DashInput label="Meta Description" textarea rows={2} value={f.meta_description} onChange={(v) => set("meta_description", v)} helper={`${f.meta_description.length}/160`} />
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  <DashInput label="Focus Keyword" value={f.focus_keyword} onChange={(v) => set("focus_keyword", v)} />
                  <DashInput label="Canonical URL" value={f.canonical_url} onChange={(v) => set("canonical_url", v)} />
                </div>
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
        </div>

        {/* Sidebar */}
        <div>
          <DashSection title="Publish">
            <DashSelect label="Status" value={f.status} onChange={(v) => set("status", v)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </DashSelect>
            {f.status === "scheduled" && <DashInput label="Publish at" type="datetime-local" value={f.scheduled_at} onChange={(v) => set("scheduled_at", v)} />}
          </DashSection>
          <DashSection title="Category">
            <DashSelect value={f.category} onChange={(v) => set("category", v)}>
              {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </DashSelect>
          </DashSection>
          <DashSection title="Tags">
            <DashInput value={f.tags} onChange={(v) => set("tags", v)} placeholder="sofa, guide, tips (comma separated)" />
          </DashSection>
          <DashSection title="Author">
            <DashInput value={f.author} onChange={(v) => set("author", v)} placeholder="Defaults to you" />
          </DashSection>
          <DashSection title="Excerpt">
            <DashInput textarea rows={3} value={f.excerpt} onChange={(v) => set("excerpt", v)} helper={`${f.excerpt.length}/300`} />
          </DashSection>
          <DashSection title="Featured Image">
            <DashInput value={f.featured_image} onChange={(v) => set("featured_image", v)} placeholder="Image URL" />
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(file); e.target.value = ""; }} />
            <DashBtn variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>Upload</DashBtn>
            {f.featured_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.featured_image} alt="" referrerPolicy="no-referrer" className="mt-2 h-28 w-full rounded-lg object-cover" />
            )}
          </DashSection>
        </div>
      </div>

      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={remove}
        title="Delete this post?" message="This cannot be undone." confirmLabel="Delete" danger />
    </div>
  );
}
