"use client";

import Link from "next/link";
import type { StoreProduct } from "@/lib/storefront/data";
import { waLink, formatPrice } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

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

export default function ProductCard({ product }: { product: StoreProduct }) {
  const onSale = !!(product.sale_price && product.price && product.sale_price < product.price);
  const href = `/product/${product.slug}/`;

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

        {product.review_count > 0 && product.rating != null && (
          <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-charcoal backdrop-blur">
            <span className="text-gold">★</span>
            {product.rating.toFixed(1)}
          </span>
        )}

        <a
          href={waLink(`Hi, I'm interested in ${product.name}. Can you share more details?`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => whatsappOrder(product)}
          aria-label="Order on WhatsApp"
          className="absolute bottom-2.5 right-2.5 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-whatsapp text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.8-2.5-1.4-3.5-3.1-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.4 1.9.8 2.6.9 3.5.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2"/></svg>
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
