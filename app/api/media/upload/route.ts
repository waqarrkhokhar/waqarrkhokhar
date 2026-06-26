import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { created } from "@/lib/api/respond";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const BUCKETS = new Set(["products", "blog", "media", "reviews", "promotions"]);

/**
 * POST /api/media/upload — upload an image to Supabase Storage and record it in
 * the media library. WebP + thumbnail are delivered via Supabase image
 * transforms (Decision A4), not in-function processing.
 */
export async function POST(request: Request) {
  const guard = await requireCapability("media");
  if (!guard.ok) return guard.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return apiError(400, "VALIDATION_ERROR", "No file provided");
  if (!ALLOWED.includes(file.type)) {
    return apiError(400, "VALIDATION_ERROR", "Only JPG, PNG, or WebP images are allowed");
  }
  if (file.size > MAX_BYTES) return apiError(413, "FILE_TOO_LARGE", "Max file size is 5MB");

  const folderRaw = String(form?.get("folder") ?? "products");
  const bucket = BUCKETS.has(folderRaw) ? folderRaw : "media";
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createClient();
  const { error: upErr } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) return apiError(500, "UPLOAD_ERROR", upErr.message);

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  const { data: thumb } = supabase.storage
    .from(bucket)
    .getPublicUrl(path, { transform: { width: 300, height: 300, resize: "contain" } });
  const { data: webp } = supabase.storage
    .from(bucket)
    .getPublicUrl(path, { transform: { width: 1200, quality: 80 } });

  // Replace mode: just return the URLs without creating a new library row.
  if (String(form?.get("record") ?? "") === "false") {
    return created({ url: pub.publicUrl, thumbnail_url: thumb.publicUrl, webp_url: webp.publicUrl });
  }

  const { data: media, error: dbErr } = await supabase
    .from("media")
    .insert({
      filename: file.name,
      url: pub.publicUrl,
      thumbnail_url: thumb.publicUrl,
      webp_url: webp.publicUrl,
      alt_text: String(form?.get("alt_text") ?? "") || null,
      mime_type: file.type,
      size_bytes: file.size,
      folder: bucket,
    })
    .select("*")
    .single();
  if (dbErr) return apiError(500, "INTERNAL_ERROR", dbErr.message);

  return created(media);
}
