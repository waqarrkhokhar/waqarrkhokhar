import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductDetail } from "@/lib/storefront/data";
import { formatPrice } from "@/lib/whatsapp";
import ProductGallery from "@/components/storefront/product/ProductGallery";
import OrderButton from "@/components/storefront/product/OrderButton";
import { ProductRow } from "@/components/storefront/home/Sections";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProductDetail(params.slug);
  if (!p) return { title: "Product not found" };
  const title = p.meta_title || `${p.name} | ComfyClub`;
  const description = p.meta_description || p.short_description || `${p.name} — handcrafted, made to order in Lahore by ComfyClub.`;
  const image = p.og_image || p.images[0]?.url;
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined, type: "website" },
  };
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span aria-label={`${rating} out of 5`}>
      <span className="text-gold">{"★".repeat(full)}</span>
      <span className="text-charcoal/25">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProductDetail(params.slug);
  if (!p) notFound();

  const onSale = !!(p.sale_price && p.price && p.sale_price < p.price);
  const disc = onSale ? Math.round((1 - p.sale_price! / p.price!) * 100) : 0;
  const orderMsg =
    p.whatsapp_message_template?.replace(/\{product\}/gi, p.name) ||
    `Hi, I'm interested in ${p.name}. Can you share more details, fabric options and delivery time?`;

  // JSON-LD product schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images.map((i) => i.url),
    description: p.short_description || p.meta_description || undefined,
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

      {/* Breadcrumb */}
      <nav className="px-5 pt-5 text-[12px] text-charcoal/50 md:px-10" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold">Home</Link>
        {p.category && (
          <>
            <span className="mx-1.5">/</span>
            <Link href={p.category.parent_slug} className="hover:text-gold">{p.category.parent_name}</Link>
            <span className="mx-1.5">/</span>
            <Link href={p.category.slug} className="hover:text-gold">{p.category.name}</Link>
          </>
        )}
        <span className="mx-1.5">/</span>
        <span className="text-charcoal/70">{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 px-5 py-6 md:grid-cols-2 md:gap-12 md:px-10 md:py-8">
        <ProductGallery images={p.images} name={p.name} />

        <div className="flex flex-col">
          {p.category && (
            <Link href={p.category.slug} className="mb-2 text-[11.5px] uppercase tracking-wider text-charcoal/50 hover:text-gold">
              {p.category.name}
            </Link>
          )}
          <h1 className="font-heading text-[28px] font-semibold leading-tight text-charcoal md:text-[34px]">{p.name}</h1>

          {p.review_count > 0 && p.rating != null && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Stars rating={p.rating} />
              <span className="text-charcoal/55">
                {p.rating.toFixed(1)} ({p.review_count} review{p.review_count === 1 ? "" : "s"})
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            {p.price == null ? (
              <span className="text-xl italic text-charcoal/60">Price on Request</span>
            ) : onSale ? (
              <>
                <span className="text-[26px] font-semibold text-gold">{formatPrice(p.sale_price)}</span>
                <span className="text-lg text-charcoal/40 line-through">{formatPrice(p.price)}</span>
                <span className="rounded-sm bg-sale px-2 py-0.5 text-[12px] font-bold text-white">-{disc}%</span>
              </>
            ) : (
              <span className="text-[26px] font-semibold text-navy">{formatPrice(p.price)}</span>
            )}
          </div>

          {p.short_description && (
            <div
              className="rich-text mt-4"
              dangerouslySetInnerHTML={{ __html: p.short_description }}
            />
          )}

          {/* Order CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <OrderButton
              product={{ id: p.id, name: p.name }}
              message={orderMsg}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded bg-whatsapp px-6 py-3.5 text-[14px] font-semibold text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.8-2.5-1.4-3.5-3.1-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.4 1.9.8 2.6.9 3.5.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2" /></svg>
              Order on WhatsApp
            </OrderButton>
          </div>
          <p className="mt-3 text-[12.5px] text-charcoal/50">
            Made to order &middot; Handcrafted in Lahore &middot; Shipped across Pakistan
          </p>

          {/* Long description / features */}
          {p.long_description && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="mb-2 font-heading text-[18px] font-semibold text-charcoal">Details</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: p.long_description }} />
            </div>
          )}
          {p.features && (
            <div className="mt-6">
              <h2 className="mb-2 font-heading text-[18px] font-semibold text-charcoal">Features</h2>
              {/<[a-z][\s\S]*>/i.test(p.features) ? (
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: p.features }} />
              ) : (
                <ul className="list-inside list-disc space-y-1 text-[14.5px] leading-relaxed text-charcoal/75">
                  {p.features.split(/\n|;/).map((f) => f.trim()).filter(Boolean).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {p.reviews.length > 0 && (
        <section className="bg-cream px-5 py-10 md:px-10">
          <h2 className="mb-5 font-heading text-[22px] font-semibold text-charcoal">Customer Reviews</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {p.reviews.map((r) => (
              <div key={r.id} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading text-[15px] font-semibold text-charcoal">{r.name}</span>
                    {r.city && <span className="ml-2 text-[12px] text-charcoal/45">{r.city}</span>}
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-charcoal/75">{r.text}</p>
                {r.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.image_url} alt="" referrerPolicy="no-referrer" className="mt-3 h-24 w-24 rounded object-cover" />
                )}
                {r.admin_reply && (
                  <div className="mt-3 rounded bg-cream px-3 py-2 text-[13px] text-charcoal/70">
                    <span className="font-semibold text-navy">ComfyClub:</span> {r.admin_reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {p.related.length > 0 && (
        <ProductRow title="You May Also Like" products={p.related} viewAll={p.category?.slug} />
      )}
    </div>
  );
}
