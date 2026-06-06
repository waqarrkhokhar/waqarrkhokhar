/**
 * Seed WordPress → new-site redirects.
 *
 * Decision A2: the client will supply the live WordPress URL export. Drop it at
 * data/redirects.csv with header columns:  source_url,target_url,type
 * (type optional, defaults to 301). If the file is absent, this step is a no-op
 * — the redirect map is loaded in Phase 14 (Migration).
 */
import { existsSync, readFileSync } from "node:fs";
import Papa from "papaparse";
import { admin, log } from "./lib";

type RedirectRow = { source_url: string; target_url: string; type?: string };

export async function seedRedirects() {
  const path = "data/redirects.csv";
  if (!existsSync(path)) {
    log("redirects", "no data/redirects.csv found — skipped (awaiting WP export)");
    return;
  }

  const db = admin();
  const parsed = Papa.parse<RedirectRow>(readFileSync(path, "utf8"), {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data
    .filter((r) => r.source_url?.trim() && r.target_url?.trim())
    .map((r) => ({
      source_url: r.source_url.trim(),
      target_url: r.target_url.trim(),
      type: r.type?.trim() === "302" ? 302 : 301,
      is_active: true,
    }));

  if (!rows.length) {
    log("redirects", "redirects.csv present but empty — skipped");
    return;
  }

  const { error } = await db
    .from("redirects")
    .upsert(rows, { onConflict: "source_url" });
  if (error) throw new Error(`redirects: ${error.message}`);
  log("redirects", `${rows.length} redirects upserted`);
}
