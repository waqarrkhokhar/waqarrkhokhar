import { createClient } from "@supabase/supabase-js";
import { env, getServiceRoleKey } from "@/lib/env";
import type { Database } from "@/lib/types/database";

/**
 * Service-role Supabase client — bypasses Row Level Security.
 *
 * SERVER-ONLY. Use only in API routes / scripts for trusted operations
 * (e.g. logging public reviews/leads/contact submissions, seeding).
 * Never import this into a client component.
 */
export function createAdminClient() {
  return createClient<Database>(env.supabaseUrl, getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
