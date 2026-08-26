import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability, apiError } from "@/lib/auth/guard";
import { ok } from "@/lib/api/respond";
import { logActivity } from "@/lib/activity";

type Params = { params: { id: string } };

export const dynamic = "force-dynamic";

/** POST /api/users/:id/logout — sign this user out of every device. */
export async function POST(_req: Request, { params }: Params) {
  const guard = await requireCapability("users");
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();
  const rpc = (admin as unknown as { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }> }).rpc;
  const { data, error } = await rpc("admin_revoke_user_sessions", { target: params.id });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  await logActivity({ userId: guard.user.id, userName: guard.user.name, action: "updated", entityType: "user", entityId: params.id, entityName: "signed out everywhere" });
  return ok({ revoked: (data as number) ?? 0 });
}
