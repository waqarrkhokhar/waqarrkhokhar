"use client";

import Link from "next/link";
import type { StoreProduct } from "@/lib/storefront/data";
import { waLink, waProductMessage, formatPrice } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import WhatsAppIcon from "./WhatsAppIcon";

/** Fire a WhatsApp lead (GA4 + /api/leads) then open the chat. */
export function whatsappOrder(product: { id?: string; name: string }, type = "order") {
  trackEvent("whatsapp_click", { product_name: product.name, product_id: product.id, type });
  fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: product.id ?? null,
      product_name: product.name,
      message_type: type,
      source_page: typeof window !== "undefined" ? window.location.pathname : null,
    }),
  }).catch(() => {});
}

/** Seeded 4.3–5.0 display rating (matches the prototype's card badge). */
function seededRating(key: string): number {
  let hash = 0;
  for (const c of key) hash = ((hash << 5) - hash) + c.charCodeAt(0);
  return 4.3 + (Math.abs(hash) % 8) / 10;
}

export default function ProductCard({ product }: { product: StoreProduct }) {
  const onSale = !!(product.sale_price && product.price && product.sale_price < product.price);
  const href = `/product/${product.slug}/`;

  // Rating badge shows on every card (matches the design): the real review
  // average when available, otherwise a seeded value like the prototype.
  const displayRating =
    product.review_count > 0 && product.rating != null
      ? product.rating
      : seededRating(product.slug || product.name);

  return (
    <div className="group flex cursor-pointer flex-col gap-2">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Link href={href} className="block h-full w-full">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-charcoal/30">No image</div>
          )}
        </Link>

        {onSale && (
          <span className="absolute left-2.5 top-2.5 bg-gold px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Sale
          </span>
        )}

        <span className="absolute right-2.5 top-2.5 flex items-center gap-[3px] rounded-xl bg-white/[0.92] px-2 py-[3px] text-[10px] font-semibold text-charcoal backdrop-blur-sm">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          {displayRating.toFixed(1)}
        </span>

        <a
          href={waLink(waProductMessage(product.name, product.slug))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => whatsappOrder(product)}
          aria-label="Order on WhatsApp"
          className="absolute bottom-2.5 right-2.5 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-whatsapp text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100"
        >
          <WhatsAppIcon size={18} />
        </a>
      </div>

      <div className="px-0.5">
        {product.category_name && (
          <p className="mb-1 text-[11.5px] uppercase tracking-wider text-charcoal/50">{product.category_name}</p>
        )}
        <Link href={href}>
          <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug text-charcoal">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1.5">
          {product.price == null ? (
            <span className="text-sm italic text-charcoal/50">Price on Request</span>
          ) : onSale ? (
            <>
              <span className="text-[15px] font-semibold text-gold">{formatPrice(product.sale_price)}</span>
              <span className="text-[13px] text-charcoal/40 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-[15px] font-semibold text-navy">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
