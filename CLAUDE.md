# CLAUDE.md — ComfyClub project guide for AI assistants

## About the owner
The repository owner is **not a programmer** and relies on the assistant to do
all coding, explain things in plain language, and give simple step-by-step
instructions for anything they must do themselves (creating accounts, pasting
keys, clicking buttons). Avoid jargon. Never assume coding knowledge.

## Project
ComfyClub — a made-to-order furniture brand in Lahore (comfyclub.pk). This repo
is a full rebuild of the storefront + CMS, migrating off WordPress.

**Stack:** Next.js 14 (App Router) · Supabase (Postgres + Auth + Storage) ·
Tailwind CSS · Vercel · Cloudflare · Resend · GA4.

## Source of truth
The `/docs` folder and the original handoff documents are authoritative:
Production Spec, Engineering Blueprint, ERD, API Spec, Implementation Roadmap,
Gap-Resolution Spec. Follow them strictly. Do not invent or remove
functionality. `docs/IMPLEMENTATION-PLAN.md` holds the approved plan, locked
decisions (A1–A9), and the 16-phase breakdown.

## Build rules
- Mobile-first, SEO-first, scalable.
- **Design fidelity is a hard requirement.** The storefront must match the
  storefront prototype (`ComfyClub Prototype.html` + `cc-*.jsx`) and the
  dashboard must match `ComfyClub Dashboard.html` + `dash-*.jsx` — exact
  layout, sections, components, spacing, colours, and interactions, not a
  simplified version.
- **Design ⊇ docs.** If something appears in the design/prototype but is not in
  the written spec, build it anyway. The design is itself a requirement.
- Everything CMS-managed — NO hardcoded categories, products, SEO, banners, or
  navigation.
- Every workflow needs a start AND an end. No dead-ends, no placeholders left
  in shipped phases.
- Work one phase at a time; do not start a later phase until the current one is
  reviewed and approved.

## Conventions
- TypeScript strict. Path alias `@/*` → repo root.
- Supabase clients: `lib/supabase/client.ts` (browser, anon),
  `server.ts` (RSC/route handlers, anon + cookies), `admin.ts` (service role,
  server-only — bypasses RLS, for public writes + scripts).
- DB schema lives in `supabase/migrations/` (001–005). Seed in
  `supabase/seed/` (run with `pnpm db:seed`).
- Public writes (reviews/leads/contact/404/search) go through service-role API
  routes; table RLS blocks direct anonymous access.

## Useful commands
- `pnpm dev` — local dev server
- `pnpm build` — production build (must pass before any phase is "done")
- `pnpm typecheck` / `pnpm lint`
- `pnpm db:seed` — seed the database (needs real Supabase keys in `.env.local`)

## Status
Phases 1–5 complete. Phase 6 (SEO System) — migration-safety infrastructure
done: redirects, 404 monitor, sitemaps, robots. Remaining Phase 6 (per-page
JSON-LD, generateMetadata, bulk SEO editor, schema manager) is bundled with the
storefront in Phase 13 (no public pages exist yet to attach them to).
Phases 7–12 complete (Homepage, Blog, Reviews, Promotions, WhatsApp Leads, Analytics). Phases 13–16 pending. Scope expanded to include prototype-only extras (Custom Fields, Structure/Metadata/Schema/Sitemap/Robots managers, Header/Footer Builder, Content Blocks, etc.) per owner request.

## Poshish Wala Business Tool notes
- Route `/tool` (top-level, outside storefront/dashboard route groups; `noindex`).
- Self-contained client-side SPA: dashboard, clients, client detail, expenses,
  reports, quotation builder, invoice — all data in `localStorage`
  (`poshishwala:app`). No server/API/DB; nothing CMS-managed here by design.
- Component: `components/tool/PoshishWalaTool.tsx`. Logos in `public/tool/`.
- Faithful port of the Claude Design prototype `PoshishWala.dc.html` (Poppins,
  teal `#1f7a6d` palette — deliberately its own look, not the ComfyClub brand).
  Print/PDF via `window.print()` with `@media print` rules scoped to `.pw-app`.

