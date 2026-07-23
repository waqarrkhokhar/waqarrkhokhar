import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import BlogPostContent from "@/components/storefront/blog/BlogPostContent";

// Admin-only live preview of draft blog posts.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function BlogPreviewPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) notFound();
  return <BlogPostContent slug={params.slug} preview />;
}
