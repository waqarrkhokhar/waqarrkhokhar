import type { Metadata } from "next";
import { env } from "@/lib/env";

export const OG_SITE = env.siteUrl.replace(/\/$/, "");

/** Absolute, non-trailing-slash URL for an internal path (og:url must be absolute). */
export function absUrl(path: string): string {
  if (!path || path === "/") return `${OG_SITE}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return OG_SITE + p.replace(/\/+$/, "");
}

/**
 * Site-wide fallback OG image (from Branding settings) for pages that have no
 * image of their own — so og:image is never missing. A dedicated og_image can
 * be set in Branding; otherwise the header/footer logo or favicon is used.
 */
export async function ogDefaultImage(): Promise<string | undefined> {
  try {
    const { getPublicSettings } = await import("@/lib/settings");
    const s = await getPublicSettings(["branding"]);
    const b = (s.branding ?? {}) as Record<string, string>;
    return b.og_image || b.header_logo || b.footer_logo || b.favicon || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Build a COMPLETE Open Graph object. Next.js replaces (not merges) a parent's
 * openGraph when a page sets its own, so every page must emit all four required
 * tags itself: og:title, og:type, og:url, og:image.
 */
export function buildOg(opts: {
  path: string;
  title?: string;
  description?: string;
  image?: string | null;
  type?: "website" | "article";
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: opts.type ?? "website",
    siteName: "ComfyClub",
    url: absUrl(opts.path),
    ...(opts.title ? { title: opts.title } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { images: [opts.image] } : {}),
  };
}
