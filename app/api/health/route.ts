import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Health check — confirms the app can reach Supabase and read the catalog.
 * Returns published product/collection counts. Used to verify Phase 1 setup.
 *   GET /api/health
 */
export async function GET() {
  try {
    const supabase = createClient();

    const [{ count: products }, { count: collections }] = await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
    ]);

    return NextResponse.json({
      status: "ok",
      database: "connected",
      published_products: products ?? 0,
      published_collections: collections ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        database: "unreachable",
        message: err instanceof Error ? err.message : "unknown error",
      },
      { status: 500 },
    );
  }
}
