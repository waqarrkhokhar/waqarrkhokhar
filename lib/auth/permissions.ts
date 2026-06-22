/**
 * Role → capability permission matrix (Production Spec §3 / Gap-Resolution §2).
 *
 * This is the single source of truth for "who can do what" in the dashboard.
 * Both the UI (which menu items to show) and the API routes (authorization
 * checks) read from here so they can never drift apart.
 */
import type { UserRole } from "@/lib/types/database";

export type Capability =
  | "products"
  | "categories" // parent categories + collections
  | "seo"
  | "blog"
  | "reviews"
  | "media"
  | "promotions"
  | "leads" // WhatsApp leads
  | "analytics"
  | "users"
  | "settings"
  | "backups"
  | "import_export"
  | "pages";

const MATRIX: Record<UserRole, Capability[]> = {
  // Full access, including users, settings and backups.
  "Super Admin": [
    "products", "categories", "seo", "blog", "reviews", "media",
    "promotions", "leads", "analytics", "users", "settings", "backups",
    "import_export", "pages",
  ],
  // Everything except managing team members (only Super Admin adds users).
  Admin: [
    "products", "categories", "seo", "blog", "reviews", "media",
    "promotions", "leads", "analytics", "settings", "backups",
    "import_export", "pages",
  ],
  // Products, Collections, Categories, Blog, Pages, SEO, Media, Reviews,
  // Promotions, plus CSV Import/Export — no leads, analytics, users or settings.
  "SEO & Product Manager": [
    "products", "categories", "seo", "blog", "reviews", "media",
    "promotions", "pages", "import_export",
  ],
};

/** True if the role is allowed the given capability. */
export function can(role: UserRole | null | undefined, cap: Capability): boolean {
  if (!role) return false;
  return MATRIX[role]?.includes(cap) ?? false;
}

/** All capabilities granted to a role. */
export function capabilitiesFor(role: UserRole): Capability[] {
  return MATRIX[role] ?? [];
}
