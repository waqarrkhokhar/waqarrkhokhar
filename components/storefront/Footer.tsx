import Link from "next/link";
import type { NavParent } from "@/lib/storefront/data";

const QUICK_LINKS = [
  ["About Us", "/about-us/"],
  ["Blog", "/blog/"],
  ["Contact Us", "/contact-us/"],
  ["Shipping & Delivery", "/shipping-and-delivery-policy/"],
  ["Returns & Refunds", "/returns-and-refunds-policy/"],
  ["Privacy Policy", "/privacy-policy/"],
  ["Terms & Conditions", "/terms-and-conditions/"],
];

// Full menu per the design. Items render as links only when the collection
// actually exists; the rest show as plain text (no dead links).
const SOFAS_MENU = [
  ["Sofa Chairs", "/sofas/sofa-chair/"],
  ["Sofa Cum Beds", "/sofas/sofa-come-bed/"],
  ["L Shape Sofas", "/sofas/l-shape-sofas/"],
  ["Deewan Sofas", "/sofas/deewan-sofas/"],
  ["Settee Sofas", "/sofas/settee-sofas/"],
  ["Ottoman Sofas", "/sofas/ottoman-sofas/"],
];
const SEATER_MENU = [
  ["2 Seater Sofas", "/seater-sofas/2-seater-sofas/"],
  ["3 Seater Sofas", "/seater-sofas/3-seater-sofas/"],
  ["4 Seater Sofas", "/seater-sofas/4-seater-sofas/"],
  ["5 Seater Sofas", "/seater-sofas/5-seater-sofas/"],
  ["6 Seater Sofas", "/seater-sofas/6-seater-sofas/"],
];

const SOCIALS: { key: string; label: string; href: string; path: React.ReactNode }[] = [
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/comfyclublahore/", path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/comfyclub.pk/", path: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></> },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@comfyclub.pk", path: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /> },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/comfyclub/", path: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></> },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@comfyclublahore", path: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></> },
];

export default function Footer({
  nav,
  business,
  social,
}: {
  nav: NavParent[];
  business: Record<string, string>;
  social: Record<string, string>;
}) {
  const existing = new Set(nav.flatMap((p) => p.children.map((c) => c.slug)));
  const menuItem = ([label, slug]: string[]) =>
    existing.has(slug) ? (
      <li key={slug}><Link href={slug} className="text-sm text-white/50 hover:text-white">{label}</Link></li>
    ) : (
      <li key={slug}><span className="text-sm text-white/40">{label}</span></li>
    );
  const phone = business.phone || business.whatsapp || "+92 339 410 0052";
  const email = business.email || "comfyclub.pk@gmail.com";
  const address = business.address || "Jan Muhammad Road, Nawab Town, Lahore";

  return (
    <footer className="bg-navy px-5 pb-6 pt-10 text-white sm:px-10 sm:pt-12">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-heading text-[22px] font-semibold uppercase tracking-[2px] text-gold">ComfyClub</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/45">
          Pakistan&apos;s premium handcrafted furniture brand. We create sofas, chairs, and seating made to order
          using solid hardwood frames and premium upholstery — designed to last generations.
        </p>

        <div className="my-5 h-px bg-white/10" />

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-[12.5px] uppercase tracking-wider text-gold">Sofas</h4>
            <ul className="space-y-2.5">{SOFAS_MENU.map(menuItem)}</ul>
          </div>
          <div>
            <h4 className="mb-3 text-[12.5px] uppercase tracking-wider text-gold">Seater Sofas</h4>
            <ul className="space-y-2.5">{SEATER_MENU.map(menuItem)}</ul>
          </div>

          <div>
            <h4 className="mb-3 text-[12.5px] uppercase tracking-wider text-gold">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-white/50 hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[12.5px] uppercase tracking-wider text-gold">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{address}</span>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-5 h-px bg-white/10" />

        {/* Google Reviews badge */}
        <a href="https://share.google/JuOpyMoYl9RjLjtRs" target="_blank" rel="noopener noreferrer"
          className="mx-auto mb-4 flex max-w-md items-center justify-center gap-2.5 rounded-lg bg-white/5 px-5 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-base font-bold text-white">4.8</span>
          <span className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= 4 ? "#FBBC05" : "none"} stroke="#FBBC05" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            ))}
          </span>
          <span className="text-xs text-white/45">(32 reviews)</span>
          <span className="ml-1 text-[11px] font-medium text-gold">Google Reviews →</span>
        </a>

        {/* Social icons */}
        <div className="mb-4 flex justify-center gap-4">
          {SOCIALS.map((s) => (
            <a key={s.key} href={social[s.key] || s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] transition hover:bg-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{s.path}</svg>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-white/25">
          © {new Date().getFullYear()} ComfyClub · Lahore, Pakistan · {business.hours ?? "Mon–Sat 8 AM – 9 PM"}
        </p>
      </div>
    </footer>
  );
}
