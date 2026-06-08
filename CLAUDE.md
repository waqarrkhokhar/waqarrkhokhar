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
Phases 1–4 complete (Foundation, Auth & Roles, CMS Core, Product Management).
Phases 5–16 pending.

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
