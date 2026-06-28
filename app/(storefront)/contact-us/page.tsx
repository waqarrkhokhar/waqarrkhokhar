import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/storefront/ContactForm";
import WhatsAppIcon from "@/components/storefront/WhatsAppIcon";
import { waLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us | ComfyClub",
  description:
    "Get in touch with ComfyClub — WhatsApp, call, or email us, or visit our workshop on Jan Muhammad Road, Nawab Town, Lahore. We reply within minutes.",
};

const FAQS = [
  { q: "How do I place an order?", a: "Simply WhatsApp us at 0339 4100052 with the product you like. We'll confirm availability, customization options, and delivery details." },
  { q: "Do you deliver outside Lahore?", a: "Yes! We ship across all major cities in Pakistan — Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and more." },
  { q: "Can I visit your workshop?", a: "Yes! Visit us at Jan Muhammad Road, Nawab Town, Lahore. We're open Mon–Sat, 8 AM – 9 PM. Walk-ins welcome." },
  { q: "What payment methods do you accept?", a: "We accept bank transfer, JazzCash, EasyPaisa, and cash on delivery (select cities)." },
  { q: "How long does delivery take?", a: "Most orders are handcrafted and delivered within 2–3 weeks. We'll share tracking details via WhatsApp." },
  { q: "Do you offer custom orders?", a: "Absolutely! WhatsApp us your requirements. Custom sizes, fabrics, and colours are available on most products." },
];

export default function ContactPage() {
  return (
    <div className="text-[#3a3a3a]">
      <nav className="mx-auto max-w-5xl px-5 pb-2 pt-4 text-[13px] text-charcoal/50 md:px-10" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-1.5">›</span>
        <span className="text-charcoal/70">Contact Us</span>
      </nav>

      {/* Hero */}
      <div className="bg-navy px-6 py-12 text-center md:px-10 md:py-14">
        <div className="mb-3 text-xs uppercase tracking-[3px] text-gold">We&apos;re Here to Help</div>
        <h1 className="m-0 font-heading text-[36px] font-semibold leading-tight text-white md:text-[44px]">Get in Touch</h1>
        <p className="mx-auto mt-3.5 max-w-lg text-[18px] leading-relaxed text-white/70">
          Have a question about our furniture? Need help with an order? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Quick contact cards */}
      <div className="relative z-[2] mx-auto -mt-6 grid max-w-5xl gap-4 px-5 md:grid-cols-3 md:px-10">
        <a href={waLink("Hi, I'd like to get in touch.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl border border-black/[0.04] bg-white px-5 py-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.10)]">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-whatsapp text-white">
            <WhatsAppIcon size={22} />
          </div>
          <div>
            <div className="font-heading text-[17px] font-semibold text-charcoal">WhatsApp Us</div>
            <div className="mt-0.5 text-[15px] text-[#777]">+92 339 4100052</div>
            <div className="mt-1 text-[13px] font-medium text-whatsapp">Typically reply within minutes →</div>
          </div>
        </a>

        <a href="tel:03394100052" className="flex items-center gap-4 rounded-xl border border-black/[0.04] bg-white px-5 py-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.10)]">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
          </div>
          <div>
            <div className="font-heading text-[17px] font-semibold text-charcoal">Call Us</div>
            <div className="mt-0.5 text-[15px] text-[#777]">0339 4100052</div>
            <div className="mt-1 text-[13px] font-medium text-gold">Mon – Sat: 8 AM – 9 PM</div>
          </div>
        </a>

        <a href="mailto:comfyclub.pk@gmail.com" className="flex items-center gap-4 rounded-xl border border-black/[0.04] bg-white px-5 py-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.10)]">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cream">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M3 9l9 6 9-6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <div className="font-heading text-[17px] font-semibold text-charcoal">Email Us</div>
            <div className="mt-0.5 text-[15px] text-[#777]">comfyclub.pk@gmail.com</div>
            <div className="mt-1 text-[13px] font-medium text-[#999]">We respond within 24 hours</div>
          </div>
        </a>
      </div>

      {/* Form */}
      <section className="mx-auto max-w-5xl px-5 py-12 md:px-10">
        <h2 className="mb-1.5 font-heading text-[30px] font-semibold text-charcoal md:text-[38px]">Send Us a Message</h2>
        <p className="mb-6 text-[16px] leading-relaxed text-[#777]">Fill in the form below and we&apos;ll get back to you at comfyclub.pk@gmail.com</p>
        <ContactForm />
      </section>

      {/* Workshop + map */}
      <section className="mx-auto max-w-5xl px-5 pb-12 md:px-10">
        <h2 className="mb-1.5 font-heading text-[30px] font-semibold text-charcoal md:text-[38px]">Visit Our Workshop</h2>
        <p className="mb-5 text-[16px] leading-relaxed text-[#777]">Come see and feel our furniture in person</p>
        <div className="mb-4 rounded-xl bg-cream p-6">
          <div className="mb-4 flex items-start gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <div>
              <div className="font-heading text-[19px] font-semibold text-charcoal">ComfyClub Workshop</div>
              <div className="mt-1 text-[17px] leading-relaxed text-[#5a5a5a]">Jan Muhammad Road, Nawab Town,<br />Lahore, Pakistan</div>
            </div>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <div className="text-[17px] text-[#5a5a5a]">Mon – Sat: 8:00 AM – 9:00 PM</div>
          </div>
          <a href="https://www.google.com/maps/place/31%C2%B027'01.2%22N+74%C2%B014'47.7%22E" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
            Get Directions
          </a>
        </div>
        <div className="h-[300px] overflow-hidden rounded-xl border border-[#D8D2C8]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3402.2!2d74.2466!3d31.4503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDI3JzAxLjIiTiA3NMKwMTQnNDcuNyJF!5e0!3m2!1sen!2spk!4v1"
            width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" title="ComfyClub Workshop Location"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-5 pb-14 md:px-10">
        <h2 className="mb-5 font-heading text-[30px] font-semibold text-charcoal md:text-[38px]">Common Questions</h2>
        {FAQS.map((faq) => (
          <details key={faq.q} className="group border-b border-black/[0.07]">
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-[19px] font-semibold text-charcoal">
              {faq.q}
              <span className="ml-3 flex-shrink-0 text-xl text-[#ccc] transition group-open:rotate-45">+</span>
            </summary>
            <p className="pb-4 text-[17px] leading-relaxed text-[#6a6a6a]">{faq.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
