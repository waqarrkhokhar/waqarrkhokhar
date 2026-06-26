import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { can } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/notifications — unread counts for the notification bell, scoped to
 * what the current user is allowed to see: pending reviews, new WhatsApp leads
 * and unresolved 404s. Each count is 0 if the user lacks that capability.
 */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const role = auth.user.role;
  const supabase = createClient();

  let pending_reviews = 0;
  let new_leads = 0;
  let unresolved_404s = 0;

  if (can(role, "reviews")) {
    const { count } = await supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .is("deleted_at", null);
    pending_reviews = count ?? 0;
  }

  if (can(role, "leads")) {
    const { count } = await supabase
      .from("whatsapp_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    new_leads = count ?? 0;
  }

  if (can(role, "seo")) {
    const { count } = await supabase
      .from("error_logs")
      .select("id", { count: "exact", head: true })
      .eq("is_resolved", false);
    unresolved_404s = count ?? 0;
  }

  return ok({
    pending_reviews,
    new_leads,
    unresolved_404s,
    total: pending_reviews + new_leads + unresolved_404s,
  });
}
