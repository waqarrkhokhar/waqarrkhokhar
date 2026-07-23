import { notFound } from "next/navigation";
import { getProductDetail } from "@/lib/storefront/data";
import { cleanHref } from "@/lib/seo/href";
import ProductView from "@/components/storefront/product/ProductView";
import { ProductRow } from "@/components/storefront/home/Sections";
import PreviewBanner from "@/components/storefront/PreviewBanner";

/**
 * Shared product page body, used by BOTH the public cached route and the admin
 * preview route. Keeping `draftMode()`/dynamic APIs OUT of this component is
 * what lets the public route stay statically cached (ISR).
 */
export default async function ProductPageContent({ slug, preview = false }: { slug: string; preview?: boolean }) {
  const p = await getProductDetail(slug, preview);
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
      {preview && <PreviewBanner editHref={`/dashboard/products`} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={p} />

      {p.related.length > 0 && (
        <ProductRow title="You May Also Like" products={p.related} viewAll={p.category?.slug ? cleanHref(p.category.slug) : undefined} />
      )}
    </div>
  );
}
