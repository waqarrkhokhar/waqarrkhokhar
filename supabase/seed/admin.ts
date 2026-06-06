/**
 * Seed the initial Super Admin (Decision A9 — no plaintext password committed).
 *
 * Creates the auth user (email confirmed) with a random throwaway password,
 * then inserts the matching users row with role 'Super Admin'. The owner sets
 * their real password via the "Forgot Password" flow on first login (Phase 2).
 *
 * Override the email with SEED_ADMIN_EMAIL; defaults to comfyclub.pk@gmail.com.
 */
import { randomBytes } from "node:crypto";
import { admin, log } from "./lib";

export async function seedAdmin() {
  const db = admin();
  const email = process.env.SEED_ADMIN_EMAIL ?? "comfyclub.pk@gmail.com";
  const name = "Admin";

  // Is the auth user already present?
  const { data: list, error: listErr } = await db.auth.admin.listUsers();
  if (listErr) throw new Error(`list users: ${listErr.message}`);
  let authUser = list.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!authUser) {
    const password = randomBytes(24).toString("base64url");
    const { data, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw new Error(`create admin auth user: ${error.message}`);
    authUser = data.user;
    log("admin", `auth user created for ${email} (use "Forgot Password" to set your own)`);
  } else {
    log("admin", `auth user already exists for ${email}`);
  }

  const { error: rowErr } = await db.from("users").upsert(
    {
      id: authUser!.id,
      name,
      email,
      role: "Super Admin",
      status: "active",
    },
    { onConflict: "id" },
  );
  if (rowErr) throw new Error(`admin users row: ${rowErr.message}`);
  log("admin", `Super Admin profile ensured for ${email}`);
}
