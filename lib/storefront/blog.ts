import { createClient } from "@/lib/supabase/server";

export type BlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  featured_image: string | null;
  published_at: string | null;
  read_minutes: number;
};

export type BlogPostFull = BlogCard & {
  content: string | null;
  author: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  robots: string | null;
  faqs: { q: string; a: string }[];
};

const readTime = (content: string | null) =>
  Math.max(1, Math.ceil((content ? content.split(/\s+/).filter(Boolean).length : 0) / 200));

/** Published posts for the /blog listing. */
export async function getBlogList(): Promise<BlogCard[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, featured_image, content, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(60);
  return (data ?? []).map((p) => ({
    id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, category: p.category,
    featured_image: p.featured_image, published_at: p.published_at, read_minutes: readTime(p.content),
  }));
}

/** A single published post for /blog/[slug]. */
export async function getBlogPost(slug: string): Promise<BlogPostFull | null> {
  const supabase = createClient();
  const { data: p } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!p) return null;
  return {
    id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, category: p.category,
    featured_image: p.featured_image, published_at: p.published_at, read_minutes: readTime(p.content),
    content: p.content, author: p.author, meta_title: p.meta_title, meta_description: p.meta_description,
    og_title: p.og_title, og_description: p.og_description, robots: p.robots,
    faqs: Array.isArray(p.faqs) ? (p.faqs as { q: string; a: string }[]) : [],
  };
}

/** Up to 3 other posts for the "More Articles" section. */
export async function getMorePosts(excludeSlug: string): Promise<BlogCard[]> {
  const all = await getBlogList();
  return all.filter((p) => p.slug !== excludeSlug).slice(0, 3);
}
