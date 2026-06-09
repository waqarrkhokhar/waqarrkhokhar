import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { paginated, created, parseListParams } from "@/lib/api/respond";

/** GET /api/leads — lead list for the dashboard. */
export async function GET(request: Request) {
  const guard = await requireCapability("leads");
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const { page, limit, offset } = parseListParams(url);
  const supabase = createClient();

  let q = supabase
    .from("whatsapp_leads")
    .select("*, product:products(slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const status = url.searchParams.get("status");
  if (status) q = q.eq("status", status);
  const type = url.searchParams.get("message_type");
  if (type) q = q.eq("message_type", type);
  const productId = url.searchParams.get("product_id");
  if (productId) q = q.eq("product_id", productId);

  const { data, count, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return paginated(data ?? [], { page, limit, total: count ?? 0 });
}

const logSchema = z.object({
  product_id: z.string().uuid().nullish(),
  product_name: z.string().nullish(),
  message_type: z.enum(["order", "quote", "consultation", "general"]),
  source_page: z.string().nullish(),
});

/** POST /api/leads — log a WhatsApp click (public, via service role). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = logSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "message_type required");

  const db = createAdminClient();
  const { error } = await db.from("whatsapp_leads").insert({ ...parsed.data, status: "new" });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return created({ logged: true });
}
