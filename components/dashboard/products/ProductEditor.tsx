"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DashPageHeader,
  DashSection,
  DashTabs,
  DashInput,
  DashSelect,
  DashToggle,
  DashBtn,
  DashCard,
} from "@/components/dashboard/shared/Dash";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import { computeSeoScore, countWords } from "@/lib/seo/score";
import { slugify } from "@/lib/slug";
import type { Catalog } from "./types";
import ProductImages, { type ProductImage } from "./ProductImages";
import ProductReviews from "./ProductReviews";
import ImageField from "@/components/dashboard/shared/ImageField";

type Mode = "create" | "edit";
type Tab =
  | "basic" | "descriptions" | "media" | "classification"
  | "pricing" | "labels" | "specs" | "reviews" | "seo";

type Form = {
  name: string; sku: string; price: string; sale_price: string;
  sale_start: string; sale_end: string;
  short_description: string; long_description: string; features: string;
  category_id: string; status: string; scheduled_at: string;
  is_featured: boolean; is_bestseller: boolean; is_trending: boolean;
  meta_title: string; meta_description: string; focus_keyword: string;
  secondary_keywords: string; canonical_url: string; og_image: string;
  og_title: string; og_description: string; robots: string;
  whatsapp_message_template: string;
};

const EMPTY: Form = {
  name: "", sku: "", price: "", sale_price: "", sale_start: "", sale_end: "",
  short_description: "", long_description: "", features: "", category_id: "",
  status: "draft", scheduled_at: "", is_featured: false, is_bestseller: false,
  is_trending: false, meta_title: "", meta_description: "", focus_keyword: "",
  secondary_keywords: "", canonical_url: "", og_image: "", og_title: "",
  og_description: "", robots: "index, follow", whatsapp_message_template: "",
};

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923394100052";

