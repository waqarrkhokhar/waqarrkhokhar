import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";

type Params = { params: { id: string } };

const patchSchema = z.object({
  alt_text: z.string().max(300).nullish(),
  title: z.string().max(200).nullish(),
  url: z.string().url().optional(),
  thumbnail_url: z.string().url().nullish(),
  webp_url: z.string().url().nullish(),
});

/** PATCH /api/media/:id — update alt text / title, or swap the URL (replace). */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("media");
  if (!guard.ok) return guard.response;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Invalid input");
  const supabase = createClient();
  const { data, error } = await supabase.from("media").update(parsed.data).eq("id", params.id).select("*").single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Media not found");
  return ok(data);
}

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
