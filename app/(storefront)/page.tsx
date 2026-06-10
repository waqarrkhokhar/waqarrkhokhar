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

// Defaults reproduce the prototype; all editable from Dashboard → Homepage.
const DEFAULT_TRUSTED = [
  { name: "Bahria Town Lahore", href: "https://www.bahriatown.com/" },
  { name: "ATS Lahore", href: "https://www.atslhr.com/" },
  { name: "Kips College Lahore", href: "https://www.kips.edu.pk/" },
  { name: "NewsOne", href: "https://www.newsone.tv/" },
  { name: "Devour Lahore", href: "https://devour.com.pk/" },
  { name: "Five Star Foam", href: "https://www.fivestarfoam.com/" },
  { name: "Gul Ahmed", href: "https://www.gulahmedshop.com/" },
  { name: "RABAT Banquet Hall", href: null },
  { name: "Lake City Lahore", href: "https://www.lakecity.com.pk/" },
];
const DEFAULT_WHY = [
  { icon: "craft", title: "Handcrafted in Lahore", desc: "Every piece is made to order by skilled artisans" },
  { icon: "materials", title: "Premium Materials", desc: "Solid hardwood frames, high-density foam, premium fabrics" },
  { icon: "ship", title: "We Ship Across Pakistan", desc: "Delivered safely to your door, wherever you are" },
  { icon: "support", title: "WhatsApp Support", desc: "Chat with our furniture experts anytime" },
];
const DEFAULT_HOW = [
  { step: "01", title: "Browse & Choose", desc: "Explore our curated collections and find the piece that speaks to you" },
  { step: "02", title: "WhatsApp Us", desc: "Send us a message. Our experts will help with fabric, size, and customisation" },
  { step: "03", title: "Made to Order", desc: "Your furniture is handcrafted at our Lahore workshop by skilled artisans" },
  { step: "04", title: "Delivered to You", desc: "Carefully packaged and shipped across Pakistan to your doorstep" },
];

export default async function HomePage() {
  const { config, trending, offers, categories, feature } = await getHomepageData();

  const find = (slug: string) => categories.find((c) => c.slug === slug);

  // Hero slides: from config if set, else the prototype's three slides.
  const cfgSlides = (Array.isArray(config.hero_slides) ? config.hero_slides : []) as Slide[];
  const slides: Slide[] = cfgSlides.length
    ? cfgSlides
    : ([
        { image: find("/sofas/sofa-chair/")?.image ?? null, subtitle: "COMFYCLUB · LAHORE", title: "Furniture\nWorth Keeping", desc: "Handcrafted sofas & seating, made to order", cta: "Explore Collection", link: "/sofas/sofa-chair/" },
        { image: find("/seater-sofas/2-seater-sofas/")?.image ?? null, subtitle: "NEW COLLECTION", title: "2 Seater\nSofas", desc: "Compact luxury for every room in your home", cta: "Shop 2 Seaters", link: "/seater-sofas/2-seater-sofas/" },
        { image: find("/sofas/sofa-come-bed/")?.image ?? null, subtitle: "VERSATILE LIVING", title: "Sofa Cum\nBeds", desc: "Seating by day, sleeping by night. Made to order", cta: "View Collection", link: "/sofas/sofa-come-bed/" },
      ] as Slide[]);

  const trusted = Array.isArray(config.trusted_by) && config.trusted_by.length
    ? (config.trusted_by as { name: string; href?: string | null }[])
    : DEFAULT_TRUSTED;
  const why = Array.isArray(config.why_items) && config.why_items.length
    ? (config.why_items as { icon?: string; title: string; desc: string }[])
    : DEFAULT_WHY;
  const how = Array.isArray(config.how_steps) && config.how_steps.length
    ? (config.how_steps as { step: string; title: string; desc: string }[])
    : DEFAULT_HOW;

  const firstCat = categories[0]?.slug ?? "/";

  // Order matches the prototype exactly.
  return (
    <div>
      <HeroSlider slides={slides} />

      <TrustedBy clients={trusted} />

      <section className="py-8">
        <SectionHeading title="Shop by Category" />
        <CategorySlider categories={categories} />
      </section>

      <ProductRow title="Trending Now" subtitle="Our most popular pieces this month" viewAll={firstCat} products={trending} background="cream" />

      <WhyComfyClub items={why} />

      <LimitedOffers products={offers} />

      <ProductRow title={feature.title} subtitle={feature.subtitle} viewAll={feature.link} products={feature.products} />

      <NeedHelpCTA />

      <HowItWorks steps={how} />
    </div>
  );
}
