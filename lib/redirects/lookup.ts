import { createAdminClient } from "@/lib/supabase/admin";

export type RedirectHit = { id: string; target: string; type: number };

type Row = { id: string; source_url: string; target_url: string; type: number | null };

// In-memory cache of ALL active redirects, refreshed at most once per TTL per
// server instance. Redirects are few and change rarely, so this turns a
// per-request database query (paid on every storefront hit, even cached pages
// served via ISR) into one query per minute — a big TTFB win.
const TTL_MS = 60_000;
let cache: { at: number; rows: Row[] } | null = null;

async function getRows(): Promise<Row[]> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.rows;
  const db = createAdminClient();
  const { data } = await db
    .from("redirects")
    .select("id, source_url, target_url, type")
    .eq("is_active", true);
  const rows = (data ?? []) as Row[];
  cache = { at: now, rows };
  return rows;
}

/**
 * Look up an active redirect for a path. Matches the path both with and
 * without a trailing slash. Returns null on miss or if Supabase is not
 * configured (so the storefront never breaks).
 */
export async function findRedirect(pathname: string): Promise<RedirectHit | null> {
  try {
    const alt = pathname.endsWith("/") ? pathname.slice(0, -1) : `${pathname}/`;
    const rows = await getRows();
    const row = rows.find((r) => r.source_url === pathname || r.source_url === alt);
    if (!row) return null;
    return { id: row.id, target: row.target_url, type: row.type ?? 301 };
  } catch {
    return null;
  }
}
