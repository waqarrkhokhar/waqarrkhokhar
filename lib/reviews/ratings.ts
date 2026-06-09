import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Refresh the product_ratings materialized view after a review status change.
 * Best-effort: if the DB role lacks refresh privilege the storefront simply
 * shows slightly stale aggregates until the next refresh (storefront ratings
 * are finalised in Phase 13).
 */
export async function refreshRatings() {
  try {
    await createAdminClient().rpc("refresh_product_ratings");
  } catch {
    // ignore — moderation must not fail on a view refresh
  }
}
