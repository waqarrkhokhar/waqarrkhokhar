import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok, created } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

/** GET /api/users — team members (Users & Roles). */
export async function GET() {
  const guard = await requireCapability("users");
  if (!guard.ok) return guard.response;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, status, last_login, created_at")
    .order("created_at", { ascending: true });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);
  return ok(data ?? []);
}

const inviteSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["Super Admin", "Admin", "SEO Manager", "Product Manager", "Content Editor"]),
});

/** POST /api/users — invite a team member (Admins only). */
export async function POST(request: Request) {
  const guard = await requireCapability("users");
  if (!guard.ok) return guard.response;
  if (guard.user.role !== "Super Admin" && guard.user.role !== "Admin") {
    return apiError(403, "FORBIDDEN", "Only an Admin can invite users");
  }

  const body = await request.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  const { name, email, role } = parsed.data;

  const admin = createAdminClient();

  // Don't double-invite an existing member.
  const { data: existing } = await admin.from("users").select("id").eq("email", email).maybeSingle();
  if (existing) return apiError(409, "CONFLICT", "A user with that email already exists");

  // Create the auth user and send the invite email (Supabase Auth).
  const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email);
  if (inviteErr || !invited?.user) {
    return apiError(500, "INVITE_FAILED", inviteErr?.message ?? "Could not send the invitation. Check that email sending is configured in Supabase.");
  }

  const { data: row, error: insErr } = await admin
    .from("users")
    .insert({ id: invited.user.id, name, email, role, status: "invited" })
    .select("id, name, email, role, status, last_login, created_at")
    .single();
  if (insErr) return apiError(500, "INTERNAL_ERROR", insErr.message);

  await logActivity({
    userId: guard.user.id, userName: guard.user.name, action: "invited",
    entityType: "user", entityId: row.id, entityName: name,
  });
  return created(row);
}
