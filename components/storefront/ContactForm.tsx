"use client";

import { useState } from "react";
import { waLink } from "@/lib/whatsapp";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = f.name.trim() && f.email.trim() && f.message.trim();
  const field = "w-full rounded-md border border-[#D8D2C8] px-3.5 py-3 text-sm text-charcoal outline-none transition focus:border-gold";

  const waFallback = waLink(
    `Hi, I tried the contact form.\n\nName: ${f.name}\nEmail: ${f.email}${f.phone ? `\nPhone: ${f.phone}` : ""}${f.subject ? `\nSubject: ${f.subject}` : ""}\n\n${f.message}`,
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim() || null,
          subject: f.subject || null, message: f.message.trim(),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        // apiError returns { error: "<message>", code }, success returns { data }
        const msg = typeof j?.error === "string" ? j.error : j?.error?.message;
        throw new Error(msg || `Request failed (${res.status})`);
      }
      setSent(true);
      setF({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5">
      {sent && (
        <div className="flex items-center gap-2.5 rounded-lg border border-green-300 bg-green-100 px-5 py-4">
          <span className="text-xl">✓</span>
          <div>
            <div className="text-sm font-semibold text-green-800">Message Sent!</div>
            <div className="text-xs text-green-700">We&apos;ll get back to you within 24 hours.</div>
          </div>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-sale/10 px-4 py-3 text-sm text-sale">
          <p>{error}</p>
          <a href={waFallback} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-semibold text-whatsapp underline">
            Send this message on WhatsApp instead →
          </a>
        </div>
      )}

      <div className="grid gap-3.5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal">Full Name <span className="text-sale">*</span></label>
          <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" className={field} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal">Email <span className="text-sale">*</span></label>
          <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="your.email@example.com" className={field} />
        </div>
      </div>

      <div className="grid gap-3.5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal">Phone Number</label>
          <input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="03XX XXXXXXX" className={field} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal">Subject</label>
          <select value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} className={`${field} bg-white`}>
            <option value="">Select a topic</option>
            <option value="Order Inquiry">Order Inquiry</option>
            <option value="Product Information">Product Information</option>
            <option value="Custom Order / Quote">Custom Order / Quote</option>
            <option value="Shipping & Delivery">Shipping &amp; Delivery</option>
            <option value="Returns & Refunds">Returns &amp; Refunds</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-charcoal">Message <span className="text-sale">*</span></label>
        <textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Tell us how we can help..." rows={5} className={`${field} resize-y leading-relaxed`} />
      </div>

      <button type="submit" disabled={!valid || sending} className={`flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[15px] font-semibold text-white transition ${valid && !sending ? "bg-navy" : "cursor-not-allowed bg-[#D8D2C8]"}`}>
        {sending ? "Sending..." : "Send Message"}
        {!sending && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        )}
      </button>
    </form>
  );
}
