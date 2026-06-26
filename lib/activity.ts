import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/types/database";

export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "published"
  | "archived"
  | "approved"
  | "rejected"
  | "invited"
  | "duplicated"
  | "moved to trash"
  | "permanently deleted"
  | "restored";

export type ActivityEntity =
  | "product"
  | "category"
  | "collection"
  | "blog"
  | "review"
  | "page"
  | "user"
  | "promotion"
  | "redirect"
  | "media"
  | "lead"
  | "setting"
  | "contact"
  | "trash";

/**
 * Record an admin action in activity_logs (Blueprint §3 — shared helper).
 * Server-only. Uses the service-role client so logging never fails on RLS.
 * Best-effort: errors are swallowed so logging can't break the main action.
 */
export async function logActivity(params: {
  userId: string | null;
  userName: string | null;
  action: ActivityAction;
  entityType: ActivityEntity;
  entityId?: string | null;
  entityName?: string | null;
  details?: Record<string, unknown> | Json | null;
}) {
  try {
    const db = createAdminClient();
    await db.from("activity_logs").insert({
      user_id: params.userId,
      user_name: params.userName,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId ?? null,
      entity_name: params.entityName ?? null,
      details: (params.details ?? null) as Json,
    });
  } catch {
    // Logging must never break the primary operation.
  }
}