export default function ProductEditor({ mode, productId }: { mode: Mode; productId?: string }) {
  const router = useRouter();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>("basic");
  const [form, setForm] = useState<Form>(EMPTY);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const loadProduct = useCallback(async () => {
    if (mode !== "edit" || !productId) return;
    const res = await apiGet<{ data: Record<string, unknown> & { images: ProductImage[] } }>(`/api/products/${productId}`);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    const p = res.data.data;
    setSlug(String(p.slug ?? ""));
    setImages(p.images ?? []);
    const dt = (v: unknown) => (v ? String(v).slice(0, 16) : "");
    setForm({
      name: String(p.name ?? ""), sku: String(p.sku ?? ""),
      price: p.price != null ? String(p.price) : "", sale_price: p.sale_price != null ? String(p.sale_price) : "",
      sale_start: dt(p.sale_start), sale_end: dt(p.sale_end),
      short_description: String(p.short_description ?? ""), long_description: String(p.long_description ?? ""),
      features: String(p.features ?? ""), category_id: String(p.category_id ?? ""),
      status: String(p.status ?? "draft"), scheduled_at: dt(p.scheduled_at),
      is_featured: !!p.is_featured, is_bestseller: !!p.is_bestseller, is_trending: !!p.is_trending,
      meta_title: String(p.meta_title ?? ""), meta_description: String(p.meta_description ?? ""),
      focus_keyword: String(p.focus_keyword ?? ""),
      secondary_keywords: Array.isArray(p.secondary_keywords) ? (p.secondary_keywords as string[]).join(", ") : "",
      canonical_url: String(p.canonical_url ?? ""), og_image: String(p.og_image ?? ""),
      og_title: String(p.og_title ?? ""), og_description: String(p.og_description ?? ""),
      robots: String(p.robots ?? "index, follow"), whatsapp_message_template: String(p.whatsapp_message_template ?? ""),
    });
  }, [mode, productId, toast]);

  useEffect(() => {
    apiGet<{ data: Catalog }>("/api/catalog").then((r) => r.ok && setCatalog(r.data.data));
    loadProduct();
  }, [loadProduct]);

  function buildPayload() {
    const num = (s: string) => (s.trim() ? parseInt(s, 10) : null);
    const str = (s: string) => (s.trim() ? s.trim() : null);
    const iso = (s: string) => (s ? new Date(s).toISOString() : null);
    return {
      name: form.name.trim(), slug: slug.trim() || undefined, sku: str(form.sku), price: num(form.price), sale_price: num(form.sale_price),
      sale_start: iso(form.sale_start), sale_end: iso(form.sale_end),
      short_description: str(form.short_description), long_description: str(form.long_description),
      features: str(form.features), category_id: form.category_id || null, status: form.status,
      scheduled_at: form.status === "scheduled" && form.scheduled_at ? iso(form.scheduled_at) : null,
      is_featured: form.is_featured, is_bestseller: form.is_bestseller, is_trending: form.is_trending,
      meta_title: str(form.meta_title), meta_description: str(form.meta_description), focus_keyword: str(form.focus_keyword),
      secondary_keywords: form.secondary_keywords.trim() ? form.secondary_keywords.split(",").map((s) => s.trim()).filter(Boolean) : null,
      canonical_url: str(form.canonical_url), og_image: str(form.og_image),
      og_title: str(form.og_title), og_description: str(form.og_description),
      robots: str(form.robots), whatsapp_message_template: str(form.whatsapp_message_template),
    };
  }

  async function save(overrideStatus?: string) {
    if (form.name.trim().length < 3) { toast.error("Name must be at least 3 characters"); setTab("basic"); return; }
    setSaving(true);
    const payload = { ...buildPayload(), ...(overrideStatus ? { status: overrideStatus } : {}) };
    if (mode === "create") {
      const res = await apiSend<{ data: { id: string } }>("/api/products", "POST", payload);
      setSaving(false);
      if (!res.ok) return toast.error(res.error);
      toast.success("Product created");
      router.replace(`/dashboard/products/${res.data.data.id}`);
    } else {
      const res = await apiSend(`/api/products/${productId}`, "PATCH", payload);
      setSaving(false);
      if (!res.ok) return toast.error(res.error);
      if (overrideStatus) set("status", overrideStatus);
      toast.success("Saved");
      loadProduct();
    }
  }

  async function archive() {
    setConfirmArchive(false);
    const res = await apiSend(`/api/products/${productId}`, "DELETE");
    if (!res.ok) return toast.error(res.error);
    toast.success("Product moved to trash");
    router.push("/dashboard/products");
  }

  async function duplicate() {
    const res = await apiSend<{ data: { id: string } }>(`/api/products/${productId}/duplicate`, "POST");
    if (!res.ok) return toast.error(res.error);
    toast.success("Product duplicated");
    router.push(`/dashboard/products/${res.data.data.id}`);
  }

  const seo = computeSeoScore({
    metaTitle: form.meta_title, metaDescription: form.meta_description, focusKeyword: form.focus_keyword,
    contentWordCount: countWords(form.short_description, form.long_description, form.features),
    minWords: 100, schemaEnabled: true, ogImage: form.og_image || (images[0]?.url ?? null),
    canonical: form.canonical_url, internalLinks: form.category_id ? 1 : 0,
  });

  const previewSlug = slug || slugify(form.name || "new-product");
  const productUrl = `https://comfyclub.pk/product/${previewSlug}`;
  const selectedCol = catalog?.collections.find((c) => c.id === form.category_id) ?? null;
  const discount = form.price && form.sale_price ? Math.round((1 - Number(form.sale_price) / Number(form.price)) * 100) : 0;

  if (loading) return <p className="text-sm text-muted">Loading…</p>;

  const TABS: { id: Tab; label: string }[] = [
    { id: "basic", label: "Basic" },
    { id: "descriptions", label: "Descriptions" },
    { id: "media", label: "Media" },
    { id: "classification", label: "Classification" },
    { id: "pricing", label: "Pricing" },
    { id: "labels", label: "Labels" },
    { id: "specs", label: "Specifications" },
    ...(mode === "edit" ? [{ id: "reviews" as Tab, label: "Reviews" }] : []),
    { id: "seo", label: "SEO" },
  ];

  return (
    <div>
      <DashPageHeader
        title={mode === "create" ? "New Product" : `Edit: ${form.name.slice(0, 35)}${form.name.length > 35 ? "…" : ""}`}
        breadcrumbs={[{ label: "Catalog" }, { label: "Products", href: "/dashboard/products" }, { label: mode === "create" ? "New Product" : form.name.slice(0, 25) }]}
        actions={
          <>
            {mode === "edit" && <DashBtn variant="secondary" onClick={() => window.open(`/preview/product/${previewSlug}`, "_blank")}>👁 Preview</DashBtn>}
            {mode === "edit" && <DashBtn variant="secondary" icon="📋" onClick={duplicate}>Duplicate</DashBtn>}
            {mode === "edit" && <DashBtn variant="danger" onClick={() => setConfirmArchive(true)}>Delete</DashBtn>}
            <DashBtn variant="secondary" onClick={() => save()}>{saving ? "Saving…" : "Save"}</DashBtn>
            <DashBtn onClick={() => save("published")}>Save &amp; Publish</DashBtn>
          </>
        }
      />

      {/* Live URL bar */}
      {form.status === "published" && previewSlug && (
        <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
          <span className="text-xs font-medium text-green-600">Live URL:</span>
          <a href={`/product/${previewSlug}`} target="_blank" rel="noopener noreferrer" className="flex-1 break-all text-xs text-ink underline dark:text-cream">{productUrl}</a>
          <button onClick={() => navigator.clipboard?.writeText(productUrl).then(() => toast.success("URL copied"))} className="text-[11px] font-semibold text-gold">Copy</button>
        </div>
      )}

      <DashTabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
        {/* Main */}
        <div>
          {tab === "basic" && (
            <DashSection title="Basic Information">
              <DashInput label="Product Name" value={form.name} onChange={(v) => set("name", v)} required />
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <DashInput label="SKU" value={form.sku} onChange={(v) => set("sku", v)} />
                <DashInput label="Slug" value={slug} onChange={(v) => setSlug(slugify(v))} helper={`URL: /product/${previewSlug} · Changing this on a live product adds a redirect from the old link.`} />
              </div>
              <DashSelect label="Status" value={form.status} onChange={(v) => set("status", v)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </DashSelect>
              {form.status === "scheduled" && (
                <DashInput label="Publish at" type="datetime-local" value={form.scheduled_at} onChange={(v) => set("scheduled_at", v)} helper="Auto-publishes at this time" />
              )}
            </DashSection>
          )}

          {tab === "descriptions" && (
            <>
              <DashSection title="Short Description">
                <DashInput textarea rows={3} value={form.short_description} onChange={(v) => set("short_description", v)} placeholder="Brief product summary for cards and listings" />
              </DashSection>
              <DashSection title="Long Description">
                <DashInput textarea rows={8} value={form.long_description} onChange={(v) => set("long_description", v)} placeholder="Detailed description with features, benefits and care instructions" />
              </DashSection>
              <DashSection title="Key Features" subtitle="One per line - shown in the Features tab on the storefront">
                <DashInput textarea rows={5} value={form.features} onChange={(v) => set("features", v)} placeholder="Solid hardwood frame&#10;Premium velvet upholstery&#10;..." />
              </DashSection>
            </>
          )}

          {tab === "media" && (
            mode === "create" ? (
              <DashSection title="Media">
                <p className="py-6 text-center text-sm text-muted">Save the product first, then add images here.</p>
              </DashSection>
            ) : (
              <DashSection title="Images" subtitle="Drag to reorder. First image is the primary photo." noPad>
                <div className="p-5"><ProductImages productId={productId!} images={images} onChange={loadProduct} /></div>
              </DashSection>
            )
          )}

          {tab === "classification" && (
            <DashSection title="Category & Classification">
              <DashSelect label="Sub-Category" required value={form.category_id} onChange={(v) => set("category_id", v)} helper="Choose the most specific collection. The parent category is set automatically.">
                <option value="">- Select Sub-Category -</option>
                {catalog?.parents.map((p) => {
                  const kids = catalog.collections.filter((c) => c.parent_id === p.id);
                  if (!kids.length) return null;
                  return <optgroup key={p.id} label={p.name}>{kids.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>;
                })}
              </DashSelect>

              <label className="mb-1.5 block text-xs font-medium text-ink dark:text-cream">Parent Category <span className="text-[10px] font-normal text-green-600">(auto-selected)</span></label>
              <div className="mb-4 flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5 text-[13px] dark:border-white/10 dark:bg-white/5">
                {selectedCol ? (
                  <>
                    <span className="rounded bg-navy px-2 py-0.5 text-[10px] font-semibold text-white">Parent</span>
                    {selectedCol.parent_name}
                    <span className="ml-auto text-[11px] text-muted">{selectedCol.slug}</span>
                  </>
                ) : <span className="text-muted">Select a sub-category above to auto-assign parent</span>}
              </div>

              {selectedCol && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="mb-1 text-[11px] font-medium text-blue-600">Category Path</div>
                  <div className="text-[13px] text-ink">{selectedCol.parent_name} <span className="mx-1 text-muted">›</span> {selectedCol.name}</div>
                  <div className="mt-1 text-[11px] text-muted">This product appears on <strong>{selectedCol.slug}</strong> and its parent category page.</div>
                </div>
              )}
            </DashSection>
          )}

          {tab === "pricing" && (
            <DashSection title="Pricing">
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <DashInput label="Regular Price (PKR)" type="number" value={form.price} onChange={(v) => set("price", v)} required />
                <DashInput label="Sale Price (PKR)" type="number" value={form.sale_price} onChange={(v) => set("sale_price", v)} />
              </div>
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <DashInput label="Sale Start Date" type="datetime-local" value={form.sale_start} onChange={(v) => set("sale_start", v)} />
                <DashInput label="Sale End Date" type="datetime-local" value={form.sale_end} onChange={(v) => set("sale_end", v)} />
              </div>
              {discount > 0 && (
                <div className="rounded-md bg-green-50 px-3 py-3 text-[13px] text-green-700">
                  Discount: {discount}% off - Customer saves PKR {(Number(form.price) - Number(form.sale_price)).toLocaleString()}
                </div>
              )}
            </DashSection>
          )}

          {tab === "labels" && (
            <DashSection title="Product Labels" subtitle="Control where this product is highlighted on the storefront">
              <DashToggle label="Featured" checked={form.is_featured} onChange={(v) => set("is_featured", v)} helper="Featured rows and the 2-seater spotlight" />
              <DashToggle label="Best Seller" checked={form.is_bestseller} onChange={(v) => set("is_bestseller", v)} />
              <DashToggle label="Trending" checked={form.is_trending} onChange={(v) => set("is_trending", v)} helper="Eligible for the Trending Now section" />
            </DashSection>
          )}

          {tab === "specs" && (
            <DashSection title="Specifications" subtitle="Structured specs (Material, Frame, Dimensions) are powered by the Custom Fields builder">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-[12px] text-blue-600">
                💡 Dimensions and structured specs are currently read from each product&apos;s description. The Custom Fields manager (Catalog → Custom Fields) lets you define dynamic specification fields in a later phase.
              </div>
            </DashSection>
          )}

          {tab === "reviews" && mode === "edit" && (
            <DashSection title="Product Reviews" subtitle="Reviews submitted for this product" noPad>
              <div className="p-5"><ProductReviews productId={productId!} /></div>
            </DashSection>
          )}

          {tab === "seo" && (
            <>
              <DashSection title="Search Engine Optimization">
                <DashInput label="Meta Title" value={form.meta_title} onChange={(v) => set("meta_title", v)} helper={`${form.meta_title.length}/60 characters`} />
                <DashInput label="Meta Description" textarea rows={2} value={form.meta_description} onChange={(v) => set("meta_description", v)} helper={`${form.meta_description.length}/160 characters`} />
                <DashInput label="Focus Keyword" value={form.focus_keyword} onChange={(v) => set("focus_keyword", v)} />
                <DashInput label="Secondary Keywords" value={form.secondary_keywords} onChange={(v) => set("secondary_keywords", v)} placeholder="accent chair, wingback chair Pakistan" helper="Comma-separated" />
                <DashInput label="Canonical URL" value={form.canonical_url} onChange={(v) => set("canonical_url", v)} placeholder={productUrl} />
              </DashSection>

              {/* Google preview */}
              <DashSection title="Search Preview">
                <p className="truncate text-[15px] text-[#1a0dab] dark:text-blue-400">{form.meta_title || form.name || "Product title"}</p>
                <p className="text-xs text-green-700">comfyclub.pk › product › {previewSlug}</p>
                <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{form.meta_description || form.short_description?.replace(/<[^>]+>/g, "") || "Meta description preview…"}</p>
              </DashSection>

              <DashSection title="Social Sharing">
                <DashInput label="OG Title" value={form.og_title} onChange={(v) => set("og_title", v)} placeholder="Same as meta title if empty" />
                <DashInput label="OG Description" textarea rows={2} value={form.og_description} onChange={(v) => set("og_description", v)} placeholder="Same as meta description if empty" />
                <ImageField label="OG Image" value={form.og_image} onChange={(v) => set("og_image", v)} folder="products" helper="Optional social-share image. Defaults to the first product image." />
              </DashSection>

              <DashSection title="Robots & Score">
                <DashToggle label="Index this page" checked={!/noindex/.test(form.robots)} onChange={(v) => set("robots", `${v ? "index" : "noindex"}, ${/nofollow/.test(form.robots) ? "nofollow" : "follow"}`)} helper="Allow search engines to index" />
                <DashToggle label="Follow links" checked={!/nofollow/.test(form.robots)} onChange={(v) => set("robots", `${/noindex/.test(form.robots) ? "noindex" : "index"}, ${v ? "follow" : "nofollow"}`)} helper="Allow search engines to follow links" />
                <div className="mt-3 flex items-center justify-between rounded-lg border border-line p-3 dark:border-white/10">
                  <span className="text-sm font-medium">SEO score</span>
                  <span className={`text-2xl font-bold ${seo.score >= 70 ? "text-green-600" : seo.score >= 40 ? "text-amber-500" : "text-red-500"}`}>{seo.score}</span>
                </div>
                <ul className="mt-2 space-y-1.5 text-xs">
                  {seo.checks.map((c) => (
                    <li key={c.label} className="flex items-start gap-2">
                      <span>{c.passed ? "✅" : "⬜"}</span>
                      <span className={c.passed ? "" : "text-muted"}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </DashSection>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <DashSection title="Status">
            <DashSelect label="Visibility" value={form.status} onChange={(v) => set("status", v)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </DashSelect>
          </DashSection>

          <DashSection title="Category">
            {selectedCol ? (
              <div className="rounded-md bg-panel p-2.5 text-xs dark:bg-white/5">
                <div className="text-muted">Parent</div>
                <div className="mb-2 font-medium text-charcoal dark:text-cream">{selectedCol.parent_name}</div>
                <div className="text-muted">Sub-Category</div>
                <div className="font-medium text-gold">{selectedCol.name}</div>
              </div>
            ) : (
              <p className="text-xs text-muted">Go to the Classification tab to set a category.</p>
            )}
          </DashSection>

          <DashSection title="Product URL">
            <div className="rounded-md bg-panel p-2.5 text-[11px] leading-relaxed dark:bg-white/5">
              <div className="mb-1 text-[10px] text-muted">Live URL</div>
              <a href={`/product/${previewSlug}`} target="_blank" rel="noopener noreferrer" className="break-all text-gold underline">{productUrl}</a>
            </div>
          </DashSection>

          <DashSection title="WhatsApp">
            <DashInput label="WhatsApp Number" value={`+${WA_NUMBER}`} disabled />
            <DashInput label="Pre-filled Message" textarea rows={2} value={form.whatsapp_message_template} onChange={(v) => set("whatsapp_message_template", v)} placeholder={`Hi, I'm interested in ${form.name || "{product}"}.`} helper="Use {product} for the product name" />
          </DashSection>

          <DashSection title="Quick Preview">
            <div className="overflow-hidden rounded-lg border border-line dark:border-white/10">
              {images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[0].url} alt="" referrerPolicy="no-referrer" className="aspect-[4/5] w-full bg-cream object-contain" />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center bg-cream text-xs text-muted">No image</div>
              )}
              <div className="p-2.5">
                <div className="text-[11px] uppercase tracking-wide text-gold">{selectedCol?.name ?? ""}</div>
                <div className="mt-0.5 text-[13px] font-medium text-charcoal dark:text-cream">{form.name || "Product name"}</div>
                <div className="mt-1 text-sm font-semibold text-navy dark:text-cream">PKR {(Number(form.sale_price) || Number(form.price) || 0).toLocaleString()}</div>
              </div>
            </div>
            {mode === "edit" && (
              <DashBtn variant="secondary" full onClick={() => window.open(`/preview/product/${previewSlug}`, "_blank")}>👁 Preview on Storefront</DashBtn>
            )}
          </DashSection>
        </div>
      </div>

      <ConfirmDialog
        open={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        onConfirm={archive}
        title="Move this product to trash?"
        message="It will be removed from the storefront. You can restore it any time from the Trash page."
        confirmLabel="Move to Trash"
        danger
      />
    </div>
  );
}
