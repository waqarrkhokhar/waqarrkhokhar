/**
 * Seed orchestrator. Run after the 5 migrations have been applied:
 *   pnpm db:seed
 *
 * Every step is idempotent (upserts) so it is safe to re-run.
 */
import { seedCatalog } from "./catalog";
import { seedProducts } from "./products";
import { seedSettings } from "./settings";
import { seedPages } from "./pages";
import { seedRedirects } from "./redirects";
import { seedAdmin } from "./admin";

async function main() {
  console.log("\n🌱 Seeding ComfyClub database...\n");
  await seedCatalog();
  await seedProducts();
  await seedSettings();
  await seedPages();
  await seedRedirects();
  await seedAdmin();
  console.log("\n✅ Seed complete.\n");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err.message ?? err);
  process.exit(1);
});
