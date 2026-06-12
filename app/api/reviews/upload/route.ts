import { createAdminClient } from "@/lib/supabase/admin";
import { apiError } from "@/lib/auth/guard";
import { created } from "@/lib/api/respond";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/reviews/upload — public review-photo upload.
 * Customers aren't authenticated, so this writes to the public `reviews`
 * bucket via the service role. Returns the public URL to attach to a review.
 */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return apiError(400, "VALIDATION_ERROR", "No file provided");
  if (!ALLOWED.includes(file.type)) {
    return apiError(400, "VALIDATION_ERROR", "Only JPG, PNG, or WebP images are allowed");
  }
  if (file.size > MAX_BYTES) return apiError(413, "FILE_TOO_LARGE", "Max file size is 5MB");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `customer/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const db = createAdminClient();
  const { error: upErr } = await db.storage
    .from("reviews")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) return apiError(500, "UPLOAD_ERROR", upErr.message);

  const { data: pub } = db.storage.from("reviews").getPublicUrl(path);
  return created({ url: pub.publicUrl });
}
