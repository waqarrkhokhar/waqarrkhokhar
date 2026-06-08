import Papa from "papaparse";
import { createClient } from "@/lib/supabase/server";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { action } from "@/lib/api/respond";

type Row = { source_url: string; target_url: string; type?: string };

/**
 * POST /api/redirects/import — bulk import from CSV.
 * Columns: source_url, target_url, type (optional, 301/302).
 * This is the path the WordPress migration map loads through (Phase 14).
 */
export async function POST(request: Request) {
  const guard = await requireCapability("seo");
  if (!guard.ok) return guard.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return apiError(400, "VALIDATION_ERROR", "No CSV file provided");

  const text = await file.text();
  const parsed = Papa.parse<Row>(text, { header: true, skipEmptyLines: true });
  const rows = parsed.data
    .filter((r) => r.source_url?.trim() && r.target_url?.trim())
    .map((r) => ({
      source_url: r.source_url.trim(),
      target_url: r.target_url.trim(),
      type: r.type?.trim() === "302" ? 302 : 301,
      is_active: true,
    }));

  if (!rows.length) return apiError(400, "VALIDATION_ERROR", "No valid rows found");

  const supabase = createClient();
  const { error, count } = await supabase
    .from("redirects")
    .upsert(rows, { onConflict: "source_url", count: "exact" });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  return action(`${count ?? rows.length} redirects imported`, { count: count ?? rows.length });
}
