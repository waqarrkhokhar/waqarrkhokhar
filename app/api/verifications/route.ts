import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { setSetting } from "@/lib/settings";
import { logActivity } from "@/lib/activity";
import { cleanToken, type VerifKey } from "@/lib/seo/verification";

export const dynamic = "force-dynamic";

/**
 * Site verification / ownership tags + Microsoft Clarity. Stored in the
 * `site_verifications` setting, gated on the `seo` capability. Google's value
 * falls back to the legacy `search_console_verification` key for continuity.
 */
export async function GET() {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;
  const supabase = createClient();
  const { data } = await supabase.from("settings").select("key, value").in("key", ["site_verifications", "search_console_verification"]);
  const map: Record<string, unknown> = {};
  for (const r of data ?? []) map[r.key] = r.value;
  const v = (map.site_verifications ?? {}) as Record<string, string>;
  if (!v.google && typeof map.search_console_verification === "string") v.google = map.search_console_verification;
  return ok({ verifications: v });
}

const schema = z.object({
  verifications: z.object({
    google: z.string().optional().default(""),
    bing: z.string().optional().default(""),
    clarity: z.string().optional().default(""),
    pinterest: z.string().optional().default(""),
    facebook: z.string().optional().default(""),
    yandex: z.string().optional().default(""),
    ahrefs: z.string().optional().default(""),
    norton: z.string().optional().default(""),
    facebook_pixel: z.string().optional().default(""),
  }),
});

export async function PATCH(request: Request) {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Invalid verification values");

  // Sanitise every value: pull the bare token out of whatever was pasted (full
  // <meta> tag, name=value line, quoted/padded value). This is what stops the
  // recurring "your meta tag is incorrect" failures — the stored + rendered
  // value is always the clean token, whatever the owner pastes.
  const raw = parsed.data.verifications;
  const v = Object.fromEntries(
    (Object.keys(raw) as VerifKey[]).map((k) => [k, cleanToken(k, raw[k] ?? "")]),
  ) as Record<VerifKey, string>;

  try {
    await setSetting("site_verifications", v as never);
    // Keep the legacy Google key in sync — but NEVER wipe an existing
    // verification when the Google box is left blank. Saving this form with an
    // empty Google field must not accidentally de-verify the site in Search
    // Console. To intentionally remove it, clear it and it stays in
    // site_verifications; the legacy key is only ever updated to a real value.
    if (v.google) await setSetting("search_console_verification", v.google as never);
  } catch (e) {
    return apiError(500, "INTERNAL_ERROR", e instanceof Error ? e.message : "error");
  }

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "updated",
    entityType: "setting", entityName: "site_verifications",
  });
  return action("Verification tags saved");
}
