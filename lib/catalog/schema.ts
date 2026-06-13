import { z } from "zod";

const seoFields = {
  description: z.string().nullish(),
  banner_image: z.string().nullish(),
  meta_title: z.string().max(60).nullish(),
  meta_description: z.string().max(160).nullish(),
  focus_keyword: z.string().nullish(),
  canonical_url: z.string().url().nullish(),
  og_image: z.string().url().nullish(),
  robots: z.string().nullish(),
  sort_order: z.number().int().optional(),
  status: z.enum(["draft", "published"]).optional(),
};

/** SEO content sections stored in categories.seo_content (JSONB). */
export const seoContentSchema = z
  .object({
    whyBuy: z.string().nullish(),
    shopByRoom: z.string().nullish(),
    howToChoose: z.string().nullish(),
    bottomContent: z.string().nullish(),
    faqContent: z.string().nullish(),
  })
  .partial();

export const parentCreateSchema = z.object({
  name: z.string().min(2).max(100),
  ...seoFields,
});
export const parentUpdateSchema = parentCreateSchema.partial();

export const collectionCreateSchema = z.object({
  name: z.string().min(2).max(100),
  parent_id: z.string().uuid(),
  intro_content: z.string().nullish(),
  content_html: z.string().nullish(),
  seo_content: seoContentSchema.nullish(),
  schema_enabled: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  ...seoFields,
});
export const collectionUpdateSchema = collectionCreateSchema.partial();
