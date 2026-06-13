import type { Metadata } from "next";
import PolicyPage from "@/components/storefront/PolicyPage";
import { html } from "@/lib/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | ComfyClub",
  description: "How ComfyClub collects, uses and protects your personal information.",
};

export default function Page() {
  return <PolicyPage title="Privacy Policy" html={html} />;
}
