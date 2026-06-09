import { createClient } from "@/lib/supabase/server";
import { ok } from "@/lib/api/respond";
import { apiError } from "@/lib/auth/guard";

/**
 * GET /api/promotions/active — currently-live promotions for the storefront.
 * Public. Active = is_active AND within the date window.
 */
export async function GET(request: Request) {
  const type = new URL(request.url).searchParams.get("type");
  const supabase = createClient();
  const now = new Date().toISOString();

  let q = supabase
    .from("promotions")
    .select(
      "id, type, content, cta_text, cta_url, background_color, text_color, image_url, display_delay_seconds, display_frequency, show_on_mobile, show_on_desktop",
    )
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gt.${now}`);
  if (type) q = q.eq("type", type);

  const { data, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok(data);
}
