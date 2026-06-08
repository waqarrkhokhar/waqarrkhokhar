import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";

/** GET /api/errors — 404 log for the dashboard monitor. */
export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const supabase = createClient();
  let q = supabase.from("error_logs").select("*").order("hits", { ascending: false });
  if (url.searchParams.get("resolved") === "false") q = q.eq("is_resolved", false);

  const { data, error } = await q;
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok(data);
}

const logSchema = z.object({
  url: z.string().min(1),
  referrer: z.string().nullish(),
  user_agent: z.string().nullish(),
});

/**
 * POST /api/errors — log a 404 hit (called by the storefront 404 page).
 * Public, but writes via the service role; upserts by URL incrementing hits.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = logSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "url is required");

  const db = createAdminClient();
  const { data: existing } = await db
    .from("error_logs")
    .select("id, hits")
    .eq("url", parsed.data.url)
    .maybeSingle();

  if (existing) {
    await db
      .from("error_logs")
      .update({ hits: existing.hits + 1, last_seen: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await db.from("error_logs").insert({
      url: parsed.data.url,
      referrer: parsed.data.referrer ?? null,
      user_agent: parsed.data.user_agent ?? null,
    });
  }
  return action("logged");
}
