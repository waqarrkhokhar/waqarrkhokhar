import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { getSetting, setSetting } from "@/lib/settings";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

type ImageSnap = { url: string; alt_text: string | null; sort_order: number; is_primary: boolean };
type Batch = {
  at: string;
  by?: string;
  created: string[];
  updated: { id: string; prev: Record<string, unknown>; prevImages?: ImageSnap[] }[];
  summary: { created: number; updated: number; skipped: number };
};

/** GET /api/products/import/undo — is there an import to revert? */
export async function GET() {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;
  const batch = (await getSetting("last_product_import")) as Batch | null;
  if (!batch || (batch.created.length === 0 && batch.updated.length === 0)) {
    return ok({ available: false });
  }
  return ok({ available: true, at: batch.at, by: batch.by, summary: batch.summary });
}

/**
 * POST /api/products/import/undo — revert the most recent CSV import.
 * Created products are moved to Trash; updated products (and their images) are
 * restored to their pre-import values. The snapshot is then cleared.
 */
export async function POST() {
  const guard = await requireCapability("products");
  if (!guard.ok) return guard.response;

  const batch = (await getSetting("last_product_import")) as Batch | null;
  if (!batch || (batch.created.length === 0 && batch.updated.length === 0)) {
    return apiError(400, "NOTHING_TO_UNDO", "There is no recent import to revert.");
  }

  const supabase = createClient();
  let restored = 0;
  let trashed = 0;

  // Created → move to Trash (reversible).
  if (batch.created.length) {
    const { error } = await supabase
      .from("products")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", batch.created);
    if (!error) trashed = batch.created.length;
  }

  // Updated → restore prior field values + images.
  for (const u of batch.updated) {
    const { error } = await supabase.from("products").update(u.prev).eq("id", u.id);
    if (error) continue;
    if (u.prevImages) {
      await supabase.from("product_images").delete().eq("product_id", u.id);
      if (u.prevImages.length) {
        await supabase.from("product_images").insert(u.prevImages.map((i) => ({ ...i, product_id: u.id })));
      }
    }
    restored++;
  }

  await setSetting("last_product_import", null as never);

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "restored",
    entityType: "product", entityName: `Reverted CSV import (${trashed} removed, ${restored} restored)`,
  });

  return ok({ trashed, restored });
}
