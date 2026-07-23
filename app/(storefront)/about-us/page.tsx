import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/storefront/WhatsAppIcon";
import Reveal from "@/components/storefront/Reveal";
import CountUp from "@/components/storefront/CountUp";

export const revalidate = 300;

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
  const supabase = createPublicClient();
  const { data } = await supabase.from("product_images").select("url").limit(1).maybeSingle();
  return data?.url ?? null;
}

export default async function AboutPage() {
  const bg = await heroImage();

  return (
    <div className="text-[#3a3a3a]">
      <nav className="mx-auto max-w-6xl px-5 pb-2 pt-4 text-[13px] text-charcoal/50 md:px-10" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-gold">Home</Link>
        <span className="mx-1.5">›</span>
        <span className="text-charcoal/70">About Us</span>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[520px] overflow-hidden bg-navy">
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg,#C9A84C,transparent 60%)" }} />
        <div className="relative z-[2] mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <Reveal className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[4px] text-gold">
            <span className="h-px w-10 bg-gold" /> EST. LAHORE, PAKISTAN
          </Reveal>
          <Reveal as="div" delay={80}>
            <h1 className="m-0 font-heading text-[46px] font-semibold leading-[1.08] text-white md:text-[64px]">
              We Build<br /><span className="text-gold">Furniture</span><br />Worth Keeping
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white/70">
              From a workshop on Jan Muhammad Road to furnishing Pakistan&apos;s most recognized names. This is our story.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-10 flex flex-wrap">
            {[{ val: "1,200+", label: "Customers" }, { val: "4.8", label: "Google Rating" }, { val: "3+", label: "Years" }].map((s, i) => (
              <div key={s.label} className={`px-6 py-4 text-center ${i < 2 ? "border-r border-white/10" : ""}`}>
                <CountUp value={s.val} className="block font-heading text-3xl font-bold leading-none text-gold md:text-4xl" />
                <div className="mt-1.5 text-xs uppercase tracking-wide text-white/55">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto max-w-4xl px-5 py-16 md:px-10 md:py-20">
        <Reveal className="mb-3 text-xs uppercase tracking-[3px] text-gold">Our Story</Reveal>
        <Reveal delay={60}><h2 className="mb-7 font-heading text-[28px] font-semibold leading-tight text-charcoal md:text-[32px]">Built on Craft, Driven by Trust</h2></Reveal>
        <Reveal delay={120} className="space-y-6 border-l-2 border-gold/40 pl-6 text-[17px] leading-[1.85] text-[#4a4a4a] md:text-[18px]">
          <p>ComfyClub started with one conviction: Pakistani homes deserve better furniture. Not mass-produced, not imported, but handcrafted with real materials by people who take pride in their work.</p>
          <p>Our workshop sits on Jan Muhammad Road in Nawab Town, Lahore, where seasoned artisans shape solid hardwood into frames, layer high-density foam by hand, and upholster each piece in premium velvet, linen, or boucle. Every sofa, every chair, every bed is made to order. Nothing leaves our workshop until it&apos;s right.</p>
          <p>Over the years, that standard of craft has earned us the trust of families across Pakistan and some of the country&apos;s most recognized names — from Bahria Town and Gul Ahmed to Lake City and NewsOne. We don&apos;t advertise much. Our work speaks. Our customers return.</p>
        </Reveal>
      </section>

      {/* Process */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <Reveal className="mb-3 text-xs uppercase tracking-[3px] text-gold">Our Process</Reveal>
          <Reveal delay={60}><h2 className="mb-9 font-heading text-[28px] font-semibold leading-tight text-charcoal md:text-[32px]">From Raw Wood to Your Living Room</h2></Reveal>
          <div className="flex flex-col">
            {PROCESS.map((item, i) => (
              <Reveal key={item.step} delay={i * 80}>
                <div className={`group flex gap-5 py-6 transition ${i < PROCESS.length - 1 ? "border-b border-[#D8D2C8]" : ""}`}>
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[15px] font-bold text-gold transition duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-navy">{item.step}</div>
                  <div>
                    <h3 className="mb-1.5 font-heading text-[21px] font-semibold text-charcoal">{item.title}</h3>
                    <p className="text-[16px] leading-relaxed text-[#6a6a6a]">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-20">
        <Reveal className="mb-3 text-xs uppercase tracking-[3px] text-gold">Our Clients</Reveal>
        <Reveal delay={60}><h2 className="mb-2 font-heading text-[28px] font-semibold leading-tight text-charcoal md:text-[32px]">Trusted by Pakistan&apos;s Leading Names</h2></Reveal>
        <Reveal delay={120}><p className="mb-9 text-[16px] leading-relaxed text-[#777]">From real estate giants to media houses, 200+ organizations trust ComfyClub to deliver quality at scale.</p></Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CLIENTS.map((c, i) => {
            const card = (
              <div className="flex h-full min-h-[110px] flex-col items-center justify-center rounded-xl border border-[#D8D2C8]/60 bg-white px-4 py-6 text-center transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_10px_30px_rgba(201,168,76,0.18)]">
                <div className="font-heading text-[17px] font-semibold leading-tight text-navy">{c.name}</div>
                <div className="mt-2 text-xs uppercase tracking-wide text-gold">{c.type}</div>
              </div>
            );
            return (
              <Reveal key={c.name} delay={i * 50}>
                {c.href ? <a href={c.href} target="_blank" rel="nofollow noopener noreferrer" className="block h-full">{card}</a> : card}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-navy py-16 md:py-20">
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg,#C9A84C,transparent)" }} />
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Reveal className="mb-2 text-center text-xs uppercase tracking-[3px] text-gold">By the Numbers</Reveal>
          <Reveal delay={60}><h2 className="mb-10 text-center font-heading text-[28px] font-semibold text-white md:text-[32px]">The ComfyClub Journey So Far</h2></Reveal>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-7 text-center transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.06]">
                  <CountUp value={s.number} className="block font-heading text-[40px] font-bold leading-none text-gold md:text-[44px]" />
                  <div className="mt-3 text-[15px] font-semibold text-white">{s.label}</div>
                  <div className="mt-1 text-[13px] text-white/45">{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-20">
        <Reveal className="mb-3 text-xs uppercase tracking-[3px] text-gold">What We Stand For</Reveal>
        <Reveal delay={60}><h2 className="mb-9 font-heading text-[28px] font-semibold leading-tight text-charcoal md:text-[32px]">Our Principles</h2></Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="h-full rounded-2xl border-l-[4px] border-gold bg-cream px-6 py-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,29,53,0.10)]">
                <h3 className="mb-2 font-heading text-[22px] font-semibold text-charcoal">{v.title}</h3>
                <p className="text-[16px] leading-[1.75] text-[#5a5a5a]">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy px-6 py-16 text-center md:py-20">
        <Reveal as="div">
          <div className="mb-3 font-heading text-[28px] font-semibold leading-tight text-white md:text-[32px]">Ready to Experience the Difference?</div>
          <p className="mx-auto mb-8 max-w-md text-[16px] leading-relaxed text-white/60">Browse our collection or chat with our furniture experts. We&apos;re one message away.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-md bg-gold px-8 py-4 text-[15px] font-semibold text-white transition hover:brightness-110">Browse Collection</Link>
            <a href={waLink("Hi, I'd like to know more about ComfyClub.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-whatsapp px-8 py-4 text-[15px] font-semibold text-white transition hover:brightness-110"><WhatsAppIcon size={18} /> WhatsApp Us</a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
