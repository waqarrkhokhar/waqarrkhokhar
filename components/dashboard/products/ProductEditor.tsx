"use client";

import { useCallback, useEffect, useState } from "react";
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
import type { Catalog } from "./types";
import ProductImages, { type ProductImage } from "./ProductImages";
import ProductReviews from "./ProductReviews";

type Mode = "create" | "edit";
type Tab = "basic" | "media" | "classification" | "seo" | "reviews";

type Form = {
  name: string;
  sku: string;
  price: string;
  sale_price: string;
  short_description: string;
  long_description: string;
  features: string;
  category_id: string;
  status: string;
  scheduled_at: string;
  is_featured: boolean;
  is_bestseller: boolean;
  is_trending: boolean;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  secondary_keywords: string;
  canonical_url: string;
  og_image: string;
  robots: string;
  whatsapp_message_template: string;
};

const EMPTY: Form = {
  name: "", sku: "", price: "", sale_price: "", short_description: "",
  long_description: "", features: "", category_id: "", status: "draft",
  scheduled_at: "", is_featured: false, is_bestseller: false, is_trending: false,
  meta_title: "", meta_description: "", focus_keyword: "", secondary_keywords: "",
  canonical_url: "", og_image: "", robots: "index, follow",
  whatsapp_message_template: "",
};

