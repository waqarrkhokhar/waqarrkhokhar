-- ── Migration 018: admin can force-log-out a user everywhere ────────────────
-- Deletes all of a target user's Supabase sessions. SECURITY DEFINER, and
-- granted ONLY to service_role (called from a user-management API route that
-- checks the caller's permission first).
CREATE OR REPLACE FUNCTION public.admin_revoke_user_sessions(target uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE removed integer;
BEGIN
  DELETE FROM auth.sessions WHERE user_id = target;
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_revoke_user_sessions(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_user_sessions(uuid) TO service_role;
