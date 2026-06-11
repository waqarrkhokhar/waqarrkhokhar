"use client";

import { waLink } from "@/lib/whatsapp";
import { whatsappOrder } from "@/components/storefront/ProductCard";

export default function OrderButton({
  product,
  message,
  className,
  children,
}: {
  product: { id: string; name: string };
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => whatsappOrder(product)}
      className={className}
    >
      {children}
    </a>
  );
}
