import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { setSetting } from "@/lib/settings";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

/**
 * Homepage SEO (meta title + description). Stored in the `home_seo` setting,
 * gated on the `seo` capability. The storefront homepage reads it in
 * generateMetadata, falling back to the built-in defaults when blank.
 */
export async function GET() {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;
  const supabase = createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "home_seo").maybeSingle();
  const v = (data?.value ?? {}) as { meta_title?: string; meta_description?: string };
  return ok({ meta_title: v.meta_title ?? "", meta_description: v.meta_description ?? "" });
}

const schema = z.object({
  meta_title: z.string().max(70).optional().default(""),
  meta_description: z.string().max(200).optional().default(""),
});

export async function PATCH(request: Request) {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");

  try {
    await setSetting("home_seo", {
      meta_title: parsed.data.meta_title.trim(),
      meta_description: parsed.data.meta_description.trim(),
    } as never);
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "updated",
    entityType: "setting", entityName: "home_seo",
  });
  return action("Homepage SEO saved");
}
