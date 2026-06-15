import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

const schema = z.object({
  title: z.string().min(2).max(200).optional(),
  content: z.string().nullish(),
  banner_image: z.string().nullish(),
  meta_title: z.string().max(70).nullish(),
  meta_description: z.string().max(200).nullish(),
  status: z.enum(["draft", "published"]).optional(),
});

/** GET /api/pages/:id */
export async function GET(_req: Request, { params }: Params) {
  const guard = await requireCapability("pages");
  if (!guard.ok) return guard.response;
  const supabase = createClient();
  const { data, error } = await supabase.from("pages").select("*").eq("id", params.id).single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Page not found");
  return ok(data);
}

/** PATCH /api/pages/:id */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("pages");
  if (!guard.ok) return guard.response;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  const supabase = createClient();
  const { data, error } = await supabase.from("pages").update(parsed.data).eq("id", params.id).select("*").single();
  if (error || !data) return apiError(404, "NOT_FOUND", "Page not found");
  await logActivity({ userId: guard.user.id, userName: guard.user.name, action: "updated", entityType: "page", entityId: data.id, entityName: data.title });
  return ok(data);
}

/** DELETE /api/pages/:id — custom pages only (core/policy protected). */
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireCapability("pages");
  if (!guard.ok) return guard.response;
  const supabase = createClient();
  const { data: row } = await supabase.from("pages").select("type").eq("id", params.id).maybeSingle();
  if (row && row.type !== "custom") return apiError(400, "VALIDATION_ERROR", "Core/policy pages can't be deleted");
  const { error } = await supabase.from("pages").delete().eq("id", params.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return action("Page deleted");
}
