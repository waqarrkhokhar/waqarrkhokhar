import Link from "next/link";
import { waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

export type PolicySection = { heading: string; body: string[] };

export default function PolicyPage({
  title,
  intro,
  sections,
  html,
  updated = "June 2026",
}: {
  title: string;
  intro?: string;
  sections?: PolicySection[];
  html?: string;
  updated?: string;
}) {
  return (
    <div>
      <nav className="mx-auto max-w-3xl px-5 pb-2 pt-4 text-[13px] text-charcoal/50 md:px-10" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-1.5">›</span>
        <span className="text-charcoal/70">{title}</span>
      </nav>

      <div className="bg-navy px-6 py-12 text-center md:px-10 md:py-14">
        <div className="mb-3 text-xs uppercase tracking-[3px] text-gold">ComfyClub</div>
        <h1 className="m-0 font-heading text-[34px] font-semibold leading-tight text-white md:text-[42px]">{title}</h1>
        {!html && <p className="mt-3 text-[13px] text-white/55">Last updated: {updated}</p>}
      </div>

      <article className="mx-auto max-w-3xl px-5 py-12 md:px-10">
        {intro && <p className="mb-8 text-[18px] leading-[1.8] text-[#4a4a4a]">{intro}</p>}
        {html ? (
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          (sections ?? []).map((s) => (
            <section key={s.heading} className="mb-8">
              <h2 className="mb-3 font-heading text-[28px] font-semibold text-charcoal md:text-[32px]">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mb-3 text-[17px] leading-[1.85] text-[#555]">{p}</p>
              ))}
            </section>
          ))
        )}

        <div className="mt-12 rounded-xl border-l-[4px] border-gold bg-cream px-6 py-6">
          <h3 className="mb-1.5 font-heading text-[20px] font-semibold text-charcoal">Questions?</h3>
          <p className="mb-4 text-[16px] leading-relaxed text-[#5a5a5a]">
            We&apos;re always happy to help. Reach us on WhatsApp or email and we&apos;ll respond quickly.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={waLink("Hi, I have a question about your policies.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-whatsapp px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"><WhatsAppIcon size={16} /> WhatsApp Us</a>
            <Link href="/contact-us/" className="rounded-md border border-navy px-6 py-3 text-[15px] font-semibold text-navy transition hover:bg-navy hover:text-white">Contact Page</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
