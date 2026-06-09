import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";

/** GET /api/leads/stats — aggregate lead analytics. */
export async function GET() {
  const guard = await requireCapability("leads");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("whatsapp_leads")
    .select("message_type, status, product_name, created_at");
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  const rows = data ?? [];
  const now = Date.now();
  const weekAgo = now - 7 * 864e5;
  const monthAgo = now - 30 * 864e5;

  const tally = <T extends string>(key: (r: (typeof rows)[number]) => T) =>
    rows.reduce<Record<string, number>>((a, r) => {
      const k = key(r);
      a[k] = (a[k] ?? 0) + 1;
      return a;
    }, {});

  const productCounts = tally((r) => r.product_name ?? "Unknown");
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([product_name, count]) => ({ product_name, count }));

  return ok({
    total: rows.length,
    this_week: rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length,
    this_month: rows.filter((r) => new Date(r.created_at).getTime() >= monthAgo).length,
    by_status: tally((r) => r.status),
    by_type: tally((r) => r.message_type),
    top_products: topProducts,
  });
}
