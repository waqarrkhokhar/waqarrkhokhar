import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { setSetting } from "@/lib/settings";
import { logActivity } from "@/lib/activity";

/** GET /api/settings — all settings as a keyed object (admins). */
export async function GET() {
  const guard = await requireCapability("settings");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase.from("settings").select("key, value");
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  const out: Record<string, unknown> = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return ok(out);
}

const schema = z.object({ key: z.string().min(1), value: z.unknown() });

/** PATCH /api/settings — upsert a single setting key. */
export async function PATCH(request: Request) {
  const guard = await requireCapability("settings");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "key and value are required");

  try {
    await setSetting(parsed.data.key, parsed.data.value as never);
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "updated",
    entityType: "setting",
    entityName: parsed.data.key,
  });
  return action("Settings saved");
}
