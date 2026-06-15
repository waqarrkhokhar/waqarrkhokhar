import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

const schema = z.object({
  role: z.enum(["Super Admin", "Admin", "SEO Manager", "Product Manager", "Content Editor"]).optional(),
  status: z.enum(["active", "suspended", "invited"]).optional(),
  name: z.string().min(2).max(100).optional(),
});

/** PATCH /api/users/:id — update a team member's role, status or name. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireCapability("users");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    return apiError(400, "VALIDATION_ERROR", "Nothing valid to update");
  }

  const supabase = createClient();
  // Guard: don't allow demoting the last Super Admin.
  if (parsed.data.role && parsed.data.role !== "Super Admin") {
    const { data: target } = await supabase.from("users").select("role").eq("id", params.id).maybeSingle();
    if (target?.role === "Super Admin") {
      const { count } = await supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "Super Admin");
      if ((count ?? 0) <= 1) return apiError(400, "VALIDATION_ERROR", "You can't demote the only Super Admin");
    }
  }

  const { data, error } = await supabase.from("users").update(parsed.data).eq("id", params.id).select("*").single();
  if (error || !data) return apiError(404, "NOT_FOUND", "User not found");

  await logActivity({ userId: guard.user.id, userName: guard.user.name, action: "updated", entityType: "user", entityId: data.id, entityName: data.name });
  return ok(data);
}
