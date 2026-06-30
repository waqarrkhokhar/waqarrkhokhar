"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashPageHeader, DashCard, DashBtn, DashBadge, DashSection, DashInput } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { apiGet, apiSend } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";

type Row = { key: string; page: string; type: string; url: string; editHref?: string };
type Tab = "all" | "categories" | "collections" | "products" | "blog" | "pages";

const STATIC_PAGES: Row[] = [
  { key: "home", page: "Homepage", type: "pages", url: "/" },
  { key: "about", page: "About Us", type: "pages", url: "/about-us/" },
  { key: "contact", page: "Contact Us", type: "pages", url: "/contact-us/" },
  { key: "shipping", page: "Shipping & Delivery", type: "pages", url: "/shipping-and-delivery-policy/" },
  { key: "returns", page: "Returns & Refunds", type: "pages", url: "/returns-and-refunds-policy/" },
  { key: "privacy", page: "Privacy Policy", type: "pages", url: "/privacy-policy/" },
  { key: "terms", page: "Terms & Conditions", type: "pages", url: "/terms-and-conditions/" },
];

const typeLabel: Record<string, string> = { categories: "Category", collections: "Collection", products: "Product", blog: "Blog", pages: "Page" };

export default function SeoDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [generating, setGenerating] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState({ categories: 0, collections: 0, products: 0, blog: 0, pages: STATIC_PAGES.length });

  // Homepage SEO (no entity to edit, so it lives here).
  const [home, setHome] = useState({ meta_title: "", meta_description: "" });
  const [homeSaving, setHomeSaving] = useState(false);
  useEffect(() => {
    apiGet<{ data: { meta_title: string; meta_description: string } }>("/api/seo/homepage").then((r) => r.ok && setHome(r.data.data));
  }, []);
  async function saveHome() {
    setHomeSaving(true);
    const res = await apiSend("/api/seo/homepage", "PATCH", home);
    setHomeSaving(false);
    if (!res.ok) return toast.error(res.error || "Could not save");
    toast.success("Homepage SEO saved");
  }

  useEffect(() => {
    (async () => {
      const [prodRes, colRes, parRes, blogRes] = await Promise.all([
        apiGet<{ data: { id: string; name: string; slug: string }[] }>("/api/products?limit=200"),
        apiGet<{ data: { id: string; name: string; slug: string }[] }>("/api/collections"),
        apiGet<{ data: { id: string; name: string; slug: string }[] }>("/api/parents"),
        apiGet<{ data: { id: string; title: string; slug: string }[] }>("/api/blog?limit=100"),
      ]);
      const products = prodRes.ok ? prodRes.data.data.map((p) => ({ key: `p${p.id}`, page: p.name, type: "products", url: `/product/${p.slug}/`, editHref: `/dashboard/products/${p.id}` })) : [];
      const collections = colRes.ok ? colRes.data.data.map((c) => ({ key: `c${c.id}`, page: c.name, type: "collections", url: c.slug, editHref: `/dashboard/collections/${c.id}` })) : [];
      const categories = parRes.ok ? parRes.data.data.map((c) => ({ key: `cat${c.id}`, page: c.name, type: "categories", url: c.slug, editHref: `/dashboard/categories` })) : [];
      const blog = blogRes.ok ? blogRes.data.data.map((b) => ({ key: `b${b.id}`, page: b.title, type: "blog", url: `/blog/${b.slug}/`, editHref: `/dashboard/blog/${b.id}` })) : [];
      setRows([...categories, ...collections, ...products, ...blog, ...STATIC_PAGES]);
      setCounts({ categories: categories.length, collections: collections.length, products: products.length, blog: blog.length, pages: STATIC_PAGES.length });
    })();
  }, []);

  const total = counts.categories + counts.collections + counts.products + counts.blog + counts.pages;
  const filtered = tab === "all" ? rows : rows.filter((r) => r.type === tab);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "all", label: "All Pages", count: total },
    { id: "categories", label: "Categories", count: counts.categories },
    { id: "collections", label: "Collections", count: counts.collections },
    { id: "products", label: "Products", count: counts.products },
    { id: "blog", label: "Blog Posts", count: counts.blog },
    { id: "pages", label: "Static Pages", count: counts.pages },
  ];

  async function generateSeo() {
    setGenerating(true);
    const res = await apiSend<{ data: { updated: number } }>("/api/products/seo/generate", "POST", { overwrite: false });
    setGenerating(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`SEO meta filled for ${res.data.data.updated} product(s)`);
  }

  const columns: Column<Row>[] = [
    { key: "page", header: "Page", render: (r) => <div><div className="font-medium text-charcoal dark:text-cream">{r.page.length > 44 ? r.page.slice(0, 44) + "…" : r.page}</div><div className="text-[11px] text-muted">{r.url}</div></div> },
    { key: "type", header: "Type", render: (r) => <DashBadge status="scheduled" label={typeLabel[r.type] ?? r.type} /> },
    { key: "actions", header: "", className: "w-40", render: (r) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {r.editHref && <button onClick={() => router.push(r.editHref!)} className="rounded border border-line px-2 py-1 text-xs hover:border-gold dark:border-white/10">Edit SEO</button>}
        <a href={r.url} target="_blank" rel="noopener noreferrer" className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10" title="View">🔗</a>
      </div>
    ) },
  ];

  return (
    <div>
      <DashPageHeader title="SEO Dashboard" subtitle="Central index of every page's SEO - edit each item in its own SEO tab"
        breadcrumbs={[{ label: "SEO" }, { label: "Dashboard" }]}
        actions={<DashBtn icon="✨" onClick={generateSeo} disabled={generating}>{generating ? "Filling…" : "Auto-fill missing SEO"}</DashBtn>} />

      <div className="mb-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        <DashCard label="Total Pages" value={total || "…"} icon="📄" tint="bg-gold/15" />
        <DashCard label="Products" value={counts.products || "…"} icon="📦" tint="bg-blue-100" href="/dashboard/seo/metadata" />
        <DashCard label="Collections" value={counts.collections || "…"} icon="🗂️" tint="bg-blue-100" />
        <DashCard label="Blog Posts" value={counts.blog || "…"} icon="✏️" tint="bg-green-100" />
        <DashCard label="Static Pages" value={counts.pages} icon="📃" tint="bg-amber-100" />
        <DashCard label="Schema Types" value="8" icon="🔖" tint="bg-blue-100" href="/dashboard/seo/schema" />
      </div>

      {/* Quick tools */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Metadata", "/dashboard/seo/metadata", "🏷️"],
          ["Schema", "/dashboard/seo/schema", "🔖"],
          ["Redirects", "/dashboard/seo/redirects", "↪️"],
          ["Sitemaps", "/dashboard/seo/sitemap", "🗺️"],
          ["Robots.txt", "/dashboard/seo/robots", "🤖"],
          ["Internal Links", "/dashboard/seo/internal-links", "🔗"],
        ].map(([label, href, icon]) => (
          <a key={href} href={href} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-[13px] font-medium text-ink transition hover:border-gold dark:border-white/10 dark:bg-white/5 dark:text-cream">
            <span>{icon}</span> {label}
          </a>
        ))}
      </div>

      {/* Homepage SEO — the homepage has no entity editor, so it's managed here. */}
      <DashSection title="🏠 Homepage SEO" subtitle="The meta title & description for comfyclub.pk (the home page itself)"
        actions={<DashBtn onClick={saveHome} disabled={homeSaving}>{homeSaving ? "Saving…" : "Save Homepage SEO"}</DashBtn>}>
        <DashInput label="Meta Title" value={home.meta_title} onChange={(v) => setHome((s) => ({ ...s, meta_title: v }))}
          placeholder="ComfyClub — Handcrafted Furniture in Lahore" helper={`${home.meta_title.length}/60 — shown as the blue link in Google. Leave blank to use the default.`} />
        <DashInput label="Meta Description" textarea rows={3} value={home.meta_description} onChange={(v) => setHome((s) => ({ ...s, meta_description: v }))}
          placeholder="ComfyClub crafts made-to-order sofas, sofa chairs and furniture at our Lahore workshop…" helper={`${home.meta_description.length}/160 — the grey text under the link in Google. Leave blank to use the default.`} />
      </DashSection>

      <div className="mb-5 flex gap-0 overflow-x-auto border-b border-line dark:border-white/10">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-[13px] transition ${tab === t.id ? "border-gold font-semibold text-gold" : "border-transparent text-muted hover:text-ink"}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <DashTable columns={columns} rows={filtered} getId={(r) => r.key}
        onRowClick={(r) => r.editHref && router.push(r.editHref)}
        emptyTitle="No pages" />
    </div>
  );
}
