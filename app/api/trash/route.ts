import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

type TrashType = "product" | "blog" | "collection" | "parent" | "page" | "promotion" | "review";

// type → { table, label, name column, optional secondary text }
const SOURCES: Record<TrashType, { table: string; label: string; name: string; extra?: string }> = {
  product: { table: "products", label: "Product", name: "name", extra: "sku" },
  blog: { table: "blog_posts", label: "Blog post", name: "title" },
  collection: { table: "categories", label: "Collection", name: "name" },
  parent: { table: "parent_categories", label: "Category", name: "name" },
  page: { table: "pages", label: "Page", name: "title" },
  promotion: { table: "promotions", label: "Promotion", name: "title" },
  review: { table: "reviews", label: "Review", name: "name", extra: "text" },
};

/** GET /api/trash — every soft-deleted item across the store. */
export async function GET() {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  // Dynamic table names — cast past the typed client's literal-union .from().
  const supabase = createClient() as unknown as {
    from: (t: string) => {
      select: (c: string) => {
        not: (col: string, op: string, val: null) => { order: (col: string, o: { ascending: boolean }) => Promise<{ data: Record<string, string>[] | null }> };
      };
    };
  };
  const out: { type: TrashType; label: string; id: string; name: string; extra: string | null; deleted_at: string }[] = [];

  for (const [type, src] of Object.entries(SOURCES) as [TrashType, (typeof SOURCES)[TrashType]][]) {
    const cols = ["id", src.name, "deleted_at", ...(src.extra ? [src.extra] : [])].join(", ");
    const { data } = await supabase
      .from(src.table)
      .select(cols)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });
    for (const row of (data ?? []) as Record<string, string>[]) {
      out.push({
        type,
        label: src.label,
        id: row.id,
        name: row[src.name] || "Untitled",
        extra: src.extra ? (row[src.extra] ?? null) : null,
        deleted_at: row.deleted_at,
      });
    }
  }

  out.sort((a, b) => (a.deleted_at < b.deleted_at ? 1 : -1));
  return ok(out);
}

type RestoreClient = {
  from: (t: string) => {
    update: (v: Record<string, unknown>) => {
      in: (c: string, v: string[]) => Promise<{ error: { message: string } | null }>;
    };
  };
};

/**
 * POST /api/trash — restore items. Accepts a single { type, id } or a bulk
 * { items: [{ type, id }] }. Items are grouped by type so each table is
 * updated in one round-trip.
 */
export async function POST(request: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  const body = (await request.json().catch(() => null)) as
    | { type?: TrashType; id?: string; items?: { type: TrashType; id: string }[] }
    | null;

  const items = body?.items ?? (body?.type && body?.id ? [{ type: body.type, id: body.id }] : []);
  const valid = items.filter((it) => it && SOURCES[it.type] && it.id);
  if (valid.length === 0) return apiError(400, "VALIDATION_ERROR", "Nothing to restore");

  const supabase = createClient() as unknown as RestoreClient;
  const byType = new Map<TrashType, string[]>();
  for (const it of valid) byType.set(it.type, [...(byType.get(it.type) ?? []), it.id]);

  for (const [type, ids] of byType) {
    const { error } = await supabase.from(SOURCES[type].table).update({ deleted_at: null }).in("id", ids);
    if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "restored",
    entityType: "trash",
    entityName: `${valid.length} item(s)`,
  });
  return action(valid.length === 1 ? `${SOURCES[valid[0].type].label} restored` : `${valid.length} items restored`);
}

type PurgeClient = {
  from: (t: string) => {
    delete: () => {
      in: (c: string, v: string[]) => Promise<{ error: { message: string } | null }>;
      not: (c: string, op: string, v: null) => Promise<{ error: { message: string } | null }>;
    };
  };
};

/**
 * DELETE /api/trash — permanently delete trashed items. Accepts a bulk
 * { items: [{ type, id }] } or { all: true } to empty the entire trash.
 * Only ever touches rows that are already soft-deleted.
 */
export async function DELETE(request: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  const body = (await request.json().catch(() => null)) as
    | { items?: { type: TrashType; id: string }[]; all?: boolean }
    | null;

  const supabase = createClient() as unknown as PurgeClient;

  if (body?.all) {
    for (const src of Object.values(SOURCES)) {
      const { error } = await supabase.from(src.table).delete().not("deleted_at", "is", null);
      if (error) return apiError(500, "INTERNAL_ERROR", error.message);
    }
    await logActivity({
      userId: guard.user.id,
      userName: guard.user.name,
      action: "permanently deleted",
      entityType: "trash",
      entityName: "emptied trash",
    });
    return action("Trash emptied");
  }

  const valid = (body?.items ?? []).filter((it) => it && SOURCES[it.type] && it.id);
  if (valid.length === 0) return apiError(400, "VALIDATION_ERROR", "Nothing to delete");

  const byType = new Map<TrashType, string[]>();
  for (const it of valid) byType.set(it.type, [...(byType.get(it.type) ?? []), it.id]);

  for (const [type, ids] of byType) {
    const { error } = await supabase.from(SOURCES[type].table).delete().in("id", ids);
    if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  }

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "permanently deleted",
    entityType: "trash",
    entityName: `${valid.length} item(s)`,
  });
  return action(valid.length === 1 ? "Permanently deleted" : `${valid.length} items permanently deleted`);
}
