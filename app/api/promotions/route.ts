import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, created } from "@/lib/api/respond";
import { promoSchema } from "@/lib/promotions/schema";
import { logActivity } from "@/lib/activity";

/** GET /api/promotions — all promotions (admins). */
export async function GET() {
  const guard = await requireCapability("promotions");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok(data);
}

/** POST /api/promotions — create. */
export async function POST(request: Request) {
  const guard = await requireCapability("promotions");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = promoSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = createClient();
  const status = parsed.data.is_active ? "active" : "draft";
  const { data, error } = await supabase
    .from("promotions")
    .insert({ ...parsed.data, status })
    .select("*")
    .single();
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "created",
    entityType: "promotion",
    entityId: data.id,
    entityName: data.title,
  });
  return created(data);
}
