import Link from "next/link";
import type { StoreProduct } from "@/lib/storefront/data";
import { waLink } from "@/lib/whatsapp";
import ProductCard from "../ProductCard";
import WhatsAppIcon from "../WhatsAppIcon";

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
    <div className="mb-5 px-5">
      <div className="flex items-baseline justify-between">
        <h2 className="m-0 font-body text-[26px] font-semibold text-charcoal md:text-[30px]">{title}</h2>
        {viewAll && (
          <Link href={viewAll} className="whitespace-nowrap text-[14px] font-semibold tracking-wide text-gold hover:underline">
            View All →
          </Link>
        )}
      </div>
      {subtitle && <p className="mt-1.5 text-[15px] leading-snug text-[#777]">{subtitle}</p>}
    </div>
  );
}

export function ProductRow({
  title,
  subtitle,
  viewAll,
  products,
  background,
}: {
  title: string;
  subtitle?: string;
  viewAll?: string;
  products: StoreProduct[];
  background?: "white" | "cream";
}) {
  if (products.length === 0) return null;
  return (
    <section className={`py-8 ${background === "cream" ? "bg-cream" : ""}`}>
      <SectionHeading title={title} subtitle={subtitle} viewAll={viewAll} />
      <div className="grid grid-cols-2 gap-4 px-5 md:grid-cols-4 md:gap-6 md:px-10">
        {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

export function TrustedBy({ clients }: { clients: { name: string; href?: string | null }[] }) {
  if (clients.length === 0) return null;
  // Duplicate the list so the marquee can loop seamlessly on a single line.
  const loop = [...clients, ...clients];
  return (
    <div className="bg-cream pb-7 pt-6 text-center">
      <div className="mb-4 text-[11px] uppercase tracking-[2.5px] text-[#999]">Trusted By</div>
      <div className="cc-marquee-wrap relative overflow-hidden">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-cream to-transparent" />
        <div className="cc-marquee flex w-max items-center gap-x-12 whitespace-nowrap">
          {loop.map((c, i) =>
            c.href ? (
              <a key={`${c.name}-${i}`} href={c.href} target="_blank" rel="nofollow noopener noreferrer" aria-hidden={i >= clients.length} tabIndex={i >= clients.length ? -1 : undefined} className="font-heading text-[17px] font-semibold text-navy/80 transition hover:text-navy">
                {c.name}
              </a>
            ) : (
              <span key={`${c.name}-${i}`} aria-hidden={i >= clients.length} className="font-heading text-[17px] font-semibold text-navy/80">{c.name}</span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export function LimitedOffers({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) return null;
  const maxDisc = Math.max(...products.map((p) => (p.price && p.sale_price ? Math.round((1 - p.sale_price / p.price) * 100) : 0)));
  return (
    <section className="bg-navy py-9">
      <div className="mb-4 px-5">
        <div className="mb-1 text-[11px] uppercase tracking-[3px] text-gold">Don&apos;t Miss Out</div>
        <h2 className="m-0 font-body text-[22px] font-semibold text-white">Limited-Time Offers</h2>
        <p className="mt-1 text-[13.5px] text-white/45">Up to {maxDisc}% off. While stocks last</p>
      </div>
      <div className="grid grid-cols-2 gap-4 px-5 md:grid-cols-4 md:gap-6 md:px-10">
        {products.slice(0, 4).map((p) => {
          const disc = p.price && p.sale_price ? Math.round((1 - p.sale_price / p.price) * 100) : 0;
          return (
            <div key={p.id} className="relative rounded-lg bg-white p-2.5">
              {disc > 0 && (
                <span className="absolute right-4 top-4 z-[2] rounded-sm bg-sale px-2 py-0.5 text-[11px] font-bold text-white">-{disc}%</span>
              )}
              <ProductCard product={p} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WhyIcon({ type }: { type?: string }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "#C9A84C", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "materials")
    return <svg {...common}><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></svg>;
  if (type === "ship")
    return <svg {...common}><path d="M10 17h4V5H2v12h3" /><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>;
  if (type === "support")
    return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
  // craft (default)
  return <svg {...common}><path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9" /><path d="M17.64 15 22 10.64" /><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h.86c.85 0 1.65.34 2.25.93l1.25 1.25" /></svg>;
}

export function WhyComfyClub({ items }: { items: { icon?: string; title: string; desc: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="px-5 py-14 md:py-16">
      <h2 className="mb-7 font-body text-[26px] font-semibold text-charcoal md:text-[30px]">Why ComfyClub</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-4">
            <div className="flex flex-shrink-0 items-center justify-center rounded-full bg-navy" style={{ width: 56, height: 56 }}>
              <WhyIcon type={it.icon} />
            </div>
            <div className="pt-0.5">
              <div className="font-heading text-[20px] font-semibold leading-tight text-charcoal">{it.title}</div>
              <div className="mt-1.5 text-[15px] leading-relaxed text-[#5a5a5a]">{it.desc}</div>
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
    <section className="bg-cream px-5 py-14 md:py-16">
      <SectionHeading title="How It Works" subtitle="From selection to delivery. A seamless experience" />
      <div className="mt-2 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.step} className="flex items-start gap-4">
            <span className="font-heading text-[38px] font-bold leading-none text-gold/70" style={{ minWidth: 46 }}>{s.step}</span>
            <div>
              <div className="font-heading text-[20px] font-semibold text-charcoal">{s.title}</div>
              <div className="mt-1.5 text-[15px] leading-relaxed text-[#5a5a5a]">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NeedHelpCTA() {
  return (
    <section className="bg-cream px-6 py-14 text-center md:py-16">
      <div className="mb-2 font-body text-[26px] font-semibold text-navy md:text-[30px]">Need Help Choosing?</div>
      <p className="mb-6 text-[15px] text-charcoal/60">Our furniture experts are a message away</p>
      <a
        href={waLink("Hi, I'd like help choosing furniture.")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 rounded-md bg-whatsapp px-8 py-3.5 text-[14px] font-semibold tracking-wide text-white shadow-[0_6px_18px_rgba(37,211,102,0.32)] transition hover:brightness-105"
      >
        <WhatsAppIcon size={18} />
        Chat on WhatsApp
      </a>
    </section>
  );
}
