-- ── Migration 017: self-service login-session management ────────────────────
-- Supabase stores every login in auth.sessions (id, ip, user_agent, timestamps).
-- The auth schema isn't exposed to the API, so these SECURITY DEFINER functions
-- let a signed-in user list and revoke ONLY their own sessions (filtered by
-- auth.uid()). Used by the dashboard "Active Login Sessions" panel.

-- List the caller's own active sessions.
CREATE OR REPLACE FUNCTION public.list_my_sessions()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  not_after timestamptz,
  ip text,
  user_agent text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT s.id, s.created_at, s.updated_at, s.not_after,
         regexp_replace(s.ip::text, '/[0-9]+$', '') AS ip,
         s.user_agent
  FROM auth.sessions s
  WHERE s.user_id = auth.uid()
  ORDER BY s.updated_at DESC NULLS LAST, s.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.list_my_sessions() FROM public;
GRANT EXECUTE ON FUNCTION public.list_my_sessions() TO authenticated;

-- Revoke (terminate) one of the caller's own sessions. Returns true if removed.
CREATE OR REPLACE FUNCTION public.revoke_my_session(session_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE removed integer;
BEGIN
  DELETE FROM auth.sessions WHERE id = session_id AND user_id = auth.uid();
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.revoke_my_session(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.revoke_my_session(uuid) TO authenticated;

-- Revoke ALL of the caller's other sessions, keeping the current one. Returns count.
CREATE OR REPLACE FUNCTION public.revoke_other_sessions(keep_session_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE removed integer;
BEGIN
  DELETE FROM auth.sessions WHERE user_id = auth.uid() AND id <> keep_session_id;
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.revoke_other_sessions(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.revoke_other_sessions(uuid) TO authenticated;
