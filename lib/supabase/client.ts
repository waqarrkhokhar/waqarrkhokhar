import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/lib/types/database";

/**
 * Browser-side Supabase client (uses the public anon key + RLS).
 * Safe to use in client components.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
  );
}
