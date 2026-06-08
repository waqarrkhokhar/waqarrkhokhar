import { createAdminClient } from "@/lib/supabase/admin";

export type RedirectHit = { id: string; target: string; type: number };

/**
 * Look up an active redirect for a path. Matches the path both with and
 * without a trailing slash. Returns null on miss or if Supabase is not
 * configured (so the storefront never breaks).
 */
export async function findRedirect(pathname: string): Promise<RedirectHit | null> {
  try {
    const alt = pathname.endsWith("/") ? pathname.slice(0, -1) : `${pathname}/`;
    const db = createAdminClient();
    const { data } = await db
      .from("redirects")
      .select("id, target_url, type, hits")
      .in("source_url", [pathname, alt])
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    if (!data) return null;

    // Best-effort hit counter (don't block the redirect on it).
    void db
      .from("redirects")
      .update({ hits: (data.hits ?? 0) + 1, last_hit: new Date().toISOString() })
      .eq("id", data.id);

    return { id: data.id, target: data.target_url, type: data.type ?? 301 };
  } catch {
    return null;
  }
}
