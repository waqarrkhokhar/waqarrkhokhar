import { requireCapability } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { getSettings } from "@/lib/settings";
import { googleConfigured, fetchGa4, fetchGsc } from "@/lib/google/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/google — live GA4 + Search Console figures (last 28 days).
 * Returns { configured, ga4, gsc }. Each block is null when not set up, so the
 * dashboard can show setup guidance instead of fake numbers.
 */
export async function GET() {
  const guard = await requireCapability("analytics");
  if (!guard.ok) return guard.response;

  const configured = googleConfigured();
  if (!configured) {
    const msg = "Google service account not connected. Add the GOOGLE_SERVICE_ACCOUNT_JSON environment variable in Vercel and redeploy.";
    return ok({ configured: false, ga4: null, gsc: null, ga4_error: msg, gsc_error: msg });
  }

  const s = await getSettings(["ga4_property_id", "search_console_property"]);
  const propertyId = typeof s.ga4_property_id === "string" ? s.ga4_property_id : "";
  const gscProp = typeof s.search_console_property === "string" ? s.search_console_property : "";

  const [ga4Res, gscRes] = await Promise.all([
    propertyId ? fetchGa4(propertyId) : Promise.resolve({ report: null, error: "GA4 Property ID not set (add it below)." }),
    gscProp ? fetchGsc(gscProp) : Promise.resolve({ report: null, error: "Search Console property not set (add it below)." }),
  ]);

  return ok({
    configured: true,
    ga4: ga4Res.report, ga4_error: ga4Res.error,
    gsc: gscRes.report, gsc_error: gscRes.error,
  });
}
