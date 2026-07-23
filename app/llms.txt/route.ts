import { SITE } from "@/lib/seo/sitemap";
import { createPublicClient } from "@/lib/supabase/public";

// Cached hourly; lists the live published collections so LLMs get an accurate,
// up-to-date map of the site. Markdown with an H1 + links per the llms.txt spec.
export const revalidate = 3600;

export async function GET() {
  let cats: { name: string; slug: string }[] = [];
  try {
    const db = createPublicClient();
    const [{ data: parents }, { data: collections }] = await Promise.all([
      db.from("parent_categories").select("name, slug").eq("status", "published").is("deleted_at", null),
      db.from("categories").select("name, slug").eq("status", "published").is("deleted_at", null),
    ]);
    cats = [...(parents ?? []), ...(collections ?? [])] as { name: string; slug: string }[];
  } catch {
    // DB unavailable — still emit a valid file with the core links below.
  }

  const clean = (s: string) => s.replace(/\/+$/, "");
  const catLines = cats.map((c) => `- [${c.name}](${SITE}${clean(c.slug)})`).join("\n");

  const body = `# ComfyClub

ComfyClub is a made-to-order furniture brand in Lahore, Pakistan. We craft custom sofas, sofa chairs, sofa cum beds and seater sofa sets using solid hardwood frames and premium upholstery. Orders are placed and customised over WhatsApp.

## Main pages

- [Home](${SITE}/)
- [Blog](${SITE}/blog)
- [About Us](${SITE}/about-us)
- [Contact Us](${SITE}/contact-us)
${catLines ? `\n## Collections\n\n${catLines}\n` : ""}
## Policies

- [Shipping & Delivery](${SITE}/shipping-and-delivery-policy)
- [Returns & Refunds](${SITE}/returns-and-refunds-policy)
- [Privacy Policy](${SITE}/privacy-policy)
- [Terms & Conditions](${SITE}/terms-and-conditions)

## Sitemap

- [XML Sitemap](${SITE}/sitemap.xml)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
