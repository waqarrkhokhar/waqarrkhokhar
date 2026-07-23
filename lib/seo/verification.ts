/**
 * Verification / tracking code sanitiser.
 *
 * Store owners almost always paste MORE than the bare token — the whole
 * snippet a tool shows them:
 *   • a full tag  <meta name="google-site-verification" content="ABC123" />
 *   • a name=value line  google-site-verification=ABC123
 *   • a value wrapped in quotes or padded with spaces / newlines
 *
 * Rendering any of those verbatim produces a broken <meta> tag on the live
 * site, and the tool then reports "your meta tag is incorrect / for a different
 * account". cleanToken() pulls JUST the token out of whatever was pasted, for
 * every provider, so the value we store and render is always correct.
 *
 * Pure + dependency-free → safe to import in both server and client code.
 */

export type VerifKey =
  | "google"
  | "bing"
  | "clarity"
  | "pinterest"
  | "facebook"
  | "yandex"
  | "ahrefs"
  | "norton"
  | "facebook_pixel";

export function cleanToken(key: VerifKey, raw: string): string {
  let s = (raw ?? "").trim();
  if (!s) return "";

  // 1) Full <meta ... content="X" ...> tag → pull the content value.
  const contentMatch = s.match(/content\s*=\s*["']([^"']+)["']/i);
  if (contentMatch) {
    s = contentMatch[1];
  } else {
    // 2) name=value / name: value forms (e.g. "google-site-verification=ABC",
    //    "msvalidate.01: ABC"). Only strips a recognisable key prefix, so a
    //    bare token (which has no leading "key=") passes through untouched.
    const kv = s.match(/^[a-z0-9._-]+\s*[=:]\s*(.+)$/i);
    if (kv) s = kv[1];
  }

  // 3) Remove any stray wrapping quotes / angle brackets / whitespace.
  s = s.replace(/^["'<>\s]+|["'<>\s]+$/g, "").trim();

  // 4) Per-provider normalisation.
  if (key === "clarity") return s.replace(/[^a-z0-9]/gi, ""); // Clarity project id
  if (key === "facebook_pixel") return s.replace(/[^0-9]/g, ""); // numeric Pixel id
  return s;
}
