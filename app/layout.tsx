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
  let base = siteUrl;
  const verification: Metadata["verification"] = {};
  const other: Record<string, string> = {};
  try {
    const { getPublicSettings } = await import("@/lib/settings");
    const s = await getPublicSettings(["search_console_verification", "site_url", "site_verifications"]);
    if (typeof s.site_url === "string" && /^https?:\/\//.test(s.site_url)) {
      base = s.site_url.replace(/\/$/, "");
    }
    // Site verification / ownership tags (each editable from Dashboard → SEO → Verification).
    // Every value is passed through cleanToken so even a value that was stored
    // "dirty" (e.g. a whole <meta> tag pasted in the past) renders as the
    // correct bare token — no re-save needed.
    const { cleanToken } = await import("@/lib/seo/verification");
    const v = (s.site_verifications ?? {}) as Record<string, string>;
    const legacyGoogle = typeof s.search_console_verification === "string" ? s.search_console_verification : "";
    const google = cleanToken("google", v.google || legacyGoogle);
    if (google) verification.google = google;
    if (v.yandex) verification.yandex = cleanToken("yandex", v.yandex);
    if (v.bing) other["msvalidate.01"] = cleanToken("bing", v.bing);
    if (v.pinterest) other["p:domain_verify"] = cleanToken("pinterest", v.pinterest);
    if (v.facebook) other["facebook-domain-verification"] = cleanToken("facebook", v.facebook);
    if (v.ahrefs) other["ahrefs-site-verification"] = cleanToken("ahrefs", v.ahrefs);
    if (v.norton) other["norton-safeweb-site-verification"] = cleanToken("norton", v.norton);
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
    // Favicon is rendered as an explicit <link> in the root <head> so it
    // applies to every page (metadata icons can be dropped by child routes).
    ...(Object.keys(verification).length ? { verification } : {}),
  };
}

/** Read GA4/GTM IDs from settings (safe — returns empty if unavailable). */
async function getAnalyticsIds(): Promise<{ ga4Id?: string; gtmId?: string }> {
  try {
    const { getPublicSettings } = await import("@/lib/settings");
    const s = await getPublicSettings(["ga4_id", "gtm_id"]);
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
    const { getPublicSettings } = await import("@/lib/settings");
    const s = await getPublicSettings(["custom_schemas"]);
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

/** Favicon URL from branding settings (rendered on every page's <head>). */
async function getFavicon(): Promise<string | undefined> {
  try {
    const { getPublicSettings } = await import("@/lib/settings");
    const s = await getPublicSettings(["branding"]);
    const branding = (s.branding ?? {}) as { favicon?: string };
    return typeof branding.favicon === "string" && branding.favicon ? branding.favicon : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Site-wide tracking scripts stored in `site_verifications`:
 *   • Microsoft Clarity project id (heatmaps + session recordings)
 *   • Meta / Facebook Pixel id (numeric)
 * Both are managed from Dashboard → SEO → Site Verification.
 */
async function getSiteScripts(): Promise<{ clarityId?: string; fbPixelId?: string }> {
  try {
    const { getPublicSettings } = await import("@/lib/settings");
    const s = await getPublicSettings(["site_verifications"]);
    const v = (s.site_verifications ?? {}) as Record<string, string>;
    const clarityId = v.clarity && /^[a-z0-9]+$/i.test(v.clarity) ? v.clarity : undefined;
    const fbPixelId = v.facebook_pixel && /^[0-9]+$/.test(v.facebook_pixel) ? v.facebook_pixel : undefined;
    return { clarityId, fbPixelId };
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ ga4Id, gtmId }, schemas, { clarityId, fbPixelId }, favicon] = await Promise.all([getAnalyticsIds(), getCustomSchemas(), getSiteScripts(), getFavicon()]);
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        {favicon && (
          <>
            {/* eslint-disable-next-line @next/next/no-head-element */}
            <link rel="icon" href={favicon} />
            <link rel="shortcut icon" href={favicon} />
            <link rel="apple-touch-icon" href={favicon} />
          </>
        )}
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
        {fbPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixelId}');fbq('track','PageView');`,
            }}
          />
        )}
      </head>
      <body className="font-body">
        {fbPixelId && (
          // eslint-disable-next-line @next/next/no-img-element
          <noscript><img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`} /></noscript>
        )}
        {children}
      </body>
      <GoogleAnalytics ga4Id={ga4Id} gtmId={gtmId} />
    </html>
  );
}
