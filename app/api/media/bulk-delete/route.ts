import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { action } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

const schema = z.object({ ids: z.array(z.string().uuid()).min(1).max(500) });

/** POST /api/media/bulk-delete — delete many media items (and their storage objects). */
export async function POST(request: Request) {
  const guard = await requireCapability("media");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "ids are required");
  const { ids } = parsed.data;

  const supabase = createClient();
  const { data: rows } = await supabase.from("media").select("id, url, folder").in("id", ids);

  // Best-effort storage cleanup, grouped by bucket.
  const byBucket = new Map<string, string[]>();
  for (const r of (rows ?? []) as { url: string; folder: string }[]) {
    const marker = `/object/public/${r.folder}/`;
    const i = r.url.indexOf(marker);
    if (i !== -1) {
      const path = r.url.slice(i + marker.length);
      if (!byBucket.has(r.folder)) byBucket.set(r.folder, []);
      byBucket.get(r.folder)!.push(path);
    }
  }
  for (const [bucket, paths] of byBucket) {
    await supabase.storage.from(bucket).remove(paths).catch(() => {});
  }

  const { error, count } = await supabase.from("media").delete({ count: "exact" }).in("id", ids);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "permanently deleted",
    entityType: "media", entityName: `${count ?? ids.length} image(s)`,
  });
  return action(`${count ?? ids.length} image(s) deleted`);
}
