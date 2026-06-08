import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";

type Params = { params: { id: string } };

const schema = z.object({
  source_url: z.string().min(1).optional(),
  target_url: z.string().min(1).optional(),
  type: z.union([z.literal(301), z.literal(302)]).optional(),
  is_active: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Invalid input");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("redirects")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Redirect not found");
  return ok(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { error } = await supabase.from("redirects").delete().eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return action("Redirect deleted");
}
