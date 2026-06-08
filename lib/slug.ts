/** URL-safe slug from a name (shared by products, collections, blog, pages). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Ensure a slug is unique within a table by appending -2, -3, … on collision.
 * `exists` checks whether a candidate is already taken (excluding `ignoreId`).
 */
export async function uniqueSlug(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const root = slugify(base) || "item";
  let candidate = root;
  let n = 2;
  while (await exists(candidate)) {
    candidate = `${root}-${n}`;
    n++;
  }
  return candidate;
}
