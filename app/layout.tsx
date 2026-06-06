import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
