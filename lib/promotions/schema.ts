import { z } from "zod";

export const promoSchema = z.object({
  title: z.string().min(2).max(150),
  type: z.enum(["announcement_bar", "popup", "hero_banner", "collection_banner"]),
  content: z.string().nullish(),
  cta_text: z.string().nullish(),
  cta_url: z.string().nullish(),
  background_color: z.string().nullish(),
  text_color: z.string().nullish(),
  image_url: z.string().nullish(),
  start_date: z.string().datetime().nullish(),
  end_date: z.string().datetime().nullish(),
  is_active: z.boolean().optional(),
  show_on_mobile: z.boolean().optional(),
  show_on_desktop: z.boolean().optional(),
  display_delay_seconds: z.number().int().min(0).optional(),
  display_frequency: z.enum(["every_visit", "once_per_session", "once_per_day"]).optional(),
});
