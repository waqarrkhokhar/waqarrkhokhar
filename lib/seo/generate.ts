/**
 * Generate sensible SEO meta from a product's own fields. Used to back-fill
 * products that have no meta title/description (e.g. after a CSV import that
 * didn't carry SEO columns). Pure, deterministic, server+client safe.
 *
 * Rules of thumb: meta title ≤ 60 chars, meta description 50–160 chars.
 */
const BRAND = "ComfyClub";

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
}

function clamp(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:-]+$/, "");
}

export function generateMetaTitle(name: string, categoryName?: string | null): string {
  const base = name.trim();
  // "Product Name | ComfyClub" — add category only if it still fits.
  const withBrand = `${base} | ${BRAND}`;
  if (withBrand.length <= 60) {
    const withCat = categoryName ? `${base} - ${categoryName} | ${BRAND}` : withBrand;
    return withCat.length <= 60 ? withCat : withBrand;
  }
  return clamp(base, 57) + "…";
}

export function generateMetaDescription(
  name: string,
  opts: { shortDescription?: string | null; categoryName?: string | null; price?: number | null } = {},
): string {
  const short = opts.shortDescription ? stripHtml(opts.shortDescription) : "";
  if (short.length >= 50) return clamp(short, 158);

  const cat = opts.categoryName ? ` ${opts.categoryName.toLowerCase()}` : " furniture";
  const priceBit = opts.price ? ` Starting at PKR ${opts.price.toLocaleString()}.` : "";
  const sentence =
    `${name} - handcrafted, made-to-order${cat} by ${BRAND} in Lahore.` +
    `${priceBit} Choose your fabric, colour and finish. Delivered across Pakistan.`;
  return clamp(sentence, 158);
}