export default function ProductEditor({
  mode,
  productId,
}: {
  mode: Mode;
  productId?: string;
}) {
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

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const loadProduct = useCallback(async () => {
    if (mode !== "edit" || !productId) return;
    const res = await apiGet<{ data: Record<string, unknown> & { images: ProductImage[] } }>(
      `/api/products/${productId}`,
    );
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    const p = res.data.data;
    setSlug(String(p.slug ?? ""));
    setImages(p.images ?? []);
    setForm({
      name: String(p.name ?? ""),
      sku: String(p.sku ?? ""),
      price: p.price != null ? String(p.price) : "",
      sale_price: p.sale_price != null ? String(p.sale_price) : "",
      short_description: String(p.short_description ?? ""),
      long_description: String(p.long_description ?? ""),
      features: String(p.features ?? ""),
      category_id: String(p.category_id ?? ""),
      status: String(p.status ?? "draft"),
      scheduled_at: p.scheduled_at ? String(p.scheduled_at).slice(0, 16) : "",
      is_featured: !!p.is_featured,
      is_bestseller: !!p.is_bestseller,
      is_trending: !!p.is_trending,
      meta_title: String(p.meta_title ?? ""),
      meta_description: String(p.meta_description ?? ""),
      focus_keyword: String(p.focus_keyword ?? ""),
      secondary_keywords: Array.isArray(p.secondary_keywords)
        ? (p.secondary_keywords as string[]).join(", ")
        : "",
      canonical_url: String(p.canonical_url ?? ""),
      og_image: String(p.og_image ?? ""),
      robots: String(p.robots ?? "index, follow"),
      whatsapp_message_template: String(p.whatsapp_message_template ?? ""),
    });
  }, [mode, productId, toast]);

  useEffect(() => {
    apiGet<{ data: Catalog }>("/api/catalog").then((r) => r.ok && setCatalog(r.data.data));
    loadProduct();
  }, [loadProduct]);

  function buildPayload() {
    const num = (s: string) => (s.trim() ? parseInt(s, 10) : null);
    const str = (s: string) => (s.trim() ? s.trim() : null);
    return {
      name: form.name.trim(),
      sku: str(form.sku),
      price: num(form.price),
      sale_price: num(form.sale_price),
      short_description: str(form.short_description),
      long_description: str(form.long_description),
      features: str(form.features),
      category_id: form.category_id || null,
      status: form.status,
      scheduled_at:
        form.status === "scheduled" && form.scheduled_at
          ? new Date(form.scheduled_at).toISOString()
          : null,
      is_featured: form.is_featured,
      is_bestseller: form.is_bestseller,
      is_trending: form.is_trending,
      meta_title: str(form.meta_title),
      meta_description: str(form.meta_description),
      focus_keyword: str(form.focus_keyword),
      secondary_keywords: form.secondary_keywords.trim()
        ? form.secondary_keywords.split(",").map((s) => s.trim()).filter(Boolean)
        : null,
      canonical_url: str(form.canonical_url),
      og_image: str(form.og_image),
      robots: str(form.robots),
      whatsapp_message_template: str(form.whatsapp_message_template),
    };
  }

  async function save(overrideStatus?: string) {
    if (form.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      setTab("basic");
      return;
    }
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
    toast.success("Product archived");
    router.push("/dashboard/products");
  }

  async function duplicate() {
    const res = await apiSend<{ data: { id: string } }>(
      `/api/products/${productId}/duplicate`,
      "POST",
    );
    if (!res.ok) return toast.error(res.error);
    toast.success("Product duplicated");
    router.push(`/dashboard/products/${res.data.data.id}`);
  }

  const seo = computeSeoScore({
    metaTitle: form.meta_title,
    metaDescription: form.meta_description,
    focusKeyword: form.focus_keyword,
    contentWordCount: countWords(form.short_description, form.long_description, form.features),
    minWords: 100,
    schemaEnabled: true,
    ogImage: form.og_image || (images[0]?.url ?? null),
    canonical: form.canonical_url,
    internalLinks: form.category_id ? 1 : 0,
  });

  const previewSlug = slug || slugify(form.name || "new-product");

  if (loading) {
    return <p className="text-sm text-charcoal/60 dark:text-cream/60">Loading…</p>;
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "basic", label: "Basic" },
    { id: "media", label: "Media" },
    { id: "classification", label: "Classification" },
    { id: "seo", label: "SEO" },
    ...(mode === "edit" ? [{ id: "reviews" as Tab, label: "Reviews" }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/products"
            className="text-sm text-charcoal/60 hover:text-gold dark:text-cream/60"
          >
            ← Back to products
          </Link>
          <h2 className="mt-1 font-heading text-2xl font-semibold">
            {mode === "create" ? "New Product" : form.name || "Edit Product"}
          </h2>
          {mode === "edit" && (
            <p className="text-xs text-charcoal/50 dark:text-cream/50">
              /product/{previewSlug}/ · <Badge tone={statusTone(form.status)}>{form.status}</Badge>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "edit" && (
            <>
              <Button variant="secondary" size="sm" onClick={duplicate}>
                Duplicate
              </Button>
              <Button variant="danger" size="sm" onClick={() => setConfirmArchive(true)}>
                Archive
              </Button>
            </>
          )}
          <Button variant="secondary" size="sm" loading={saving} onClick={() => save()}>
            Save
          </Button>
          <Button size="sm" loading={saving} onClick={() => save("published")}>
            Save &amp; Publish
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-black/5 dark:border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? "border-b-2 border-gold text-navy dark:text-gold"
                : "text-charcoal/60 dark:text-cream/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* BASIC */}
      {tab === "basic" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Product name" hint={`URL: /product/${previewSlug}/`}>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
          </div>
          <Field label="SKU">
            <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Regular price (PKR)">
            <Input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </Field>
          <Field label="Sale price (PKR)">
            <Input
              type="number"
              value={form.sale_price}
              onChange={(e) => set("sale_price", e.target.value)}
            />
          </Field>
          {form.status === "scheduled" && (
            <Field label="Publish at" hint="Auto-publishes at this time">
              <Input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => set("scheduled_at", e.target.value)}
              />
            </Field>
          )}
          <div className="sm:col-span-2">
            <Field label="Short description" hint="Shown under the price">
              <Textarea
                value={form.short_description}
                onChange={(e) => set("short_description", e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Long description">
              <Textarea
                className="min-h-40"
                value={form.long_description}
                onChange={(e) => set("long_description", e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Key features" hint="One per line">
              <Textarea value={form.features} onChange={(e) => set("features", e.target.value)} />
            </Field>
          </div>
        </div>
      )}

      {/* MEDIA */}
      {tab === "media" &&
        (mode === "create" ? (
          <p className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-charcoal/60 dark:border-white/10 dark:text-cream/60">
            Save the product first, then add images here.
          </p>
        ) : (
          <ProductImages productId={productId!} images={images} onChange={loadProduct} />
        ))}

      {/* CLASSIFICATION */}
      {tab === "classification" && (
        <div className="grid gap-4 sm:max-w-md">
          <Field label="Collection" hint="Determines the product's category page">
            <Select
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
            >
              <option value="">— Uncategorized —</option>
              {catalog?.parents.map((p) => (
                <optgroup key={p.id} label={p.name}>
                  {catalog.collections
                    .filter((c) => c.parent_id === p.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </Select>
          </Field>
          <div className="space-y-2">
            {([
              ["is_featured", "Featured"],
              ["is_bestseller", "Bestseller"],
              ["is_trending", "Trending"],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => set(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* SEO */}
      {tab === "seo" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <Field label="Meta title" hint={`${form.meta_title.length}/60`}>
              <Input
                value={form.meta_title}
                onChange={(e) => set("meta_title", e.target.value)}
              />
            </Field>
            <Field label="Meta description" hint={`${form.meta_description.length}/160`}>
              <Textarea
                value={form.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Focus keyword">
                <Input
                  value={form.focus_keyword}
                  onChange={(e) => set("focus_keyword", e.target.value)}
                />
              </Field>
              <Field label="Secondary keywords" hint="Comma-separated">
                <Input
                  value={form.secondary_keywords}
                  onChange={(e) => set("secondary_keywords", e.target.value)}
                />
              </Field>
              <Field label="Canonical URL">
                <Input
                  value={form.canonical_url}
                  onChange={(e) => set("canonical_url", e.target.value)}
                />
              </Field>
              <Field label="Robots">
                <Input value={form.robots} onChange={(e) => set("robots", e.target.value)} />
              </Field>
              <Field label="OG image URL">
                <Input value={form.og_image} onChange={(e) => set("og_image", e.target.value)} />
              </Field>
            </div>

            {/* Google preview */}
            <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
              <p className="mb-2 text-xs uppercase tracking-wide text-charcoal/40 dark:text-cream/40">
                Google preview
              </p>
              <p className="truncate text-[#1a0dab] dark:text-blue-400">
                {form.meta_title || form.name || "Product title"}
              </p>
              <p className="text-xs text-green-700 dark:text-green-500">
                comfyclub.pk › product › {previewSlug}
              </p>
              <p className="line-clamp-2 text-sm text-charcoal/70 dark:text-cream/70">
                {form.meta_description || form.short_description || "Meta description preview…"}
              </p>
            </div>
          </div>

          {/* SEO score */}
          <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">SEO score</span>
              <span
                className={`text-2xl font-bold ${
                  seo.score >= 70 ? "text-green-600" : seo.score >= 40 ? "text-amber-500" : "text-red-500"
                }`}
              >
                {seo.score}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs">
              {seo.checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2">
                  <span>{c.passed ? "✅" : "⬜"}</span>
                  <span className={c.passed ? "" : "text-charcoal/50 dark:text-cream/50"}>
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "reviews" && mode === "edit" && <ProductReviews productId={productId!} />}

      <ConfirmDialog
        open={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        onConfirm={archive}
        title="Archive this product?"
        message="It will be hidden from the storefront but kept in the database. You can republish it later."
        confirmLabel="Archive"
        danger
      />
    </div>
  );
}
