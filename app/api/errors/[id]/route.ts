import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";

type Params = { params: { id: string } };

const schema = z.object({ is_resolved: z.boolean() });

/** PATCH /api/errors/:id — mark a 404 resolved/unresolved. */
export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "is_resolved is required");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("error_logs")
    .update({ is_resolved: parsed.data.is_resolved })
    .eq("id", params.id)
    .select("*")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Entry not found");
  return ok(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const supabase = createClient();
  const { error } = await supabase.from("error_logs").delete().eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return action("Dismissed");
}
