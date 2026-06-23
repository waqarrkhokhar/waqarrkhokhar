/**
 * Sanitize a free-text search term before it is interpolated into a PostgREST
 * `.or("col.ilike.%term%,...")` filter string. Strips the characters that have
 * structural meaning in a PostgREST filter (comma, parentheses, dot, colon,
 * asterisk, backslash) and the LIKE wildcards, then caps the length. This
 * prevents filter-injection on the public search endpoint while leaving normal
 * words, numbers, spaces and hyphens intact.
 */
export function sanitizeSearchTerm(input: string): string {
  return input
    .replace(/[,()*\\:.%]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}
