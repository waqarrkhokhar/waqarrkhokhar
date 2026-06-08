/**
 * SEO score (0–100) per the Production Spec §7 formula. Pure function, usable
 * on client and server. Reused by the product/blog/page editors and the
 * Phase 6 bulk SEO tools.
 */
export type SeoScoreInput = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  contentWordCount?: number;
  minWords?: number; // 100 for products, 300 for pages/blog
  schemaEnabled?: boolean;
  ogImage?: string | null;
  canonical?: string | null;
  internalLinks?: number;
};

export type SeoCheck = { label: string; points: number; passed: boolean };

export function computeSeoScore(input: SeoScoreInput): {
  score: number;
  checks: SeoCheck[];
} {
  const title = (input.metaTitle ?? "").trim();
  const desc = (input.metaDescription ?? "").trim();
  const kw = (input.focusKeyword ?? "").trim().toLowerCase();
  const minWords = input.minWords ?? 100;

  const checks: SeoCheck[] = [
    { label: "Meta title set (≤ 60 chars)", points: 15, passed: title.length > 0 && title.length <= 60 },
    { label: "Meta description set (50–160 chars)", points: 15, passed: desc.length >= 50 && desc.length <= 160 },
    { label: "Focus keyword defined", points: 15, passed: kw.length > 0 },
    { label: "Focus keyword in meta title", points: 10, passed: kw.length > 0 && title.toLowerCase().includes(kw) },
    { label: "Focus keyword in meta description", points: 10, passed: kw.length > 0 && desc.toLowerCase().includes(kw) },
    { label: `Content length adequate (> ${minWords} words)`, points: 10, passed: (input.contentWordCount ?? 0) > minWords },
    { label: "Schema markup enabled", points: 10, passed: !!input.schemaEnabled },
    { label: "OG image set", points: 5, passed: !!(input.ogImage ?? "").trim() },
    { label: "Canonical URL set", points: 5, passed: !!(input.canonical ?? "").trim() },
    { label: "At least 1 internal link", points: 5, passed: (input.internalLinks ?? 0) >= 1 },
  ];

  const score = checks.reduce((s, c) => s + (c.passed ? c.points : 0), 0);
  return { score, checks };
}

export function countWords(...texts: Array<string | null | undefined>): number {
  return texts
    .map((t) => (t ?? "").replace(/<[^>]*>/g, " ").trim())
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}
