import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductDetail } from "@/lib/storefront/data";
import ProductView from "@/components/storefront/product/ProductView";
import { ProductRow } from "@/components/storefront/home/Sections";

export const dynamic = "force-dynamic";

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
    openGraph: { title, description, images: image ? [image] : undefined, type: "website" },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProductDetail(params.slug);
  if (!p) notFound();

  const onSale = !!(p.sale_price && p.price && p.sale_price < p.price);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images.map((i) => i.url),
    description: p.short_description ? p.short_description.replace(/<[^>]+>/g, "").trim() : undefined,
    sku: p.sku || undefined,
    brand: { "@type": "Brand", name: "ComfyClub" },
    ...(p.price != null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: onSale ? p.sale_price : p.price,
        availability: "https://schema.org/InStock",
      },
    }),
    ...(p.review_count > 0 &&
      p.rating != null && {
        aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.toFixed(1), reviewCount: p.review_count },
      }),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={p} />

      {p.related.length > 0 && (
        <ProductRow title="You May Also Like" products={p.related} viewAll={p.category?.slug} />
      )}
    </div>
  );
}
