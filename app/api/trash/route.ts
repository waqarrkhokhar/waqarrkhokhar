import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError } from "@/lib/auth/guard";
import { ok, action } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

type TrashType = "blog" | "collection" | "parent" | "page" | "promotion" | "review";

// type → { table, label, name column, optional secondary text }
const SOURCES: Record<TrashType, { table: string; label: string; name: string; extra?: string }> = {
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

/** POST /api/trash — restore an item: { type, id }. */
export async function POST(request: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  const body = (await request.json().catch(() => null)) as { type?: TrashType; id?: string } | null;
  if (!body?.type || !body?.id || !SOURCES[body.type]) {
    return apiError(400, "VALIDATION_ERROR", "type and id are required");
  }
  const src = SOURCES[body.type];
  const supabase = createClient() as unknown as {
    from: (t: string) => { update: (v: Record<string, unknown>) => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> } };
  };
  const { error } = await supabase.from(src.table).update({ deleted_at: null }).eq("id", body.id);
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  await logActivity({
    userId: guard.user.id,
    userName: guard.user.name,
    action: "restored",
    entityType: body.type === "parent" ? "category" : body.type,
    entityId: body.id,
  });
  return action(`${src.label} restored`);
}
