import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** POST /api/auth/logout — sign out and clear the session cookie. */
export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
