import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/storefront/WhatsAppIcon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | ComfyClub — Furniture Worth Keeping",
  description:
    "From a workshop on Jan Muhammad Road, Lahore to furnishing Pakistan's most recognized names. Handcrafted, made-to-order furniture built on craft and trust.",
};

const CLIENTS = [
  { name: "Bahria Town Lahore", href: "https://www.bahriatown.com/", type: "Real Estate" },
  { name: "Lake City Lahore", href: "https://www.lakecity.com.pk/", type: "Real Estate" },
  { name: "Gul Ahmed", href: "https://www.gulahmedshop.com/", type: "Retail & Textile" },
  { name: "NewsOne", href: "https://www.newsone.tv/", type: "Media" },
  { name: "Five Star Foam", href: "https://www.fivestarfoam.com/", type: "Manufacturing" },
  { name: "Kips College Lahore", href: "https://www.kips.edu.pk/", type: "Education" },
  { name: "ATS Lahore", href: "https://www.atslhr.com/", type: "Security" },
  { name: "Devour Lahore", href: "https://devour.com.pk/", type: "Hospitality" },
  { name: "RABAT Banquet Hall", href: null, type: "Hospitality" },
];

const PROCESS = [
  { step: "01", title: "Design & Selection", desc: "Browse our collection or share a reference. Our team helps you choose the right design, fabric, and dimensions for your space." },
  { step: "02", title: "Frame Construction", desc: "Solid kikar and sheesham wood frames are hand-joined using traditional joinery — no staples, no shortcuts. Built to bear weight for decades." },
  { step: "03", title: "Foam & Cushioning", desc: "High-density foam is cut and layered by hand for each seat and backrest. We test firmness and comfort before moving to upholstery." },
  { step: "04", title: "Upholstery & Finishing", desc: "Premium fabric is carefully stretched, tucked, and stitched over the frame. Every seam and tufting detail is inspected by our senior craftsmen." },
  { step: "05", title: "Quality Check & Delivery", desc: "Final inspection for structural integrity, fabric finish, and comfort. Then we carefully package and ship directly to your doorstep across Pakistan." },
];

const STATS = [
  { number: "1,200+", label: "Happy Customers", desc: "Homes furnished across Pakistan" },
  { number: "4.8", label: "Google Rating", desc: "From 32 verified reviews" },
  { number: "200+", label: "Corporate Projects", desc: "Across multiple industries" },
  { number: "100%", label: "Made to Order", desc: "Nothing mass-produced" },
  { number: "45+", label: "Cities Delivered", desc: "From Lahore to Karachi" },
  { number: "3+", label: "Years of Craft", desc: "Growing every day" },
];

const VALUES = [
  { title: "Craft Over Speed", desc: "We take 2–3 weeks per order because quality takes time. Every joint is hand-tested, every fabric hand-inspected. We'd rather deliver late than deliver less." },
  { title: "Honesty in Materials", desc: "When we say solid wood, we mean it. Kikar and sheesham, not plywood with a veneer. When we say high-density foam, we mean tested at 40+ density. No fine print." },
  { title: "People Before Transactions", desc: "We don't have a shopping cart. We have WhatsApp. Every customer talks to a real person. We advise, suggest, and sometimes talk people out of something that won't fit their space." },
  { title: "Accessible Luxury", desc: "We sell direct. No showroom rent, no dealer margins, no imported-label markup. You get workshop-to-home prices for furniture that looks and feels premium." },
];

async function heroImage(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.from("product_images").select("url").limit(1).maybeSingle();
  return data?.url ?? null;
}

