import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/storefront/ContactForm";
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
    <div>
      <nav className="px-5 pb-2 pt-3 text-xs text-charcoal/50 md:px-10" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-1.5">›</span>
        <span className="text-charcoal/70">Contact Us</span>
      </nav>

      {/* Hero */}
      <div className="bg-navy px-6 py-10 text-center md:px-10">
        <div className="mb-2.5 text-[11px] uppercase tracking-[3px] text-gold">We&apos;re Here to Help</div>
        <h1 className="m-0 font-heading text-[32px] font-semibold leading-tight text-white">Get in Touch</h1>
        <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-white/55">
          Have a question about our furniture? Need help with an order? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Quick contact cards */}
      <div className="relative z-[2] mx-5 mt-6 grid gap-3 md:mx-10 md:grid-cols-3">
        <a href={waLink("Hi, I'd like to get in touch.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 rounded-[10px] border border-black/[0.04] bg-white px-5 py-[18px] shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-whatsapp text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.8-2.5-1.4-3.5-3.1-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.4 1.9.8 2.6.9 3.5.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2" /></svg>
          </div>
          <div>
            <div className="font-heading text-[15px] font-semibold text-charcoal">WhatsApp Us</div>
            <div className="mt-0.5 text-[13px] text-[#888]">+92 339 4100052</div>
            <div className="mt-0.5 text-[11px] font-medium text-whatsapp">Typically reply within minutes →</div>
          </div>
        </a>

        <a href="tel:03394100052" className="flex items-center gap-3.5 rounded-[10px] border border-black/[0.04] bg-white px-5 py-[18px] shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
          </div>
          <div>
            <div className="font-heading text-[15px] font-semibold text-charcoal">Call Us</div>
            <div className="mt-0.5 text-[13px] text-[#888]">0339 4100052</div>
            <div className="mt-0.5 text-[11px] font-medium text-gold">Mon – Sat: 8 AM – 9 PM</div>
          </div>
        </a>

        <a href="mailto:comfyclub.pk@gmail.com" className="flex items-center gap-3.5 rounded-[10px] border border-black/[0.04] bg-white px-5 py-[18px] shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cream">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M3 9l9 6 9-6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <div className="font-heading text-[15px] font-semibold text-charcoal">Email Us</div>
            <div className="mt-0.5 text-[13px] text-[#888]">comfyclub.pk@gmail.com</div>
            <div className="mt-0.5 text-[11px] font-medium text-[#aaa]">We respond within 24 hours</div>
          </div>
        </a>
      </div>

      {/* Form */}
      <section className="px-5 py-9 md:px-10">
        <h2 className="mb-1 font-heading text-[22px] font-semibold text-charcoal">Send Us a Message</h2>
        <p className="mb-5 text-[13px] leading-relaxed text-[#888]">Fill in the form below and we&apos;ll get back to you at comfyclub.pk@gmail.com</p>
        <ContactForm />
      </section>

      {/* Workshop + map */}
      <section className="px-5 pb-9 md:px-10">
        <h2 className="mb-1 font-heading text-[22px] font-semibold text-charcoal">Visit Our Workshop</h2>
        <p className="mb-4 text-[13px] leading-relaxed text-[#888]">Come see and feel our furniture in person</p>
        <div className="mb-4 rounded-[10px] bg-cream p-5">
          <div className="mb-3.5 flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <div>
              <div className="font-heading text-[15px] font-semibold text-charcoal">ComfyClub Workshop</div>
              <div className="mt-1 text-sm leading-relaxed text-[#666]">Jan Muhammad Road, Nawab Town,<br />Lahore, Pakistan</div>
            </div>
          </div>
          <div className="mb-3.5 flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <div className="text-sm text-[#666]">Mon – Sat: 8:00 AM – 9:00 PM</div>
          </div>
          <a href="https://www.google.com/maps/place/31%C2%B027'01.2%22N+74%C2%B014'47.7%22E" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-[13px] font-semibold text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
            Get Directions
          </a>
        </div>
        <div className="h-[260px] overflow-hidden rounded-[10px] border border-[#D8D2C8]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3402.2!2d74.2466!3d31.4503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDI3JzAxLjIiTiA3NMKwMTQnNDcuNyJF!5e0!3m2!1sen!2spk!4v1"
            width="100%" height="260" style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" title="ComfyClub Workshop Location"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-10 md:px-10">
        <h2 className="mb-4 font-heading text-[22px] font-semibold text-charcoal">Common Questions</h2>
        {FAQS.map((faq) => (
          <details key={faq.q} className="group border-b border-black/[0.07]">
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-heading text-[15px] font-semibold text-charcoal">
              {faq.q}
              <span className="ml-3 flex-shrink-0 text-base text-[#ccc] group-open:rotate-45">+</span>
            </summary>
            <p className="pb-3.5 text-sm leading-relaxed text-[#777]">{faq.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
