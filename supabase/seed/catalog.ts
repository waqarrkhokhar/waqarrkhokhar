/**
 * Seed the catalog: 3 parent categories + 13 child collections.
 * (Decision A1 — full URL structure; data-less collections seed as 'draft'.)
 *
 * Collection.slug stores the full path, e.g. "/sofas/sofa-chair/".
 * Parent.slug stores "/sofas/", "/seater-sofas/", "/furniture/".
 */
import { readFileSync } from "node:fs";
import { admin, log } from "./lib";

type ParentSeed = { name: string; slug: string; sort: number };
type CollectionSeed = {
  name: string;
  slug: string;
  parentSlug: string;
  sort: number;
  /** true → has CSV products → seed as published. */
  populated?: boolean;
};

const PARENTS: ParentSeed[] = [
  { name: "Sofas", slug: "/sofas/", sort: 0 },
  { name: "Seater Sofas", slug: "/seater-sofas/", sort: 1 },
  { name: "Furniture", slug: "/furniture/", sort: 2 },
];

const COLLECTIONS: CollectionSeed[] = [
  // Sofas
  { name: "Sofa Chair", slug: "/sofas/sofa-chair/", parentSlug: "/sofas/", sort: 0, populated: true },
  { name: "Sofa Cum Bed", slug: "/sofas/sofa-come-bed/", parentSlug: "/sofas/", sort: 1, populated: true },
  { name: "L Shape Sofas", slug: "/sofas/l-shape-sofas/", parentSlug: "/sofas/", sort: 2 },
  { name: "Deewan Sofas", slug: "/sofas/deewan-sofas/", parentSlug: "/sofas/", sort: 3 },
  { name: "Settee Sofas", slug: "/sofas/settee-sofas/", parentSlug: "/sofas/", sort: 4 },
  { name: "Ottoman Sofas", slug: "/sofas/ottoman-sofas/", parentSlug: "/sofas/", sort: 5 },
  // Seater Sofas
  { name: "2 Seater Sofas", slug: "/seater-sofas/2-seater-sofas/", parentSlug: "/seater-sofas/", sort: 0, populated: true },
  { name: "3 Seater Sofas", slug: "/seater-sofas/3-seater-sofas/", parentSlug: "/seater-sofas/", sort: 1 },
  { name: "4 Seater Sofas", slug: "/seater-sofas/4-seater-sofas/", parentSlug: "/seater-sofas/", sort: 2 },
  { name: "5 Seater Sofas", slug: "/seater-sofas/5-seater-sofas/", parentSlug: "/seater-sofas/", sort: 3 },
  { name: "6 Seater Sofas", slug: "/seater-sofas/6-seater-sofas/", parentSlug: "/seater-sofas/", sort: 4 },
  // Furniture
  { name: "Single Bed", slug: "/furniture/single-bed/", parentSlug: "/furniture/", sort: 0 },
  { name: "Double Bed", slug: "/furniture/double-bed/", parentSlug: "/furniture/", sort: 1 },
  { name: "Dining Table Sets", slug: "/furniture/dining-table-sets/", parentSlug: "/furniture/", sort: 2 },
];

/** Optional long-form intro content shipped with the package. */
function introFor(slug: string): string | null {
  try {
    if (slug === "/sofas/sofa-chair/") {
      const arr = JSON.parse(readFileSync("data/content-sofa-chair.json", "utf8"));
      return Array.isArray(arr) ? arr.slice(1, 3).join("\n\n") : null;
    }
    if (slug === "/seater-sofas/2-seater-sofas/") {
      const arr = JSON.parse(readFileSync("data/content-two-seater.json", "utf8"));
      return Array.isArray(arr) ? arr.slice(1, 3).join("\n\n") : null;
    }
  } catch {
    /* content file optional */
  }
  return null;
}

export async function seedCatalog() {
  const db = admin();

  // Parents
  for (const p of PARENTS) {
    const { error } = await db
      .from("parent_categories")
      .upsert(
        { name: p.name, slug: p.slug, sort_order: p.sort, status: "published" },
        { onConflict: "slug" },
      );
    if (error) throw new Error(`parent ${p.slug}: ${error.message}`);
  }
  log("catalog", `${PARENTS.length} parent categories upserted`);

  // Map parent slug → id
  const { data: parents, error: pErr } = await db
    .from("parent_categories")
    .select("id, slug");
  if (pErr) throw pErr;
  const parentId = new Map(parents!.map((r) => [r.slug, r.id]));

  // Collections
  for (const c of COLLECTIONS) {
    const pid = parentId.get(c.parentSlug);
    if (!pid) throw new Error(`missing parent for ${c.slug}`);
    const { error } = await db.from("categories").upsert(
      {
        parent_id: pid,
        name: c.name,
        slug: c.slug,
        sort_order: c.sort,
        intro_content: introFor(c.slug),
        status: c.populated ? "published" : "draft",
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`collection ${c.slug}: ${error.message}`);
  }
  log(
    "catalog",
    `${COLLECTIONS.length} collections upserted (${COLLECTIONS.filter((c) => c.populated).length} published, rest draft)`,
  );
}