export default async function AboutPage() {
  const bg = await heroImage();

  return (
    <div>
      <nav className="px-5 pb-2 pt-3 text-xs text-charcoal/50 md:px-10" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-1.5">›</span>
        <span className="text-charcoal/70">About Us</span>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[480px] overflow-hidden bg-navy">
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        )}
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg,#C9A84C,transparent 60%)" }} />
        <div className="relative z-[2] px-6 py-14 md:px-10 md:py-20">
          <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[4px] text-gold">
            <span className="h-px w-8 bg-gold" /> EST. LAHORE, PAKISTAN
          </div>
          <h1 className="m-0 font-heading text-[42px] font-semibold leading-[1.1] text-white md:text-[56px]">
            We Build<br /><span className="text-gold">Furniture</span><br />Worth Keeping
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/50">
            From a workshop on Jan Muhammad Road to furnishing Pakistan&apos;s most recognized names. This is our story.
          </p>
          <div className="mt-8 flex">
            {[{ val: "1,200+", label: "Customers" }, { val: "4.8", label: "Google Rating" }, { val: "3+", label: "Years" }].map((s, i) => (
              <div key={s.label} className={`px-5 py-3.5 text-center ${i < 2 ? "border-r border-white/10" : ""}`}>
                <div className="font-heading text-2xl font-bold leading-none text-gold">{s.val}</div>
                <div className="mt-1 text-[11px] tracking-wide text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="px-5 py-12 md:px-10">
        <div className="mb-3 text-[11px] uppercase tracking-[3px] text-gold">Our Story</div>
        <h2 className="mb-5 font-heading text-[26px] font-semibold leading-tight text-charcoal">Built on Craft, Driven by Trust</h2>
        <div className="space-y-5 border-l-2 border-gold/30 pl-5 text-[15px] leading-[1.85] text-[#555]">
          <p>ComfyClub started with one conviction: Pakistani homes deserve better furniture. Not mass-produced, not imported, but handcrafted with real materials by people who take pride in their work.</p>
          <p>Our workshop sits on Jan Muhammad Road in Nawab Town, Lahore, where seasoned artisans shape solid hardwood into frames, layer high-density foam by hand, and upholster each piece in premium velvet, linen, or boucle. Every sofa, every chair, every bed is made to order. Nothing leaves our workshop until it&apos;s right.</p>
          <p>Over the years, that standard of craft has earned us the trust of families across Pakistan and some of the country&apos;s most recognized names — from Bahria Town and Gul Ahmed to Lake City and NewsOne. We don&apos;t advertise much. Our work speaks. Our customers return.</p>
        </div>
      </section>

      {/* Process */}
      <section className="bg-cream px-5 py-12 md:px-10">
        <div className="mb-3 text-[11px] uppercase tracking-[3px] text-gold">Our Process</div>
        <h2 className="mb-7 font-heading text-[26px] font-semibold leading-tight text-charcoal">From Raw Wood to Your Living Room</h2>
        <div className="flex flex-col">
          {PROCESS.map((item, i) => (
            <div key={item.step} className={`flex gap-4 py-5 ${i < PROCESS.length - 1 ? "border-b border-[#D8D2C8]" : ""}`}>
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-gold">{item.step}</div>
              <div>
                <h3 className="mb-1 font-heading text-[17px] font-semibold text-charcoal">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#777]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clients */}
      <section className="px-5 py-12 md:px-10">
        <div className="mb-3 text-[11px] uppercase tracking-[3px] text-gold">Our Clients</div>
        <h2 className="mb-2 font-heading text-[26px] font-semibold leading-tight text-charcoal">Trusted by Pakistan&apos;s Leading Names</h2>
        <p className="mb-7 text-sm leading-relaxed text-[#888]">From real estate giants to media houses, 200+ organizations trust ComfyClub to deliver quality at scale.</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {CLIENTS.map((c) => {
            const card = (
              <div className="flex min-h-[100px] flex-col items-center justify-center rounded-lg border border-[#D8D2C8]/60 bg-white px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_4px_16px_rgba(201,168,76,0.1)]">
                <div className="font-heading text-[15px] font-semibold leading-tight text-navy">{c.name}</div>
                <div className="mt-1.5 text-[11px] tracking-wide text-gold">{c.type}</div>
              </div>
            );
            return c.href ? (
              <a key={c.name} href={c.href} target="_blank" rel="nofollow noopener noreferrer">{card}</a>
            ) : <div key={c.name}>{card}</div>;
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-navy px-5 py-12 md:px-10">
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg,#C9A84C,transparent)" }} />
        <div className="mb-2 text-center text-[11px] uppercase tracking-[3px] text-gold">By the Numbers</div>
        <h2 className="mb-8 text-center font-heading text-2xl font-semibold text-white">The ComfyClub Journey So Far</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-[10px] border border-white/[0.06] bg-white/[0.03] px-4 py-5 text-center">
              <div className="font-heading text-[32px] font-bold leading-none text-gold">{s.number}</div>
              <div className="mt-2 text-[13px] font-semibold text-white">{s.label}</div>
              <div className="mt-1 text-[11px] text-white/35">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-5 py-12 md:px-10">
        <div className="mb-3 text-[11px] uppercase tracking-[3px] text-gold">What We Stand For</div>
        <h2 className="mb-7 font-heading text-[26px] font-semibold leading-tight text-charcoal">Our Principles</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-[10px] border-l-[3px] border-gold bg-cream px-5 py-6">
              <h3 className="mb-1.5 font-heading text-[17px] font-semibold text-charcoal">{v.title}</h3>
              <p className="text-sm leading-[1.7] text-[#666]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy px-6 py-12 text-center">
        <div className="mb-2 font-heading text-[26px] font-semibold leading-tight text-white">Ready to Experience the Difference?</div>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-white/50">Browse our collection or chat with our furniture experts. We&apos;re one message away.</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Link href="/" className="rounded bg-gold px-7 py-3.5 text-sm font-semibold text-white">Browse Collection</Link>
          <a href={waLink("Hi, I'd like to know more about ComfyClub.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded bg-whatsapp px-7 py-3.5 text-sm font-semibold text-white"><WhatsAppIcon size={16} /> WhatsApp Us</a>
        </div>
      </section>
    </div>
  );
}
