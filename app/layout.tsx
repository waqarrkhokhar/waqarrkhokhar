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

// Default site-wide metadata + OG defaults. The canonical base URL and Search
// Console verification are pulled from settings so they're editable from the
// dashboard. A self-referencing canonical is applied to every page.
export async function generateMetadata(): Promise<Metadata> {
  let favicon: string | undefined;
  let base = siteUrl;
  const verification: Metadata["verification"] = {};
  const other: Record<string, string> = {};
  try {
    const { getSettings } = await import("@/lib/settings");
    const s = await getSettings(["search_console_verification", "site_url", "branding", "site_verifications"]);
    if (typeof s.site_url === "string" && /^https?:\/\//.test(s.site_url)) {
      base = s.site_url.replace(/\/$/, "");
    }
    const branding = (s.branding ?? {}) as { favicon?: string };
    if (typeof branding.favicon === "string" && branding.favicon) {
      favicon = branding.favicon;
    }
    // Site verification / ownership tags (each editable from Dashboard → SEO → Verification).
    const v = (s.site_verifications ?? {}) as Record<string, string>;
    const legacyGoogle = typeof s.search_console_verification === "string" ? s.search_console_verification : "";
    const google = v.google || legacyGoogle;
    if (google) verification.google = google;
    if (v.yandex) verification.yandex = v.yandex;
    if (v.bing) other["msvalidate.01"] = v.bing;
    if (v.pinterest) other["p:domain_verify"] = v.pinterest;
    if (v.facebook) other["facebook-domain-verification"] = v.facebook;
    if (v.ahrefs) other["ahrefs-site-verification"] = v.ahrefs;
    if (v.norton) other["norton-safeweb-site-verification"] = v.norton;
    if (Object.keys(other).length) verification.other = other;
  } catch {
    // settings unavailable — fall back to env site URL
  }
  return {
    metadataBase: new URL(base),
    title: {
      default: "ComfyClub — Handcrafted Furniture in Lahore",
      template: "%s | ComfyClub",
    },
    description:
      "ComfyClub crafts made-to-order sofas, sofa chairs, and furniture at our Lahore workshop. Choose your fabric, colour, and finish.",
    alternates: { canonical: "./" },
    openGraph: { type: "website", siteName: "ComfyClub", url: base },
    twitter: { card: "summary_large_image" },
    ...(favicon ? { icons: { icon: favicon, shortcut: favicon, apple: favicon } } : {}),
    ...(Object.keys(verification).length ? { verification } : {}),
  };
}

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

type CustomSchema = { id: string; name: string; type: string; json: string; enabled: boolean };

/** Site-wide custom JSON-LD blocks, managed from Dashboard → SEO → Schema. */
async function getCustomSchemas(): Promise<string[]> {
  try {
    const { getSettings } = await import("@/lib/settings");
    const s = await getSettings(["custom_schemas"]);
    const list = Array.isArray(s.custom_schemas) ? (s.custom_schemas as CustomSchema[]) : [];
    return list
      .filter((x) => x.enabled && x.json)
      .map((x) => {
        try {
          return JSON.stringify(JSON.parse(x.json)); // validate + minify
        } catch {
          return "";
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

/** Microsoft Clarity project id (analytics + heatmaps), from settings. */
async function getClarityId(): Promise<string | undefined> {
  try {
    const { getSettings } = await import("@/lib/settings");
    const s = await getSettings(["site_verifications"]);
    const v = (s.site_verifications ?? {}) as Record<string, string>;
    return v.clarity && /^[a-z0-9]+$/i.test(v.clarity) ? v.clarity : undefined;
  } catch {
    return undefined;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ ga4Id, gtmId }, schemas, clarityId] = await Promise.all([getAnalyticsIds(), getCustomSchemas(), getClarityId()]);
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        {schemas.map((s, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: s }} />
        ))}
        {clarityId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`,
            }}
          />
        )}
      </head>
      <body className="font-body">{children}</body>
      <GoogleAnalytics ga4Id={ga4Id} gtmId={gtmId} />
    </html>
  );
}
