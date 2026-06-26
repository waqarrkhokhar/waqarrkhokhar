import type { Metadata } from "next";

/**
 * Turn a stored robots directive (e.g. "noindex, follow") into Next.js
 * Metadata.robots. Returns undefined for the default "index, follow" so we
 * don't emit a redundant tag on every page.
 */
export function robotsMeta(robots: string | null | undefined): Metadata["robots"] {
  if (!robots) return undefined;
  const r = robots.toLowerCase();
  const noindex = /noindex/.test(r);
  const nofollow = /nofollow/.test(r);
  if (!noindex && !nofollow) return undefined;
  return { index: !noindex, follow: !nofollow };
}
