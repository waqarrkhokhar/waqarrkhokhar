import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { created } from "@/lib/api/respond";
import { refreshRatings } from "@/lib/reviews/ratings";
import { logActivity } from "@/lib/activity";

const schema = z.object({
  product_id: z.string().uuid(),
  name: z.string().min(2).max(100),
  city: z.string().max(50).nullish(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(3).max(1000),
  image_url: z.string().url().nullish(),
});

/** POST /api/reviews/manual — admin adds a review (auto-approved). */
export async function POST(request: Request) {
  const guard = await requireCapability("reviews");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({ ...parsed.data, status: "approved" })
    .select("*")
    .single();
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  await refreshRatings();
  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "created",
    entityType: "review",
    entityId: data.id,
    entityName: data.name,
  });
  return created(data);
}
