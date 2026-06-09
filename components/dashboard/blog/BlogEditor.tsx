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
      title: String(p.title ?? ""),
      content: String(p.content ?? ""),
      excerpt: String(p.excerpt ?? ""),
      featured_image: String(p.featured_image ?? ""),
      category: String(p.category ?? BLOG_CATEGORIES[0]),
      tags: Array.isArray(p.tags) ? (p.tags as string[]).join(", ") : "",
      author: String(p.author ?? ""),
      status: String(p.status ?? "draft"),
      scheduled_at: p.scheduled_at ? String(p.scheduled_at).slice(0, 16) : "",
      meta_title: String(p.meta_title ?? ""),
      meta_description: String(p.meta_description ?? ""),
      focus_keyword: String(p.focus_keyword ?? ""),
      canonical_url: String(p.canonical_url ?? ""),
    });
  }, [mode, postId, toast]);

  useEffect(() => {
    load();
  }, [load]);

  /** Insert markdown around the current selection in the content textarea. */
  function wrap(before: string, after = "", placeholder = "") {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
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
      title: f.title.trim(),
      content: f.content.trim() || null,
      excerpt: str(f.excerpt),
      featured_image: str(f.featured_image),
      category: f.category,
      tags: f.tags.trim() ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
      author: str(f.author),
      status: overrideStatus ?? f.status,
      scheduled_at:
        (overrideStatus ?? f.status) === "scheduled" && f.scheduled_at
          ? new Date(f.scheduled_at).toISOString()
          : null,
      meta_title: str(f.meta_title),
      meta_description: str(f.meta_description),
      focus_keyword: str(f.focus_keyword),
      canonical_url: str(f.canonical_url),
      faqs: faqs.filter((q) => q.q.trim()),
      internal_links: links.filter((l) => l.url.trim()),
    };
  }

  async function save(overrideStatus?: string) {
    if (f.title.trim().length < 5) {
      setTab("content");
      return toast.error("Title must be at least 5 characters");
    }
    if (!f.content.trim()) {
      setTab("content");
      return toast.error("Content is required");
    }
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
    form.append("file", file);
    form.append("folder", "blog");
    const up = await fetch("/api/media/upload", { method: "POST", body: form });
    const json = await up.json().catch(() => ({}));
    if (!up.ok) return toast.error(json.error ?? "Upload failed");
    set("featured_image", json.data.url);
  }

  const score = computeSeoScore({
    metaTitle: f.meta_title,
    metaDescription: f.meta_description,
    focusKeyword: f.focus_keyword,
    contentWordCount: countWords(f.content, f.excerpt),
    minWords: 300,
    schemaEnabled: true,
    ogImage: f.featured_image,
    canonical: f.canonical_url,
    internalLinks: links.length,
  });

  if (loading) return <p className="text-sm text-charcoal/60 dark:text-cream/60">Loading…</p>;
  const previewSlug = slug || slugify(f.title || "new-post");

  const TABS: { id: Tab; label: string }[] = [
    { id: "content", label: "Content" },
    { id: "faq", label: `FAQ (${faqs.length})` },
    { id: "links", label: `Internal Links (${links.length})` },
    { id: "seo", label: "SEO" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard/blog" className="text-sm text-charcoal/60 hover:text-gold dark:text-cream/60">← Back to blog</Link>
          <h2 className="mt-1 font-heading text-2xl font-semibold">{mode === "create" ? "New Post" : f.title || "Edit Post"}</h2>
          {mode === "edit" && <p className="text-xs text-charcoal/50 dark:text-cream/50">/blog/{previewSlug}/ · <Badge tone={statusTone(f.status)}>{f.status}</Badge></p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "edit" && <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>}
          <Button variant="secondary" size="sm" loading={saving} onClick={() => save()}>Save</Button>
          <Button size="sm" loading={saving} onClick={() => save("published")}>Save &amp; Publish</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-4 flex gap-1 overflow-x-auto border-b border-line dark:border-white/10">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${tab === t.id ? "border-b-2 border-gold text-navy dark:text-gold" : "text-charcoal/60 dark:text-cream/60"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "content" && (
            <div className="space-y-4">
              <Field label="Title" hint={`/blog/${previewSlug}/`}>
                <Input value={f.title} onChange={(e) => set("title", e.target.value)} />
              </Field>
              <div>
                <div className="mb-1 flex flex-wrap gap-1">
                  {[
                    ["H2", () => wrap("\n## ", "", "Heading")],
                    ["H3", () => wrap("\n### ", "", "Subheading")],
                    ["B", () => wrap("**", "**", "bold")],
                    ["I", () => wrap("_", "_", "italic")],
                    ["• List", () => wrap("\n- ", "", "item")],
                    ["❝", () => wrap("\n> ", "", "quote")],
                    ["Link", () => wrap("[", "](https://)", "text")],
                    ["Image", () => wrap("\n![alt](", ")", "https://")],
                  ].map(([label, fn]) => (
                    <button key={label as string} type="button" onClick={fn as () => void}
                      className="rounded border border-black/10 px-2 py-1 text-xs hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
                      {label as string}
                    </button>
                  ))}
                </div>
                <Textarea ref={contentRef} className="min-h-80 font-mono text-sm" value={f.content} onChange={(e) => set("content", e.target.value)} />
                <p className="mt-1 text-xs text-charcoal/50 dark:text-cream/50">
                  Markdown · {countWords(f.content)} words
                </p>
              </div>
            </div>
          )}

          {tab === "faq" && (
            <div className="space-y-3">
              {faqs.map((q, i) => (
                <div key={i} className="rounded-xl border border-line p-3 dark:border-white/10">
                  <div className="mb-2 flex justify-end">
                    <button onClick={() => setFaqs(faqs.filter((_, x) => x !== i))} className="text-xs text-red-500">Remove</button>
                  </div>
                  <Field label="Question"><Input value={q.q} onChange={(e) => setFaqs(faqs.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} /></Field>
                  <div className="mt-2"><Field label="Answer"><Textarea value={q.a} onChange={(e) => setFaqs(faqs.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} /></Field></div>
                </div>
              ))}
              <Button size="sm" variant="secondary" onClick={() => setFaqs([...faqs, { q: "", a: "" }])}>+ Add FAQ</Button>
            </div>
          )}

          {tab === "links" && (
            <div className="space-y-3">
              {links.map((l, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-line p-3 dark:border-white/10 sm:grid-cols-3">
                  <Field label="Type"><Input value={l.type} onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, type: e.target.value } : x))} /></Field>
                  <Field label="Name"><Input value={l.name} onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} /></Field>
                  <Field label="URL"><Input value={l.url} onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} /></Field>
                  <div className="sm:col-span-3 flex justify-end">
                    <button onClick={() => setLinks(links.filter((_, x) => x !== i))} className="text-xs text-red-500">Remove</button>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="secondary" onClick={() => setLinks([...links, { type: "Product", name: "", url: "" }])}>+ Add link</Button>
            </div>
          )}

          {tab === "seo" && (
            <div className="space-y-4">
              <Field label="Meta title" hint={`${f.meta_title.length}/60`}><Input value={f.meta_title} onChange={(e) => set("meta_title", e.target.value)} /></Field>
              <Field label="Meta description" hint={`${f.meta_description.length}/160`}><Textarea value={f.meta_description} onChange={(e) => set("meta_description", e.target.value)} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Focus keyword"><Input value={f.focus_keyword} onChange={(e) => set("focus_keyword", e.target.value)} /></Field>
                <Field label="Canonical URL"><Input value={f.canonical_url} onChange={(e) => set("canonical_url", e.target.value)} /></Field>
              </div>
              <div className="rounded-xl border border-line p-4 dark:border-white/10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">SEO score</span>
                  <span className={`text-2xl font-bold ${score.score >= 70 ? "text-green-600" : score.score >= 40 ? "text-amber-500" : "text-red-500"}`}>{score.score}</span>
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
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 rounded-xl border border-line p-4 dark:border-white/10">
          <Field label="Status">
            <Select value={f.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </Select>
          </Field>
          {f.status === "scheduled" && (
            <Field label="Publish at"><Input type="datetime-local" value={f.scheduled_at} onChange={(e) => set("scheduled_at", e.target.value)} /></Field>
          )}
          <Field label="Category">
            <Select value={f.category} onChange={(e) => set("category", e.target.value)}>
              {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Tags" hint="Comma-separated"><Input value={f.tags} onChange={(e) => set("tags", e.target.value)} /></Field>
          <Field label="Author"><Input value={f.author} onChange={(e) => set("author", e.target.value)} placeholder="Defaults to you" /></Field>
          <Field label="Excerpt" hint={`${f.excerpt.length}/300`}><Textarea value={f.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></Field>
          <div>
            <Field label="Featured image URL"><Input value={f.featured_image} onChange={(e) => set("featured_image", e.target.value)} /></Field>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(file); e.target.value = ""; }} />
            <Button size="sm" variant="secondary" className="mt-2" onClick={() => fileRef.current?.click()}>Upload</Button>
            {f.featured_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.featured_image} alt="" className="mt-2 h-28 w-full rounded-lg object-cover" />
            )}
          </div>
        </aside>
      </div>

      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={remove}
        title="Delete this post?" message="This cannot be undone." confirmLabel="Delete" danger />
    </div>
  );
}
