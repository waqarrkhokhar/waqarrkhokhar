import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";

/** GET /api/auth/session — current user + role, or 401. */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  return NextResponse.json({ data: auth.user });
}
