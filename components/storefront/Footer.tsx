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

const SOCIAL_KEYS = ["facebook", "instagram", "tiktok", "linkedin", "youtube"];

export default function Footer({
  nav,
  business,
  social,
}: {
  nav: NavParent[];
  business: Record<string, string>;
  social: Record<string, string>;
}) {
  const cols = nav.slice(0, 2); // first two parents become link columns

  return (
    <footer className="bg-navy px-5 pb-6 pt-10 text-white sm:px-10 sm:pt-12">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-heading text-[22px] font-semibold uppercase tracking-[2px] text-gold">ComfyClub</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/45">
          Pakistan&apos;s premium handcrafted furniture brand. We create sofas, chairs, and seating made to order
          using solid hardwood frames and premium upholstery — designed to last generations.
        </p>

        <div className="my-5 h-px bg-white/10" />

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {cols.map((p) => (
            <div key={p.id}>
              <h4 className="mb-3 text-[12.5px] uppercase tracking-wider text-gold">{p.name}</h4>
              <ul className="space-y-2">
                {p.children.map((c) => (
                  <li key={c.id}>
                    <Link href={c.slug} className="text-sm text-white/50 hover:text-white">{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-3 text-[12.5px] uppercase tracking-wider text-gold">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[12.5px] uppercase tracking-wider text-gold">Contact</h4>
            <ul className="space-y-2 text-sm text-white/50">
              {business.phone && <li>📞 {business.phone}</li>}
              {business.address && <li>📍 {business.address}</li>}
              {business.email && <li>✉️ {business.email}</li>}
            </ul>
          </div>
        </div>

        <div className="my-5 h-px bg-white/10" />

        {/* Social */}
        <div className="flex justify-center gap-4">
          {SOCIAL_KEYS.filter((k) => social[k]).map((k) => (
            <a
              key={k}
              href={social[k]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={k}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs uppercase text-white/60 hover:bg-white/20 hover:text-white"
            >
              {k[0]}
            </a>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-white/25">
          © {new Date().getFullYear()} ComfyClub · Lahore, Pakistan ·{" "}
          {business.hours ?? "Mon–Sat 8 AM – 9 PM"}
        </p>
      </div>
    </footer>
  );
}
