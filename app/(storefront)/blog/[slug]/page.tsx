import type { Metadata } from "next";
import { getBlogPost } from "@/lib/storefront/blog";
import { createPublicClient } from "@/lib/supabase/public";
import { buildOg, ogDefaultImage } from "@/lib/seo/og";
import BlogPostContent from "@/components/storefront/blog/BlogPostContent";

export const revalidate = 300;

/** Pre-render every published blog post at build. */
export async function generateStaticParams() {
  try {
    const db = createPublicClient();
    const { data } = await db.from("blog_posts").select("slug").eq("status", "published").is("deleted_at", null);
    return (data ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getBlogPost(params.slug);
  if (!p) return { title: "Post not found" };
  const title = p.meta_title || `${p.title} | ComfyClub`;
  const description = p.meta_description || p.excerpt || `${p.title} — ComfyClub Journal.`;
  const noindex = !!p.robots && /noindex/i.test(p.robots);
  const image = p.featured_image || (await ogDefaultImage());
  return {
    title,
    description,
    robots: noindex ? { index: false, follow: true } : undefined,
    // Explicit self-referencing canonical (no trailing slash — matches the served URL).
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: buildOg({ path: `/blog/${params.slug}`, title: p.og_title || title, description: p.og_description || description, image, type: "article" }),
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostContent slug={params.slug} preview={false} />;
}
