import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://comfyclub.pk";

// Default site-wide metadata + OG defaults (per-page metadata added in later phases).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ComfyClub — Handcrafted Furniture in Lahore",
    template: "%s | ComfyClub",
  },
  description:
    "ComfyClub crafts made-to-order sofas, sofa chairs, and furniture at our Lahore workshop. Choose your fabric, colour, and finish.",
  openGraph: {
    type: "website",
    siteName: "ComfyClub",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
};

/** Read GA4/GTM IDs from settings (safe — returns empty if unavailable). */
async function getAnalyticsIds(): Promise<{ ga4Id?: string; gtmId?: string }> {
  try {
    const { getSettings } = await import("@/lib/settings");
    const s = await getSettings(["ga4_id", "gtm_id"]);
    return {
      ga4Id: typeof s.ga4_id === "string" && s.ga4_id ? s.ga4_id : undefined,
      gtmId: typeof s.gtm_id === "string" && s.gtm_id ? s.gtm_id : undefined,
    };
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ga4Id, gtmId } = await getAnalyticsIds();
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-body">{children}</body>
      <GoogleAnalytics ga4Id={ga4Id} gtmId={gtmId} />
    </html>
  );
}
