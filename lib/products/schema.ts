import { z } from "zod";

const status = z.enum(["draft", "published", "archived", "scheduled"]);

const base = z.object({
  name: z.string().min(3).max(200),
  slug: z.string().max(200).nullish(),
  sku: z.string().max(100).nullish(),
  price: z.number().int().positive().nullish(),
  sale_price: z.number().int().positive().nullish(),
  sale_start: z.string().datetime().nullish(),
  sale_end: z.string().datetime().nullish(),
  short_description: z.string().max(500).nullish(),
  long_description: z.string().nullish(),
  features: z.string().nullish(),
  category_id: z.string().uuid().nullish(),
  status: status.default("draft"),
  scheduled_at: z.string().datetime().nullish(),
  is_featured: z.boolean().optional(),
  is_bestseller: z.boolean().optional(),
  is_trending: z.boolean().optional(),
  meta_title: z.string().max(60).nullish(),
  meta_description: z.string().max(160).nullish(),
  focus_keyword: z.string().nullish(),
  secondary_keywords: z.array(z.string()).nullish(),
  canonical_url: z.string().url().nullish(),
  og_title: z.string().nullish(),
  og_description: z.string().nullish(),
  og_image: z.string().url().nullish(),
  robots: z.string().nullish(),
  whatsapp_message_template: z.string().nullish(),
});

const saleRule = (d: { sale_price?: number | null; price?: number | null }) =>
  !(d.sale_price && d.price) || d.sale_price < d.price;

/** Create payload (API Spec §2). Name required; the rest optional. */
export const productCreateSchema = base
  .refine(saleRule, {
    message: "Sale price must be less than the regular price",
    path: ["sale_price"],
  })
  .refine((d) => d.status !== "scheduled" || !!d.scheduled_at, {
    message: "A schedule date is required when status is 'scheduled'",
    path: ["scheduled_at"],
  });

/** Update payload — same fields, all optional. */
export const productUpdateSchema = base.partial().refine(saleRule, {
  message: "Sale price must be less than the regular price",
  path: ["sale_price"],
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
