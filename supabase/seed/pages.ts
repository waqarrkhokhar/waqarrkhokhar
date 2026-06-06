/**
 * Seed the 6 core/policy pages (Production Spec §10). Content is minimal
 * placeholder text — full copy is authored from the dashboard in Phase 8/14.
 * The pages exist so their routes resolve and they are editable in the CMS.
 */
import { admin, log } from "./lib";

type PageSeed = {
  title: string;
  slug: string;
  type: "core" | "policy";
};

const PAGES: PageSeed[] = [
  { title: "Contact Us", slug: "/contact-us/", type: "core" },
  { title: "About Us", slug: "/about-us/", type: "core" },
  { title: "Shipping & Delivery Policy", slug: "/shipping-and-delivery-policy/", type: "policy" },
  { title: "Returns & Refunds Policy", slug: "/returns-and-refunds-policy/", type: "policy" },
  { title: "Privacy Policy", slug: "/privacy-policy/", type: "policy" },
  { title: "Terms & Conditions", slug: "/terms-and-conditions/", type: "policy" },
];

export async function seedPages() {
  const db = admin();
  for (const p of PAGES) {
    const { error } = await db.from("pages").upsert(
      {
        title: p.title,
        slug: p.slug,
        type: p.type,
        content: `<p>${p.title} content — edit this from the dashboard.</p>`,
        status: "published",
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`page ${p.slug}: ${error.message}`);
  }
  log("pages", `${PAGES.length} core/policy pages upserted`);
}
