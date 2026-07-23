import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { findRedirect } from "@/lib/redirects/lookup";

/**
 * Middleware responsibilities:
 *  • Phase 6 — storefront redirect lookups (301/302) against the DB.
 *  • Phase 2 — refresh the auth session cookie + gate the dashboard.
 *
 * Dashboard pages require a logged-in user; the login page itself is public.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isStorefront =
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next");

  // Redirect engine: check storefront paths against the redirects table.
  if (isStorefront) {
    const hit = await findRedirect(pathname);
    if (hit) {
      const url = new URL(hit.target, request.url);
      return NextResponse.redirect(url, hit.type === 302 ? 302 : 301);
    }
    // Public visitors have no dashboard session to refresh — skip the auth
    // round-trip entirely so cached pages are served with minimal latency.
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

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
