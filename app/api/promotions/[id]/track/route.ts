import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { action } from "@/lib/api/respond";
import { apiError } from "@/lib/auth/guard";

type Params = { params: { id: string } };
const schema = z.object({ action: z.enum(["impression", "click"]) });

/** POST /api/promotions/:id/track — increment impressions or clicks (public). */
export async function POST(request: Request, { params }: Params) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "action required");

  const db = createAdminClient();
  const col = parsed.data.action === "impression" ? "impressions" : "clicks";
  const { data } = await db.from("promotions").select(col).eq("id", params.id).maybeSingle();
  if (data) {
    const current = (data as Record<string, number>)[col] ?? 0;
    await db.from("promotions").update({ [col]: current + 1 }).eq("id", params.id);
  }
  return action("tracked");
}
