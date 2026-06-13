import type { Metadata } from "next";
import PolicyPage from "@/components/storefront/PolicyPage";
import { html } from "@/lib/legal/shipping";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | ComfyClub",
  description: "How ComfyClub ships handcrafted, made-to-order furniture across Pakistan — timelines, charges, packaging and delivery.",
};

export default function Page() {
  return <PolicyPage title="Shipping & Delivery Policy" html={html} />;
}
