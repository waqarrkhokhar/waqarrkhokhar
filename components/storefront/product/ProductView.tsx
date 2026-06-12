"use client";

import { useState } from "react";
import type { ProductDetail } from "@/lib/storefront/data";
import { waLink, formatPrice } from "@/lib/whatsapp";
import { whatsappOrder } from "@/components/storefront/ProductCard";

/* ── Stars ───────────────────────────────────────────────────────────────── */
function Stars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-[13px] tracking-tight">
        <span className="text-gold">{"★".repeat(full)}</span>
        <span className="text-[#e0e0e0]">{"★".repeat(5 - full)}</span>
      </span>
      {count != null && <span className="text-[11px] text-[#999]">({count})</span>}
    </span>
  );
}

const WaIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.185 1.607 6.013L.057 23.64a.75.75 0 00.916.917l5.627-1.55A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.822-.537-5.445-1.543l-.39-.232-3.337.92.92-3.337-.232-.39A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

/* ── Write a Review form ─────────────────────────────────────────────────── */
function ReviewForm({ product }: { product: { id: string; name: string } }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = name.trim().length >= 2 && rating > 0 && text.trim().length >= 5;

  async function uploadPhoto(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/reviews/upload", { method: "POST", body: fd });
      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(j?.error?.message || "Could not upload photo.");
      setImage(j.data?.url ?? j.url ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload photo.");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          name: name.trim(),
          city: city.trim() || null,
          rating,
          text: text.trim(),
          image_url: image,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error?.message || "Could not submit review.");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-3 rounded-lg bg-white p-6 text-center">
        <div className="mb-2.5 text-4xl text-whatsapp">✓</div>
        <div className="mb-1 font-heading text-base font-semibold text-charcoal">Thank you for your review!</div>
        <div className="text-xs text-[#999]">Your review will appear after approval.</div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white px-5 py-3.5 text-[13px] font-semibold text-navy transition hover:border-navy/40"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
        Write a Review
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-navy/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-charcoal">Write a Review</h3>
        <button onClick={() => setOpen(false)} aria-label="Close" className="text-lg text-[#999]">×</button>
      </div>

      <div className="mb-3 rounded bg-cream px-3 py-2 text-xs text-[#999]">
        Reviewing: <strong className="text-charcoal">{product.name}</strong>
      </div>

      {/* Rating */}
      <div className="mb-3.5">
        <label className="mb-1.5 block text-xs font-medium text-charcoal">Your Rating <span className="text-sale">*</span></label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)} className="p-0.5" aria-label={`${i} star`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={i <= (hover || rating) ? "#C9A84C" : "#e0e0e0"} className="transition"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </button>
          ))}
          {rating > 0 && <span className="ml-2 self-center text-xs text-[#999]">{rating}/5</span>}
        </div>
      </div>

      {/* Name + City */}
      <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal">Your Name <span className="text-sale">*</span></label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed K." className="w-full rounded-md border border-[#e0e0e0] px-3.5 py-2.5 text-[13px] outline-none focus:border-navy" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal">City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lahore" className="w-full rounded-md border border-[#e0e0e0] px-3.5 py-2.5 text-[13px] outline-none focus:border-navy" />
        </div>
      </div>

      {/* Review text */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-charcoal">Your Review <span className="text-sale">*</span></label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Share your experience with this product..." className="w-full resize-y rounded-md border border-[#e0e0e0] px-3.5 py-2.5 text-[13px] outline-none focus:border-navy" />
      </div>

      {/* Photo (optional) */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-charcoal">Photo (optional)</label>
        {image ? (
          <div className="flex items-center gap-3 rounded-md bg-cream p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" referrerPolicy="no-referrer" className="h-12 w-12 rounded object-cover" />
            <span className="flex-1 text-xs text-charcoal">Photo added</span>
            <button onClick={() => setImage(null)} className="text-[11px] text-sale">Remove</button>
          </div>
        ) : (
          <label className={`flex w-full cursor-pointer flex-col items-center rounded-md border-2 border-dashed border-[#e0e0e0] px-3.5 py-3.5 text-center text-xs text-[#999] ${uploading ? "opacity-60" : ""}`}>
            <span className="mb-1 text-lg opacity-40">📷</span>
            {uploading ? "Uploading…" : "Tap to add a photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadPhoto(f);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>

      {error && <div className="mb-3 rounded bg-sale/10 px-3 py-2 text-xs text-sale">{error}</div>}

      <button onClick={submit} disabled={!valid || busy || uploading} className={`w-full rounded-md px-5 py-3.5 text-sm font-semibold transition ${valid && !busy && !uploading ? "bg-navy text-white" : "cursor-default bg-[#ddd] text-[#999]"}`}>
        {busy ? "Submitting…" : "Submit Review"}
      </button>
      <div className="mt-2 text-center text-[11px] text-[#bbb]">Your review will be published after approval</div>
    </div>
  );
}

/* ── Main view ───────────────────────────────────────────────────────────── */
export default function ProductView({ product: p }: { product: ProductDetail }) {
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<"description" | "features" | "shipping">("description");
  const [showAll, setShowAll] = useState(false);

  const onSale = !!(p.sale_price && p.price && p.sale_price < p.price);
  const images = p.images.length ? p.images : [{ url: "", alt: null }];
  const featureList = p.features;
  const dims = p.dimensions
    ? [
        { label: "Width", value: p.dimensions.width },
        { label: "Depth", value: p.dimensions.depth },
        { label: "Height", value: p.dimensions.height },
        { label: "Seat Height", value: p.dimensions.seatHeight },
      ].filter((d) => d.value)
    : [];

  const orderMsg = `Hi, I'm interested in ${p.name}${p.sku ? ` (${p.sku})` : ""}. Can you share more details?`;
  const quoteMsg = `Hi, I'd like a quote for ${p.name}.`;
  const consultMsg = `Hi, I'd like a consultation about ${p.name}.`;

  const visibleReviews = showAll ? p.reviews : p.reviews.slice(0, 3);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="cc-container px-5 pb-2 pt-3 text-[11px] text-[#999] md:px-10" aria-label="Breadcrumb">
        <a href="/" className="hover:text-gold">Home</a>
        {p.category && (
          <>
            <span className="mx-1.5">›</span>
            <a href={p.category.slug} className="hover:text-gold">{p.category.name}</a>
          </>
        )}
        <span className="mx-1.5">›</span>
        <span className="text-[#666]">{p.name.length > 30 ? p.name.slice(0, 30) + "…" : p.name}</span>
      </nav>

      {/* Layout: stacked on mobile, gallery+info side-by-side on desktop */}
      <div className="block md:mx-auto md:flex md:max-w-[1100px] md:gap-8 md:px-10 lg:gap-12">
        {/* GALLERY */}
        <div className="md:flex-1 md:self-start md:sticky md:top-20">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
            {images[activeImg]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[activeImg].url} alt={images[activeImg].alt ?? p.name} referrerPolicy="no-referrer" className="h-full w-full object-contain transition-opacity duration-300" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-charcoal/30">No image</div>
            )}
            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.slice(0, 5).map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} aria-label={`Image ${i + 1}`} className="h-2 w-2 rounded-full transition" style={{ background: i === activeImg ? "#0F1D35" : "rgba(255,255,255,0.7)" }} />
                ))}
              </div>
            )}
            {onSale && (
              <div className="absolute left-3.5 top-3.5 bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">Sale</div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 py-2.5 md:px-0">
              {images.slice(0, 5).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-cream ${i === activeImg ? "border-2 border-navy" : "border border-[#e5e5e5]"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="md:flex-1 md:pt-5">
          {p.category && (
            <div className="px-5 pt-4 text-[10px] uppercase tracking-[2px] text-gold md:px-0">{p.category.name}</div>
          )}
          <h1 className="m-0 px-5 pt-1.5 font-heading text-2xl font-semibold leading-snug text-charcoal md:px-0">{p.name}</h1>

          {p.review_count > 0 && p.rating != null && (
            <div className="px-5 pt-2.5 md:px-0"><Stars rating={p.rating} count={p.review_count} /></div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2.5 px-5 pt-3.5 md:px-0">
            <span className="font-heading text-[26px] font-bold text-navy">{formatPrice(onSale ? p.sale_price : p.price)}</span>
            {onSale && (
              <>
                <span className="text-[15px] text-[#aaa] line-through">{formatPrice(p.price)}</span>
                <span className="rounded bg-[#e8f5e9] px-2 py-0.5 text-[11px] font-semibold text-[#2e7d32]">
                  Save {Math.round((1 - p.sale_price! / p.price!) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          {p.short_description && (
            <div className="rich-text px-5 pt-3.5 text-[13px] md:px-0" dangerouslySetInnerHTML={{ __html: p.short_description }} />
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 px-5 py-5 md:px-0">
            <a
              href={waLink(orderMsg)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => whatsappOrder({ id: p.id, name: p.name }, "order")}
              className="flex items-center justify-center gap-2.5 rounded bg-whatsapp px-6 py-4 text-[15px] font-bold text-white shadow-[0_4px_12px_rgba(37,211,102,0.3)]"
            >
              <WaIcon />
              Order via WhatsApp
            </a>
            <div className="flex gap-2.5">
              <a href={waLink(quoteMsg)} target="_blank" rel="noopener noreferrer" onClick={() => whatsappOrder({ id: p.id, name: p.name }, "quote")} className="flex flex-1 items-center justify-center rounded border border-navy px-4 py-3 text-xs font-semibold text-navy">Request Quote</a>
              <a href={waLink(consultMsg)} target="_blank" rel="noopener noreferrer" onClick={() => whatsappOrder({ id: p.id, name: p.name }, "consultation")} className="flex flex-1 items-center justify-center rounded border border-navy px-4 py-3 text-xs font-semibold text-navy">Consultation</a>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-y border-black/[0.08]">
            {([
              { id: "description", label: "Description" },
              { id: "features", label: "Features" },
              { id: "shipping", label: "Shipping & Delivery" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 px-2 py-3 text-center text-xs transition ${tab === t.id ? "border-b-2 border-navy font-semibold text-navy" : "border-b-2 border-transparent font-normal text-[#999]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="px-5 py-5 md:px-0">
            {tab === "description" && (
              <div>
                {p.description_html ? (
                  <div className="rich-text" dangerouslySetInnerHTML={{ __html: p.description_html }} />
                ) : p.short_description ? (
                  <div className="rich-text" dangerouslySetInnerHTML={{ __html: p.short_description }} />
                ) : (
                  <p className="text-[13px] text-[#999]">Contact us on WhatsApp for full details about this piece.</p>
                )}

                {/* Dimensions grid */}
                {dims.length > 0 && (
                  <div className="mt-5">
                    <h3 className="mb-2.5 font-heading text-[15px] font-semibold text-charcoal">Dimensions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {dims.map((d) => (
                        <div key={d.label} className="rounded bg-cream px-3 py-2.5">
                          <div className="text-[10px] uppercase tracking-wide text-[#999]">{d.label}</div>
                          <div className="mt-0.5 text-sm font-semibold text-charcoal">{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "features" && (
              <div>
                <h2 className="mb-4 font-heading text-lg font-semibold text-charcoal">Key Features</h2>
                {featureList.length > 0 ? (
                  <ul className="flex flex-col gap-2.5">
                    {featureList.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#666]">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-[#999]">Features information coming soon. Contact us on WhatsApp for details.</p>
                )}
              </div>
            )}

            {tab === "shipping" && (
              <div>
                <h2 className="mb-4 font-heading text-lg font-semibold text-charcoal">Shipping &amp; Delivery Policy</h2>
                <div className="flex flex-col gap-3.5">
                  {[
                    { label: "Delivery", text: "We ship across Pakistan. Delivery charges may apply based on your location." },
                    { label: "Made to Order", text: "Each piece is handcrafted at our Lahore workshop after your order is confirmed." },
                    { label: "Delivery Time", text: "Estimated delivery: 20–25 working days from order confirmation." },
                    { label: "Packaging", text: "Carefully packaged for safe transit with protective wrapping and corner guards." },
                    { label: "Assembly", text: "Most items arrive fully assembled. Assembly assistance available on request." },
                    { label: "Payment", text: "60% advance payment required at the time of order. Remaining 40% on delivery." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cream text-[10px] font-semibold text-gold">{i + 1}</div>
                      <div>
                        <div className="text-[13px] font-semibold text-charcoal">{item.label}</div>
                        <div className="mt-0.5 text-xs leading-relaxed text-[#888]">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-cream px-5 py-7 md:px-6">
            <h2 className="mb-4 font-heading text-lg font-semibold text-charcoal">
              Customer Reviews{p.review_count > 0 ? ` (${p.review_count})` : ""}
            </h2>

            {visibleReviews.length === 0 && (
              <p className="mb-2 text-[13px] text-[#888]">No reviews yet. Be the first to review this piece.</p>
            )}

            {visibleReviews.map((r) => (
              <div key={r.id} className="mb-2.5 rounded-lg bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-charcoal">
                    {r.name}
                    {r.is_featured && (
                      <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gold">Featured</span>
                    )}
                  </span>
                  <Stars rating={r.rating} />
                </div>
                {r.city && <div className="mt-0.5 text-[10px] text-[#aaa]">{r.city}</div>}
                <p className="mt-2 text-xs leading-relaxed text-[#666]">{r.text}</p>
                {r.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.image_url} alt="" referrerPolicy="no-referrer" className="mt-2.5 h-20 w-20 rounded object-cover" />
                )}
                {r.admin_reply && (
                  <div className="mt-2.5 rounded bg-cream px-3 py-2 text-xs text-charcoal/70">
                    <span className="font-semibold text-navy">ComfyClub:</span> {r.admin_reply}
                  </div>
                )}
              </div>
            ))}

            {p.review_count > 3 && (
              <button onClick={() => setShowAll(!showAll)} className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md border border-navy py-3 text-[13px] font-semibold text-navy">
                {showAll ? "Show Less" : `View All ${p.review_count} Reviews`}
                <span className="text-[11px] transition" style={{ transform: showAll ? "rotate(180deg)" : "none" }}>▾</span>
              </button>
            )}

            <ReviewForm product={{ id: p.id, name: p.name }} />
          </div>
        </div>
      </div>
    </div>
  );
}
