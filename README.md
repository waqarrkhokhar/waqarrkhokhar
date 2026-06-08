# ComfyClub

Made-to-order furniture storefront + CMS for [comfyclub.pk](https://comfyclub.pk).

**Stack:** Next.js 14 (App Router) · Supabase (PostgreSQL + Auth + Storage) ·
Tailwind CSS · Vercel.

> New here and not a coder? Read **[docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md)** —
> it walks you through everything step by step.

## Quick start (for developers)

```bash
pnpm install
cp .env.example .env.local      # fill in Supabase keys
# apply supabase/migrations/001..005 in the Supabase SQL editor
pnpm db:seed                    # load catalog, products, settings, admin
pnpm dev                        # http://localhost:3000
```

Verify the database connection: open `http://localhost:3000/api/health`.

## Project layout

| Path | What it is |
|------|-----------|
| `app/` | Pages, layouts, API routes |
| `components/` | UI components (added per phase) |
| `lib/` | Supabase clients, env, types, helpers |
| `supabase/migrations/` | Database schema (5 SQL files) |
| `supabase/seed/` | Seed scripts (`pnpm db:seed`) |
| `data/` | Source data (product CSV, content) |
| `docs/` | Plan, setup guide, decisions |

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Local development |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm db:seed` | Seed the database |

## Build progress

- Phase 1 — Foundation: ✅ complete
- Phase 2 — Authentication & Roles: ✅ complete
- Phase 3 — CMS Core (shared UI, DashTable, activity/settings helpers): ✅ complete
- Phase 4 — Product Management (API + list + tabbed editor + images): ✅ complete
- Phase 5 — Collection & Category Management (parents + collections CRUD): ✅ complete

See `docs/IMPLEMENTATION-PLAN.md` for the full 16-phase plan.
