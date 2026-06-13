import { env } from "@/lib/env";

/** Build a wa.me click-to-chat URL with a pre-filled message. */
export function waLink(message: string): string {
  const number = env.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Public URL for a product (used to attach the link to WhatsApp messages). */
export function productUrl(slug: string): string {
  const base = (env.siteUrl || "https://comfyclub.pk").replace(/\/$/, "");
  return `${base}/product/${slug}/`;
}

/** Pre-filled WhatsApp message for a product enquiry, with the product link. */
export function waProductMessage(name: string, slug: string, intro?: string): string {
  const msg = intro ?? `Hi, I'm interested in ${name}. Can you share more details?`;
  return `${msg}\n\n${productUrl(slug)}`;
}

/** Format an integer PKR price. */
export function formatPrice(n: number | null | undefined): string {
  if (n == null) return "Price on Request";
  return `Rs ${n.toLocaleString("en-PK")}`;
}
