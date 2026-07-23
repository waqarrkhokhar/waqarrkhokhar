import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/storefront/data";
import { createPublicClient } from "@/lib/supabase/public";
import { robotsMeta } from "@/lib/seo/robots";
import CategoryPageContent, { toPath } from "@/components/storefront/CategoryPageContent";

export const revalidate = 300;

/** Pre-render every published parent + collection page at build. */
export async function generateStaticParams() {
  try {
    const db = createPublicClient();
    const [{ data: parents }, { data: collections }] = await Promise.all([
      db.from("parent_categories").select("slug").eq("status", "published").is("deleted_at", null),
      db.from("categories").select("slug").eq("status", "published").is("deleted_at", null),
    ]);
    const slugs = [...(parents ?? []), ...(collections ?? [])].map((r) => r.slug as string);
    return slugs.map((s) => ({ path: s.replace(/^\/+|\/+$/g, "").split("/") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { path: string[] } }): Promise<Metadata> {
  const page = await getCategoryPage(toPath(params.path));
  if (!page) return { title: "Not found" };
  const title = page.meta_title || `${page.name} | ComfyClub`;
  const description = page.meta_description || page.description || `Browse ${page.name} — handcrafted, made to order in Lahore by ComfyClub.`;
  const image = page.banner_image || undefined;
  // Explicit self-referencing canonical (no trailing slash — matches the served
  // URL) so parent/child category pages aren't deduplicated by Google.
  const canonical = "/" + params.path.map((s) => decodeURIComponent(s)).join("/");
  return { title, description, robots: robotsMeta(page.robots), alternates: { canonical }, openGraph: { title, description, images: image ? [image] : undefined } };
}

export default function CategoryPage({ params }: { params: { path: string[] } }) {
  return <CategoryPageContent path={params.path} preview={false} />;
}
