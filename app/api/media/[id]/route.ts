import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { action } from "@/lib/api/respond";

type Params = { params: { id: string } };

/** DELETE /api/media/:id — remove a media record (and its storage object). */
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("media");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data: row } = await supabase.from("media").select("url, folder").eq("id", params.id).maybeSingle();
  if (row) {
    // Best-effort storage cleanup: derive the object path from the public URL.
    const marker = `/object/public/${row.folder}/`;
    const idx = row.url.indexOf(marker);
    if (idx !== -1) {
      const path = row.url.slice(idx + marker.length);
      await supabase.storage.from(row.folder).remove([path]).catch(() => {});
    }
  }
  const { error } = await supabase.from("media").delete().eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return action("Media deleted");
}
