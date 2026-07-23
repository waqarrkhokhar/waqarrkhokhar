import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import CategoryPageContent from "@/components/storefront/CategoryPageContent";

// Admin-only live preview of draft category/collection pages.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CategoryPreviewPage({ params }: { params: { path: string[] } }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) notFound();
  return <CategoryPageContent path={params.path} preview />;
}
