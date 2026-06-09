import Papa from "papaparse";
import { createClient } from "@/lib/supabase/server";
import { requireCapability } from "@/lib/auth/guard";

/** GET /api/leads/export — download leads as CSV. */
export async function GET() {
  const guard = await requireCapability("leads");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("whatsapp_leads")
    .select("product_name, message_type, source_page, status, notes, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const rows = (data ?? []).map((l) => ({
    Product: l.product_name ?? "",
    Type: l.message_type,
    "Source Page": l.source_page ?? "",
    Status: l.status,
    Notes: l.notes ?? "",
    Date: l.created_at,
  }));

  const csv = Papa.unparse(rows);
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="comfyclub-leads-${date}.csv"`,
    },
  });
}
