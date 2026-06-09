import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";

type Params = { params: { id: string } };

const schema = z.object({
  status: z.enum(["new", "contacted", "converted", "lost"]).optional(),
  notes: z.string().nullish(),
});

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("leads");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Invalid input");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("whatsapp_leads")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Lead not found");
  return ok(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("leads");
  if (!guard.ok) return guard.response;
  if (guard.user.role !== "Super Admin" && guard.user.role !== "Admin") {
    return apiError(403, "FORBIDDEN", "Only an Admin can delete leads");
  }

  const supabase = createClient();
  const { error } = await supabase.from("whatsapp_leads").delete().eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return action("Lead deleted");
}
