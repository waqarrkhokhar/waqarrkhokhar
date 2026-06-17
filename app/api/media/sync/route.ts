import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg",
  png: "image/png", gif: "image/gif", svg: "image/svg+xml", avif: "image/avif",
};

type StorageFile = { name: string; metadata?: { size?: number; mimetype?: string } | null };

/**
 * POST /api/media/sync — register every image already sitting in a storage
 * bucket into the Media Library, so files uploaded directly to Supabase show
 * up in the dashboard. Recurses into folders. Skips files already recorded.
 * Body: { bucket?: "media" } (defaults to "media").
 */
export async function POST(request: Request) {
  const guard = await requireCapability("media");
  if (!guard.ok) return guard.response;

  const body = (await request.json().catch(() => ({}))) as { bucket?: string };
  const bucket = body.bucket || "media";

  const supabase = createAdminClient();

  // Recursively gather every file path in the bucket.
  const paths: { path: string; file: StorageFile }[] = [];
  async function walk(prefix: string, depth: number) {
    if (depth > 6) return;
    const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });
    if (error) throw new Error(error.message);
    for (const entry of data ?? []) {
      const full = prefix ? `${prefix}/${entry.name}` : entry.name;
      // Folders have no `id`/metadata; files do.
      if ((entry as { id?: string }).id == null && !entry.metadata) {
        await walk(full, depth + 1);
      } else {
        paths.push({ path: full, file: entry as StorageFile });
      }
    }
  }
  try {
    await walk("", 0);
  } catch (e) {
    return apiError(500, "STORAGE_ERROR", e instanceof Error ? e.message : "Could not list storage");
  }

  // Which URLs are already in the media table?
  const { data: existing } = await supabase.from("media").select("url");
  const have = new Set((existing ?? []).map((r) => r.url));

  let added = 0;
  for (const { path, file } of paths) {
    const ext = path.split(".").pop()?.toLowerCase() || "";
    if (!MIME[ext]) continue; // images only
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    if (have.has(pub.publicUrl)) continue;
    const { data: thumb } = supabase.storage.from(bucket).getPublicUrl(path, { transform: { width: 300, height: 300, resize: "contain" } });
    const folder = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : bucket;
    const { error: insErr } = await supabase.from("media").insert({
      filename: path.split("/").pop() || path,
      url: pub.publicUrl,
      thumbnail_url: thumb.publicUrl,
      mime_type: MIME[ext],
      size_bytes: file.metadata?.size ?? null,
      folder,
    });
    if (!insErr) added++;
  }

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "created",
    entityType: "media", entityName: `Synced ${added} file(s) from storage`,
  });

  return ok({ added, scanned: paths.length });
}
