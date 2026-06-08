import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { productHealth } from "@/lib/products/query";

/** GET /api/products/health — counts + missing-data summary for the overview. */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const supabase = createClient();
  try {
    return ok(await productHealth(supabase));
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }
}
