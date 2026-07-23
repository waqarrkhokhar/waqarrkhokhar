import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/lib/types/database";

/**
 * Cookieless anon Supabase client for PUBLIC storefront reads.
 *
 * Because it never touches cookies(), pages that read data through it can be
 * statically generated and cached (ISR) instead of re-rendered from scratch on
 * every request — which is the fix for slow TTFB. RLS still applies with the
 * anon role, so it can only read published/active content, exactly what the
 * public storefront needs. Preview (drafts) uses the cookie-aware server client.
 */
export function createPublicClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
