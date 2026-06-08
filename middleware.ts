import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware responsibilities:
 *  • Phase 2 — refresh the auth session cookie + gate the dashboard.
 *  • Phase 6 — redirect lookups + 404 logging will be added here later.
 *
 * Dashboard pages require a logged-in user; the login page itself is public.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/dashboard/login";
  const isReset = pathname === "/dashboard/reset-password";

  // Not logged in and trying to reach a protected dashboard page → login.
  if (isDashboard && !isLogin && !isReset && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in and hitting the login page → go to the dashboard.
  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
};
