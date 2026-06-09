import { env } from "@/lib/env";

/** Build a wa.me click-to-chat URL with a pre-filled message. */
export function waLink(message: string): string {
  const number = env.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Format an integer PKR price. */
export function formatPrice(n: number | null | undefined): string {
  if (n == null) return "Price on Request";
  return `Rs ${n.toLocaleString("en-PK")}`;
}
