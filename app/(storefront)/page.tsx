import { getHomepageData } from "@/lib/storefront/data";
import HeroSlider, { type Slide } from "@/components/storefront/home/HeroSlider";
import CategorySlider from "@/components/storefront/home/CategorySlider";
import {
  SectionHeading,
  ProductRow,
  TrustedBy,
  LimitedOffers,
  WhyComfyClub,
  HowItWorks,
  NeedHelpCTA,
} from "@/components/storefront/home/Sections";

export const dynamic = "force-dynamic";

// Sensible defaults shown when the Homepage Builder hasn't been filled in yet
// (all editable from Dashboard → Homepage).
const DEFAULT_TRUSTED = [
  "Bahria Town Lahore", "ATS Lahore", "Kips College Lahore", "NewsOne",
  "Devour Lahore", "Five Star Foam", "Gul Ahmed", "Lake City Lahore",
];
const DEFAULT_WHY = [
  { title: "Handcrafted in Lahore", desc: "Every piece is made to order by skilled artisans." },
  { title: "Premium Materials", desc: "Solid hardwood frames, high-density foam, premium fabrics." },
  { title: "We Ship Across Pakistan", desc: "Delivered safely to your door, wherever you are." },
  { title: "WhatsApp Support", desc: "Chat with our furniture experts anytime." },
];
const DEFAULT_HOW = [
  { step: "01", title: "Browse & Choose", desc: "Explore our curated collections and find the piece that speaks to you." },
  { step: "02", title: "WhatsApp Us", desc: "Send us a message — our experts help with fabric, size, and customisation." },
  { step: "03", title: "Made to Order", desc: "Your furniture is handcrafted at our Lahore workshop by skilled artisans." },
  { step: "04", title: "Delivered to You", desc: "Carefully packaged and shipped across Pakistan to your doorstep." },
];

export default async function HomePage() {
  const { config, trending, offers, categories } = await getHomepageData();

  const order = (Array.isArray(config.section_order) && config.section_order.length
    ? config.section_order
    : ["hero", "trusted_by", "categories", "trending", "offers", "why", "how_it_works", "cta"]) as string[];

  // Hero slides: from config, else fall back to the top published collections.
  const cfgSlides = (Array.isArray(config.hero_slides) ? config.hero_slides : []) as Slide[];
  const slides: Slide[] = cfgSlides.length
    ? cfgSlides
    : categories.slice(0, 3).map((c) => ({
        image: c.image,
        subtitle: "ComfyClub · Lahore",
        title: c.name,
        desc: "Handcrafted sofas & seating, made to order.",
        cta: "Explore Collection",
        link: c.slug,
      }));

  const trusted = (Array.isArray(config.trusted_by) && config.trusted_by.length
    ? (config.trusted_by as { name: string }[]).map((t) => t.name)
    : DEFAULT_TRUSTED);
  const why = (Array.isArray(config.why_items) && config.why_items.length
    ? (config.why_items as { title: string; desc: string }[])
    : DEFAULT_WHY);
  const how = (Array.isArray(config.how_steps) && config.how_steps.length
    ? (config.how_steps as { step: string; title: string; desc: string }[])
    : DEFAULT_HOW);

  const firstCat = categories[0]?.slug;

  const blocks: Record<string, React.ReactNode> = {
    hero: <HeroSlider key="hero" slides={slides} />,
    trusted_by: <TrustedBy key="trusted" clients={trusted} />,
    categories: (
      <section key="cats" className="py-8">
        <SectionHeading title="Shop by Category" />
        <CategorySlider categories={categories} />
      </section>
    ),
    trending: <ProductRow key="trend" title="Trending Now" subtitle="Our most popular pieces this month" viewAll={firstCat} products={trending} />,
    offers: <LimitedOffers key="offers" products={offers} />,
    why: <WhyComfyClub key="why" items={why} />,
    how_it_works: <HowItWorks key="how" steps={how} />,
    cta: <NeedHelpCTA key="cta" />,
  };

  return <>{order.map((k) => blocks[k]).filter(Boolean)}</>;
}
