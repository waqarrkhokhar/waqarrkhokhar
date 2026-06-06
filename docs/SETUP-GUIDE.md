# ComfyClub — Plain-Language Setup Guide

This guide is written for a non-technical owner. It explains, in simple steps,
what Phase 1 built and what you need to do to bring it online. Take it slowly —
you can do one section at a time, and you can always ask me to do or re-explain
any step.

> **You do NOT need to write any code.** These steps are mostly creating free
> accounts and copying/pasting a few values.

---

## What Phase 1 is

Phase 1 is the **foundation** — the skeleton everything else is built on. It
does not yet have the visible website or the admin dashboard (those come in
later phases). What it gives us:

1. A working Next.js app that builds and deploys.
2. The full **database design** (all 17 tables) ready to create in Supabase.
3. **Security rules** so the public can only see published content.
4. **Seed scripts** that load your 3 categories, 13 collections, all 60
   products, your business info, and your admin account.
5. A **health check** page to confirm the database is connected.

---

## The 4 accounts we'll use (all have free tiers)

| Service | What it does | Cost |
|---------|--------------|------|
| **Supabase** | Database + login system + image storage | Free to start |
| **Vercel** | Hosts the website | Free to start |
| **Cloudflare** | Speed + security + connects your domain | Free |
| **Resend** | Sends emails (contact form) — used later | Free to start |

You likely already have the **comfyclub.pk** domain. We'll connect it at the
very end (Phase 16), so there's no rush and no downtime to your current site.

---

## Step-by-step

### Step 1 — Create a Supabase project
1. Go to **supabase.com** and sign up (Google login is fine).
2. Click **New Project**.
3. Name it `comfyclub`. Choose a strong database password (save it somewhere).
4. For **Region**, pick **Mumbai (ap-south-1)** — it's closest to Pakistan.
5. Wait ~2 minutes for it to finish setting up.

### Step 2 — Get your keys
1. In Supabase, open **Project Settings → API**.
2. Copy these three values and send them to me (or paste into `.env.local`):
   - **Project URL**
   - **anon public** key
   - **service_role** key  ⚠️ *secret — never share publicly or put on a website*

### Step 3 — Create the database tables
1. In Supabase, open the **SQL Editor**.
2. Open each file in `supabase/migrations/` **in order** and run them:
   - `001_tables.sql`
   - `002_indexes.sql`
   - `003_functions_triggers.sql`
   - `004_rls.sql`
   - `005_storage.sql`
3. Each should say "Success". (I can do this for you if you give me access, or
   guide you click-by-click.)

### Step 4 — Load the starting data
On a computer with the project, after putting the keys into `.env.local`:
```
pnpm install
pnpm db:seed
```
This loads the catalog, 60 products, settings, the 6 core pages, and your admin
account. It's safe to run more than once.

### Step 5 — Set your admin password
The seed creates your admin account (`comfyclub.pk@gmail.com`) but **without a
password you know**. Once the login page exists (Phase 2), you'll click
**"Forgot password"** to set your own. (This is the secure way — no password is
ever stored in the code.)

### Step 6 — Deploy to Vercel
1. Go to **vercel.com** and sign up with your GitHub account.
2. Import this repository.
3. In **Settings → Environment Variables**, add the same values from your
   `.env.local` (I'll give you the exact list).
4. Click **Deploy**. You'll get a temporary web address to preview it.

### Step 7 — Confirm it works
Open `your-vercel-address/api/health`. You should see something like:
```
{ "status": "ok", "database": "connected", "published_products": 59, ... }
```
That means the website and database are talking to each other. 🎉

---

## What I need from you to continue

- The three Supabase keys (Step 2).
- Confirmation that the 5 SQL files ran successfully (Step 3), or access for me
  to do it.

Once Phase 1 is confirmed working, tell me and I'll begin **Phase 2
(Authentication & Roles)** — the secure login and the user-permission system.

---

*Stuck on any step? Just tell me which step number and what you see, and I'll
walk you through it.*
