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
Phases 1 (Foundation) and 2 (Authentication & Roles) complete.
Phases 3–16 pending.

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
