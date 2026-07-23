import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import ProductPageContent from "@/components/storefront/product/ProductPageContent";

// Admin-only live preview of drafts. Dynamic + noindex + auth-gated. The public
// /product/[slug] route stays cached; only this route renders on demand.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ProductPreviewPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) notFound();
  return <ProductPageContent slug={params.slug} preview />;
}