## Homepage Builder notes (Phase 7)
- `/api/settings` (GET all / PATCH key) — cap `settings`. `homepage_config`
  key holds section_order, hero_slides, trusted_by, trending/offers
  mode+pins, why_items, how_steps.
- UI: `components/dashboard/homepage/*` (HomepageBuilder + generic ListEditor,
  ProductPinPicker). Fully CMS-driven; storefront consumes it in Phase 13.

## SEO infra notes (Phase 6)
- `/api/redirects/*` (CRUD + `/import` CSV), `/api/errors/*` (404 log+resolve).
- `middleware.ts` checks `lib/redirects/lookup.ts` for storefront paths (301/302,
  fail-open if Supabase unset). 404 logging endpoint is public via service role.
- `/sitemap.xml` index + `/sitemap-{pages,products,collections,blog}.xml`,
  `/robots.txt` — all `force-dynamic`, 1h cache. Helper `lib/seo/sitemap.ts`.
- UI: `components/dashboard/seo/*` (SeoHub tabs: RedirectManager, Monitor404).
- PENDING INPUT: WordPress live-URL export to populate the redirect map (A2).

## Catalog module notes (Phase 5)
- API: `app/api/parents/*`, `app/api/collections/*` (+ `[id]/products`,
  `[id]/reorder`). `lib/catalog/{query,schema}.ts`.
- One category per product (`products.category_id`): assigning = set
  category_id; removing = NULL; reorder = `products.sort_order`.
- Parent slug `/x/`; collection slug nests `/parent/child/`. Parent delete
  cascades collections; products survive (SET NULL). Deletes are Admin-only.
- UI: `components/dashboard/catalog/*` (ParentManager modal, CollectionList,
  CollectionEditor Basic/Media/Content/Products/SEO, CollectionProducts).

## Product module notes (Phase 4)
- API: `app/api/products/*` (list/create, [id] get/patch/delete-archive,
  duplicate, bulk, health, export), `app/api/products/[id]/images/*`,
  `app/api/media/upload`, `app/api/catalog` (dropdown data).
- Helpers: `lib/products/{schema,query,revalidate}.ts`, `lib/slug.ts`,
  `lib/seo/score.ts`, `lib/api/client.ts` (client fetch).
- UI: `components/dashboard/products/*` (ProductList, ProductEditor with
  Basic/Media/Classification/SEO tabs, ProductImages).
- Deferred by design (no dead-ends): CSV **import** → Phase 14 (Migration);
  editor **Reviews tab** → Phase 9; storefront **Preview** → Phase 13.

## Shared UI / helpers (Phase 3) — reuse these in later phases
- UI primitives in `components/ui/`: `Button`, `Field`/`Input`/`Textarea`/
  `Select`, `Badge` (+`statusTone`), `Skeleton`, `EmptyState`, `Modal`/
  `ConfirmDialog`, `Toast` (`ToastProvider` + `useToast`).
- `components/dashboard/shared/DashTable.tsx`: generic table (pagination,
  sorting, selection, bulk actions, loading/empty). Used by all list views.
- Server helpers: `lib/activity.ts` (`logActivity`), `lib/settings.ts`
  (`getSetting`/`getSettings`/`setSetting`), `lib/api/respond.ts`
  (`ok`/`created`/`action`/`paginated`/`parseListParams`).
- `ToastProvider` + `NotificationBell` are mounted in `DashShell`.

## Auth notes (Phase 2)
- Login `/dashboard/login`; reset `/dashboard/reset-password`; auth API under
  `app/api/auth/*`. Session via httpOnly cookies (`@supabase/ssr`).
- `middleware.ts` refreshes the session and gates `/dashboard/*`.
- Server guards in `lib/auth/`: `getCurrentUser`, `requireAuth`,
  `requireCapability`; permission matrix in `lib/auth/permissions.ts`.
- Authenticated dashboard pages live in the `app/dashboard/(panel)/` route
  group (sidebar + theme); login/reset stay outside it.
- Version pin: `@supabase/supabase-js@2.45.6` + `@supabase/ssr@0.5.2` (do not
  bump to supabase-js 2.107 — its stricter type engine breaks the ssr 0.5.2
  server client typings against the hand-written Database types).
