import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import type { Json } from "@/lib/types/database";

/**
 * Read a single setting by key (uses the cookie-aware server client, so RLS
 * applies — public keys are readable by anyone, the rest by admins).
 */
export async function getSetting<T = Json>(key: string): Promise<T | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();
  return (data?.value as T) ?? null;
}

/** Read several settings at once → keyed object. */
export async function getSettings(
  keys: string[],
): Promise<Record<string, Json>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", keys);
  const out: Record<string, Json> = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return out;
}

/**
 * Read several PUBLIC settings without touching cookies, so callers (root
 * layout metadata, storefront chrome) stay cacheable. Only the public-read
 * whitelisted keys are returned by RLS — which is all the storefront needs.
 */
export async function getPublicSettings(
  keys: string[],
): Promise<Record<string, Json>> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", keys);
  const out: Record<string, Json> = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return out;
}

/** Upsert a setting (service-role; callers must authorize first). */
export async function setSetting(key: string, value: Json) {
  const db = createAdminClient();
  const { error } = await db
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
