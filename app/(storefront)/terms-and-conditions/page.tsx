import type { Metadata } from "next";
import PolicyPage from "@/components/storefront/PolicyPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | ComfyClub",
  description: "The terms and conditions for ordering handcrafted, made-to-order furniture from ComfyClub.",
};

export default function Page() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="These terms govern your use of the ComfyClub website and the purchase of our products. By placing an order with us, you agree to the terms below."
      sections={[
        { heading: "Ordering", body: ["Orders are placed and confirmed via WhatsApp or by contacting our team. Product images are representative; because items are handcrafted, slight natural variations in grain, colour and finish may occur."] },
        { heading: "Pricing & Payment", body: ["All prices are listed in Pakistani Rupees (PKR). A 60% advance is required to begin crafting your order, with the remaining 40% due on delivery, unless otherwise agreed.", "We accept bank transfer, JazzCash, EasyPaisa, and cash on delivery in select cities."] },
        { heading: "Made to Order", body: ["Each piece is built specifically for you after your order is confirmed. Production timelines are estimates and may vary slightly with order volume and customisation."] },
        { heading: "Warranty", body: ["Our furniture is built to last. Structural defects in materials or workmanship are covered — contact us with photos and we'll make it right. Normal wear and tear, misuse, or damage from improper care are not covered."] },
        { heading: "Custom Orders", body: ["Custom sizes, fabrics and colours are available on most products. Custom orders are confirmed in writing over WhatsApp and may be non-refundable once crafting begins."] },
        { heading: "Limitation of Liability", body: ["ComfyClub is not liable for indirect or incidental damages arising from the use of our products beyond the value of the product purchased."] },
        { heading: "Contact", body: ["For any questions about these terms, reach us at comfyclub.pk@gmail.com or 0339 4100052."] },
      ]}
    />
  );
}
