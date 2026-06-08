import { revalidatePath } from "next/cache";

/**
 * Refresh cached storefront pages affected by a product change.
 * The product/collection pages arrive in Phase 13; calling revalidatePath for
 * routes that don't exist yet is a safe no-op, so this is wired now.
 */
export function revalidateProduct(slug: string, collectionSlug?: string | null) {
  try {
    revalidatePath(`/product/${slug}`);
    revalidatePath("/");
    if (collectionSlug) revalidatePath(collectionSlug);
  } catch {
    // ignore — caches simply rebuild on next request
  }
}
