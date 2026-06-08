import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, created } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

const schema = z.object({
  source_url: z.string().min(1),
  target_url: z.string().min(1),
  type: z.union([z.literal(301), z.literal(302)]).default(301),
});

/** GET /api/redirects — list all (SEO managers+). */
export async function GET() {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("redirects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok(data);
}

/** POST /api/redirects — create a redirect. */
export async function POST(request: Request) {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "source_url and target_url are required");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("redirects")
    .insert({ ...parsed.data, is_active: true })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") return apiError(409, "CONFLICT", "That source URL already has a redirect");
    return apiError(500, "INTERNAL_ERROR", error.message);
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "created",
    entityType: "redirect",
    entityId: data.id,
    entityName: data.source_url,
  });
  return created(data);
}
