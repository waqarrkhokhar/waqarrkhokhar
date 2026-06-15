import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, created } from "@/lib/api/respond";
import { slugify } from "@/lib/slug";
import { logActivity } from "@/lib/activity";

/** GET /api/pages — landing/custom pages. */
export async function GET() {
  const guard = await requireCapability("pages");
  if (!guard.ok) return guard.response;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id, title, slug, type, status, updated_at")
    .order("updated_at", { ascending: false });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok(data ?? []);
}

const schema = z.object({
  title: z.string().min(2).max(200),
  content: z.string().nullish(),
  banner_image: z.string().nullish(),
  meta_title: z.string().max(70).nullish(),
  meta_description: z.string().max(200).nullish(),
  status: z.enum(["draft", "published"]).default("draft"),
});

/** POST /api/pages — create a custom page. */
export async function POST(request: Request) {
  const guard = await requireCapability("pages");
  if (!guard.ok) return guard.response;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = createClient();
  let base = slugify(parsed.data.title);
  let slug = base, n = 1;
  while ((await supabase.from("pages").select("id").eq("slug", slug).maybeSingle()).data) slug = `${base}-${++n}`;

  const { data, error } = await supabase.from("pages").insert({ ...parsed.data, slug, type: "custom" }).select("id").single();
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  await logActivity({ userId: guard.user.id, userName: guard.user.name, action: "created", entityType: "page", entityId: data.id, entityName: parsed.data.title });
  return created({ id: data.id });
}
