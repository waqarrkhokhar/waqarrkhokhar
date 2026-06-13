import type { Metadata } from "next";
import PolicyPage from "@/components/storefront/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | ComfyClub",
  description: "How ComfyClub ships handcrafted, made-to-order furniture across Pakistan — timelines, charges, packaging and delivery.",
};

export default function Page() {
  return (
    <PolicyPage
      title="Shipping & Delivery Policy"
      intro="Every ComfyClub piece is handcrafted to order at our Lahore workshop and shipped carefully across Pakistan. This policy explains our delivery timelines, charges and what to expect after you place an order."
      sections={[
        { heading: "Made to Order", body: ["Because each item is built after your order is confirmed, please allow time for crafting. We do not keep mass-produced stock — your furniture is made specifically for you."] },
        { heading: "Delivery Timeline", body: ["Most orders are handcrafted and delivered within 20–25 working days (about 2–3 weeks) from the date your order and advance payment are confirmed.", "Larger or fully custom orders may take a little longer. We'll always share an estimated timeline on WhatsApp before you confirm."] },
        { heading: "Delivery Areas & Charges", body: ["We ship to all major cities across Pakistan — including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan and Peshawar.", "Delivery charges depend on your location and the size of the item. We'll confirm any charges with you before dispatch."] },
        { heading: "Packaging", body: ["Each piece is carefully wrapped with protective material and corner guards to ensure it arrives in perfect condition."] },
        { heading: "Assembly", body: ["Most items arrive fully assembled and ready to use. For items that need light assembly, we provide guidance and assistance on request."] },
        { heading: "Tracking Your Order", body: ["We keep you updated at every stage over WhatsApp — from crafting to dispatch to delivery. Just message us anytime for a status update."] },
      ]}
    />
  );
}
