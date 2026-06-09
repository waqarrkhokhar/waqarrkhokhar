import Link from "next/link";
import type { StoreProduct } from "@/lib/storefront/data";
import { waLink } from "@/lib/whatsapp";
import ProductCard from "../ProductCard";

export function SectionHeading({
  title,
  subtitle,
  viewAll,
}: {
  title: string;
  subtitle?: string;
  viewAll?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between px-5 sm:px-10">
      <div>
        <h2 className="font-heading text-[26px] font-semibold text-charcoal">{title}</h2>
        {subtitle && <p className="text-sm text-charcoal/55">{subtitle}</p>}
      </div>
      {viewAll && (
        <Link href={viewAll} className="whitespace-nowrap text-[13px] font-medium uppercase tracking-wide text-gold hover:underline">
          View All →
        </Link>
      )}
    </div>
  );
}

export function ProductRow({
  title,
  subtitle,
  viewAll,
  products,
}: {
  title: string;
  subtitle?: string;
  viewAll?: string;
  products: StoreProduct[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="py-8">
      <SectionHeading title={title} subtitle={subtitle} viewAll={viewAll} />
      <div className="grid grid-cols-2 gap-4 px-5 sm:gap-6 sm:px-10 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

export function TrustedBy({ clients }: { clients: string[] }) {
  if (clients.length === 0) return null;
  return (
    <section className="bg-cream px-5 py-7 text-center">
      <p className="mb-4 text-[11px] uppercase tracking-[2.5px] text-charcoal/40">Trusted By</p>
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3">
        {clients.map((c) => (
          <span key={c} className="font-heading text-sm font-semibold text-navy/55 transition hover:text-navy">{c}</span>
        ))}
      </div>
    </section>
  );
}

export function LimitedOffers({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) return null;
  const maxDisc = Math.max(...products.map((p) => p.price && p.sale_price ? Math.round((1 - p.sale_price / p.price) * 100) : 0));
  return (
    <section className="bg-navy py-9">
      <div className="mb-4 px-5 sm:px-10">
        <p className="text-[11px] uppercase tracking-[3px] text-gold">Don&apos;t Miss Out</p>
        <h2 className="font-heading text-[26px] font-semibold text-white">Limited-Time Offers</h2>
        <p className="text-sm text-white/45">Up to {maxDisc}% off. While stocks last</p>
      </div>
      <div className="grid grid-cols-2 gap-4 px-5 sm:gap-6 sm:px-10 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => {
          const disc = p.price && p.sale_price ? Math.round((1 - p.sale_price / p.price) * 100) : 0;
          return (
            <div key={p.id} className="relative rounded-lg bg-white p-2.5">
              {disc > 0 && (
                <span className="absolute right-4 top-4 z-10 rounded-sm bg-sale px-2 py-0.5 text-[11px] font-bold text-white">-{disc}%</span>
              )}
              <ProductCard product={p} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function WhyComfyClub({ items }: { items: { title: string; desc: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="px-5 py-10 sm:px-10">
      <h2 className="mb-6 font-heading text-[26px] font-semibold text-charcoal">Why ComfyClub</h2>
      <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
        {items.map((it) => (
          <div key={it.title} className="flex flex-1 items-start gap-4 md:min-w-[220px]">
            <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-full bg-navy text-gold" style={{ height: 52, width: 52 }}>★</div>
            <div>
              <h3 className="font-heading text-[17px] font-semibold text-charcoal">{it.title}</h3>
              <p className="text-sm leading-relaxed text-charcoal/60">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks({ steps }: { steps: { step: string; title: string; desc: string }[] }) {
  if (steps.length === 0) return null;
  return (
    <section className="bg-cream px-5 py-12 sm:px-10">
      <div className="mb-6">
        <h2 className="font-heading text-[26px] font-semibold text-charcoal">How It Works</h2>
        <p className="text-sm text-charcoal/55">From selection to delivery. A seamless experience</p>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-1 items-start gap-4 md:min-w-[220px]">
            <span className="font-heading text-[28px] font-bold leading-none text-gold/40">{s.step}</span>
            <div>
              <h3 className="font-heading text-[17px] font-semibold text-charcoal">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-charcoal/55">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NeedHelpCTA() {
  return (
    <section className="bg-navy px-6 py-10 text-center">
      <h2 className="font-heading text-[26px] font-semibold text-white">Need Help Choosing?</h2>
      <p className="mt-1 text-sm text-white/50">Our furniture experts are a message away</p>
      <a
        href={waLink("Hi, I'd like help choosing furniture.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded border border-gold px-8 py-3.5 text-[13px] font-semibold tracking-wide text-gold transition hover:bg-gold hover:text-navy"
      >
        Chat on WhatsApp
      </a>
    </section>
  );
}
