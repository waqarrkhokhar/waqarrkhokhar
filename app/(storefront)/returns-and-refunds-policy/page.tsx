import type { Metadata } from "next";
import PolicyPage from "@/components/storefront/PolicyPage";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy | ComfyClub",
  description: "ComfyClub's returns and refunds policy for handcrafted, made-to-order furniture — damaged items, cancellations and how to raise a claim.",
};

export default function Page() {
  return (
    <PolicyPage
      title="Returns & Refunds Policy"
      intro="Your satisfaction matters to us. Because our furniture is handcrafted to order, our returns policy is designed to be fair to both you and our artisans. Please read the details below."
      sections={[
        { heading: "Made-to-Order Items", body: ["As each piece is custom-built for you after your order is confirmed, we are generally unable to accept returns simply due to a change of mind. We encourage you to confirm fabric, colour and dimensions with our team before ordering."] },
        { heading: "Damaged or Defective Items", body: ["If your item arrives damaged or with a manufacturing defect, please contact us within 48 hours of delivery with photos. We will repair, replace or resolve the issue at no extra cost to you."] },
        { heading: "Order Cancellations", body: ["Orders can be cancelled before crafting begins for a full refund of any advance paid. Once crafting has started, the advance may be non-refundable as materials and labour have been committed."] },
        { heading: "Refund Process", body: ["Approved refunds are processed to your original payment method (bank transfer, JazzCash or EasyPaisa) within 7–10 working days of confirmation."] },
        { heading: "How to Raise a Claim", body: ["Message us on WhatsApp at 0339 4100052 or email comfyclub.pk@gmail.com with your order details and photos. Our team will guide you through the next steps."] },
      ]}
    />
  );
}
