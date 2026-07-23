/**
 * Normalise an internal link to its final, non-redirecting form.
 *
 * Category / parent slugs are stored in the database WITH a trailing slash
 * (e.g. "/sofas/sofa-come-bed/"), but the site serves every page WITHOUT one
 * (Next.js 308-redirects "/path/" -> "/path"). Linking straight to the slug
 * therefore points at a redirect, which Ahrefs/Google flag as "links to a
 * redirect" and which wastes crawl budget + link equity.
 *
 * cleanHref() drops the trailing slash so internal links hit the final URL
 * directly. External links (http…, mailto:, tel:, wa.me via full URL) and the
 * bare root "/" are returned untouched.
 */
export function cleanHref(path: string | null | undefined): string {
  if (!path) return "/";
  if (!path.startsWith("/")) return path; // external / non-path link
  const stripped = path.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}
