import type { Metadata } from "next";
import PolicyPage from "@/components/storefront/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | ComfyClub",
  description: "How ComfyClub collects, uses and protects your personal information.",
};

export default function Page() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="ComfyClub respects your privacy. This policy explains what information we collect when you contact us or place an order, how we use it, and the choices you have."
      sections={[
        { heading: "Information We Collect", body: ["When you contact us, submit a review, or place an order, we may collect your name, phone number, email address, delivery address and the details of your enquiry or order.", "We do not collect payment card details on this website — payments are arranged directly with our team."] },
        { heading: "How We Use Your Information", body: ["We use your information to respond to enquiries, process and deliver orders, provide customer support, and keep you updated about your order.", "With your interest, we may occasionally share offers or new collections. You can opt out at any time."] },
        { heading: "Sharing Your Information", body: ["We do not sell your personal information. We only share it with trusted partners where necessary to fulfil your order — for example, delivery couriers."] },
        { heading: "Analytics & Cookies", body: ["We use standard analytics (such as Google Analytics) to understand how visitors use our site so we can improve it. This may involve cookies, which you can control through your browser settings."] },
        { heading: "Data Security", body: ["We take reasonable measures to protect your information. Customer data is stored securely and access is limited to authorised team members."] },
        { heading: "Your Rights", body: ["You may request access to, correction of, or deletion of your personal information at any time by contacting us at comfyclub.pk@gmail.com."] },
      ]}
    />
  );
}
