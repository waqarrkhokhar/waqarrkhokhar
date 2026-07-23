import type { Metadata } from "next";
import { getProductDetail } from "@/lib/storefront/data";
import { createPublicClient } from "@/lib/supabase/public";
import { robotsMeta } from "@/lib/seo/robots";
import ProductPageContent from "@/components/storefront/product/ProductPageContent";

// Cache the published page (ISR). On-demand revalidation refreshes it instantly
// when a product is edited; unknown/new slugs render on demand then cache.
export const revalidate = 300;

/** Pre-render every published product at build so they're served instantly. */
export async function generateStaticParams() {
  try {
    const db = createPublicClient();
    const { data } = await db.from("products").select("slug").eq("status", "published").is("deleted_at", null);
    return (data ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProductDetail(params.slug);
  if (!p) return { title: "Product not found" };
  const title = p.meta_title || `${p.name} | ComfyClub`;
  const description =
    p.meta_description ||
    (p.short_description ? p.short_description.replace(/<[^>]+>/g, "").slice(0, 160) : `${p.name} — handcrafted, made to order in Lahore by ComfyClub.`);
  const image = p.og_image || p.images[0]?.url;
  return {
    title,
    description,
    robots: robotsMeta(p.robots),
    // Explicit self-referencing canonical (no trailing slash — matches the
    // served URL) so Google never treats /product/x and /product/x/ as
    // duplicates and drops one from the index.
    alternates: { canonical: `/product/${params.slug}` },
    openGraph: { title, description, images: image ? [image] : undefined, type: "website" },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductPageContent slug={params.slug} preview={false} />;
}
