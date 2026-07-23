import type { Metadata } from "next";
import { getBlogPost } from "@/lib/storefront/blog";
import { createPublicClient } from "@/lib/supabase/public";
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
  return {
    title,
    description,
    robots: noindex ? { index: false, follow: true } : undefined,
    // Explicit self-referencing canonical (no trailing slash — matches the served URL).
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: { title: p.og_title || title, description: p.og_description || description, images: p.featured_image ? [p.featured_image] : undefined, type: "article" },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostContent slug={params.slug} preview={false} />;
}
