import type { Metadata } from "next";
import PolicyPage from "@/components/storefront/PolicyPage";
import { html } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions | ComfyClub",
  description: "The terms and conditions for ordering handcrafted, made-to-order furniture from ComfyClub.",
};

export default function Page() {
  return <PolicyPage title="Terms & Conditions" html={html} />;
}
