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
      <nav className="px-5 pb-2 pt-3 text-xs text-charcoal/50 md:px-10" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-1.5">›</span>
        <span className="text-charcoal/70">{title}</span>
      </nav>

      <div className="bg-navy px-6 py-10 text-center md:px-10">
        <div className="mb-2 text-[11px] uppercase tracking-[3px] text-gold">ComfyClub</div>
        <h1 className="m-0 font-heading text-[30px] font-semibold leading-tight text-white md:text-[36px]">{title}</h1>
        {!html && <p className="mt-2 text-xs text-white/45">Last updated: {updated}</p>}
      </div>

      <article className="mx-auto max-w-3xl px-5 py-10 md:px-10">
        {intro && <p className="mb-8 text-[15px] leading-[1.8] text-[#555]">{intro}</p>}
        {html ? (
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          (sections ?? []).map((s) => (
            <section key={s.heading} className="mb-7">
              <h2 className="mb-2.5 font-heading text-[20px] font-semibold text-charcoal">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mb-3 text-[14.5px] leading-[1.8] text-[#666]">{p}</p>
              ))}
            </section>
          ))
        )}

        <div className="mt-10 rounded-[10px] border-l-[3px] border-gold bg-cream px-5 py-5">
          <h3 className="mb-1 font-heading text-[16px] font-semibold text-charcoal">Questions?</h3>
          <p className="mb-3 text-sm leading-relaxed text-[#666]">
            We&apos;re always happy to help. Reach us on WhatsApp or email and we&apos;ll respond quickly.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a href={waLink("Hi, I have a question about your policies.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded bg-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white"><WhatsAppIcon size={15} /> WhatsApp Us</a>
            <Link href="/contact-us/" className="rounded border border-navy px-5 py-2.5 text-[13px] font-semibold text-navy">Contact Page</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
