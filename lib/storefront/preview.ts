import { getCurrentUser } from "@/lib/auth/session";

/**
 * True when the request asks for a preview (`?preview=1`) AND a logged-in
 * dashboard user is making it. Lets admins view drafts/unpublished items on the
 * live storefront without exposing them publicly.
 */
export async function isPreviewRequest(searchParams?: { preview?: string | string[] }): Promise<boolean> {
  const flag = searchParams?.preview;
  const wants = flag === "1" || flag === "true" || (Array.isArray(flag) && flag.includes("1"));
  if (!wants) return false;
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
}
