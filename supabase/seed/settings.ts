/**
 * Seed default site settings (business info, social links, WhatsApp templates,
 * homepage config). Values come from the Production Spec / API Spec §14.
 */
import { admin, log } from "./lib";

const SETTINGS: Record<string, unknown> = {
  business_info: {
    name: "ComfyClub",
    phone: "03394100052",
    email: "comfyclub.pk@gmail.com",
    address: "Al Jannat Street, Nasirabad Road, Behind Shell Fuel Station, Al Hamra Town, Lahore",
    coordinates: "31.4503,74.2466",
    hours: "8:00 AM – 9:00 PM",
  },
  social_links: {
    facebook: "https://www.facebook.com/comfyclublahore/",
    instagram: "https://www.instagram.com/comfyclub.pk/",
    tiktok: "https://www.tiktok.com/@comfyclub.pk",
    linkedin: "https://www.linkedin.com/company/comfyclub/",
    youtube: "https://www.youtube.com/@comfyclublahore",
  },
  whatsapp_templates: {
    order:
      "Hi, I'd like to order {product_name} ({sku}). Please share availability and delivery details.",
    quote: "Hi, I'd like a price quote for {product_name}.",
    consultation: "Hi, I'd like a consultation about {product_name}.",
    general: "Hi, I'd like to know more about your furniture collection.",
  },
  ga4_id: "",
  gtm_id: "",
  search_console_property: "https://comfyclub.pk",
  homepage_config: {
    section_order: [
      "hero",
      "trusted_by",
      "categories",
      "trending",
      "offers",
      "why",
      "how_it_works",
      "cta",
    ],
    hero_slides: [],
    trusted_by: [],
    pinned_trending: [],
    pinned_offers: [],
    why_items: [],
    how_steps: [],
  },
};

export async function seedSettings() {
  const db = admin();
  for (const [key, value] of Object.entries(SETTINGS)) {
    const { error } = await db
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) throw new Error(`setting ${key}: ${error.message}`);
  }
  log("settings", `${Object.keys(SETTINGS).length} settings keys upserted`);
}
