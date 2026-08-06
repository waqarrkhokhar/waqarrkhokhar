import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { getHomepageData } from "@/lib/storefront/data";
import { cleanHref } from "@/lib/seo/href";
import { buildOg, ogDefaultImage } from "@/lib/seo/og";
import { getPublicSettings } from "@/lib/settings";
import HeroSlider, { type Slide } from "@/components/storefront/home/HeroSlider";
import CategorySlider from "@/components/storefront/home/CategorySlider";
import Stories, { type Story } from "@/components/storefront/home/Stories";
import {
  SectionHeading,
  ProductRow,
  TrustedBy,
  LimitedOffers,
  WhyComfyClub,
  HowItWorks,
  NeedHelpCTA,
} from "@/components/storefront/home/Sections";

export const revalidate = 300;

/** Homepage meta title/description — editable from Dashboard → SEO → Homepage SEO. */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = (await getPublicSettings(["home_seo"])).home_seo as { meta_title?: string; meta_description?: string } | null;
    const title = seo?.meta_title?.trim();
    const description = seo?.meta_description?.trim();
    const image = await ogDefaultImage();
    return {
      ...(title ? { title: { absolute: title } } : {}),
      ...(description ? { description } : {}),
      openGraph: buildOg({ path: "/", title, description, image, type: "website" }),
    };
  } catch {
    return {};
  }
}

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
  const { config, trending, offers, categories, feature, featureSofaCumBed } = await getHomepageData();

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

  const firstCat = cleanHref(categories[0]?.slug ?? "/");

  // Preload the first hero image — it's the LCP element, so start fetching it
  // during HTML parse instead of after the slider script mounts.
  if (slides[0]?.image) {
    ReactDOM.preload(slides[0].image, { as: "image", fetchPriority: "high" });
  }

  // Each builder-managed section keyed for ordering/visibility.
  const sectionNodes: Record<string, React.ReactNode> = {
    hero: <HeroSlider slides={slides} />,
    trusted_by: <TrustedBy clients={trusted} />,
    categories: (
      <section className="py-8">
        <SectionHeading title="Shop by Category" />
        <CategorySlider categories={categories} />
      </section>
    ),
    trending: <ProductRow title="Trending Now" subtitle="Our most popular pieces this month" viewAll={firstCat} products={trending} background="cream" />,
    offers: <LimitedOffers products={offers} />,
    why: <WhyComfyClub items={why} />,
    how_it_works: <HowItWorks steps={how} />,
    cta: <NeedHelpCTA />,
  };

  // "Making of" story videos (YouTube), managed in Dashboard → Homepage.
  const stories = (Array.isArray(config.stories) ? config.stories : []) as Story[];
  if (stories.length) sectionNodes.stories = <Stories stories={stories} />;

  // Default = the original prototype order. Only changes if you reorder/hide
  // sections in Dashboard → Homepage (which saves section_order).
  const DEFAULT_ORDER = ["hero", "trusted_by", "categories", "trending", "why", "offers", "cta", "stories", "how_it_works"];
  const rawOrder = Array.isArray(config.section_order) ? (config.section_order as string[]) : [];
  const order = rawOrder.filter((k) => k in sectionNodes);
  const finalOrder = [...(order.length ? order : DEFAULT_ORDER)];
  // Show newer sections (e.g. stories) even if the saved order predates them —
  // place the stories strip just before "How It Works" (after "Why ComfyClub").
  if (sectionNodes.stories && !finalOrder.includes("stories")) {
    const howIdx = finalOrder.indexOf("how_it_works");
    const whyIdx = finalOrder.indexOf("why");
    const at = howIdx >= 0 ? howIdx : whyIdx >= 0 ? whyIdx + 1 : finalOrder.length;
    finalOrder.splice(at, 0, "stories");
  }

  // The secondary featured collection rows sit right after the offers section
  // (their original position) unless offers is hidden, in which case they append.
  // Sofa Cum Beds comes before the 2-Seater Sofas row.
  const featureRow = (
    <>
      {featureSofaCumBed.products.length > 0 && (
        <ProductRow title={featureSofaCumBed.title} subtitle={featureSofaCumBed.subtitle} viewAll={featureSofaCumBed.link} products={featureSofaCumBed.products} background="cream" />
      )}
      {feature.products.length > 0 && (
        <ProductRow title={feature.title} subtitle={feature.subtitle} viewAll={feature.link} products={feature.products} />
      )}
    </>
  );

  return (
    <div>
      {finalOrder.map((key) => (
        <div key={key}>
          {sectionNodes[key]}
          {key === "offers" && featureRow}
        </div>
      ))}
      {!finalOrder.includes("offers") && featureRow}
    </div>
  );
}
