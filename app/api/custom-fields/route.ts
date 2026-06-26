import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { setSetting } from "@/lib/settings";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

/**
 * Custom product specification fields. Stored in the `custom_fields` setting,
 * but gated on the `categories` capability (not `settings`) so the
 * SEO & Product Manager role — who owns the catalog — can manage them.
 */
export async function GET() {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;
  const supabase = createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "custom_fields").maybeSingle();
  return ok({ fields: Array.isArray(data?.value) ? data!.value : [] });
}

const fieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  options: z.string().optional().default(""),
  required: z.boolean().optional().default(false),
  showOnProduct: z.boolean().optional().default(true),
});
const schema = z.object({ fields: z.array(fieldSchema) });

export async function PATCH(request: Request) {
  const guard = await requireCapability("categories");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Invalid fields");

  try {
    await setSetting("custom_fields", parsed.data.fields as never);
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "updated",
    entityType: "setting", entityName: "custom_fields",
  });
  return action("Custom fields saved");
}
