import { z } from "zod";

export const BLOG_CATEGORIES = [
  "Buying Guides",
  "Interior Design",
  "Home Styling",
  "Furniture Care",
  "Trends",
] as const;

const faq = z.object({ q: z.string(), a: z.string() });
const internalLink = z.object({ type: z.string(), name: z.string(), url: z.string() });

const base = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().max(200).nullish(),
  content: z.string().min(1).nullish(),
  excerpt: z.string().max(300).nullish(),
  featured_image: z.string().nullish(),
  category: z.enum(BLOG_CATEGORIES),
  tags: z.array(z.string()).nullish(),
  author: z.string().nullish(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  scheduled_at: z.string().datetime().nullish(),
  meta_title: z.string().max(60).nullish(),
  meta_description: z.string().max(160).nullish(),
  focus_keyword: z.string().nullish(),
  canonical_url: z.string().url().nullish(),
  og_title: z.string().nullish(),
  og_description: z.string().nullish(),
  robots: z.string().nullish(),
  faqs: z.array(faq).nullish(),
  internal_links: z.array(internalLink).nullish(),
});

export const blogCreateSchema = base.refine(
  (d) => d.status !== "scheduled" || !!d.scheduled_at,
  { message: "A schedule date is required when status is 'scheduled'", path: ["scheduled_at"] },
);
export const blogUpdateSchema = base.partial();
