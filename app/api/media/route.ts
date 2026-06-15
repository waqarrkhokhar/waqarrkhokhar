import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { paginated, parseListParams } from "@/lib/api/respond";

/** GET /api/media — media library list (newest first). */
export async function GET(request: Request) {
  const guard = await requireCapability("media");
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const { page, limit, offset } = parseListParams(url);
  const supabase = createClient();

  let q = supabase
    .from("media")
    .select("id, filename, url, thumbnail_url, alt_text, mime_type, size_bytes, folder, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const folder = url.searchParams.get("folder");
  if (folder) q = q.eq("folder", folder);
  const search = url.searchParams.get("search");
  if (search) q = q.ilike("filename", `%${search}%`);

  const { data, count, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return paginated(data ?? [], { page, limit, total: count ?? 0 });
}
