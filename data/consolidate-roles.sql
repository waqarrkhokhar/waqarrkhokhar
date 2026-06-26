UPDATE users SET role = 'SEO & Product Manager'
WHERE role IN ('SEO Manager', 'Product Manager', 'Content Editor');

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('Super Admin', 'Admin', 'SEO & Product Manager'));

ALTER TABLE users ALTER COLUMN role SET DEFAULT 'SEO & Product Manager';

CREATE OR REPLACE FUNCTION has_role(VARIADIC roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.status = 'active'
      AND (
        u.role = ANY(roles)
        OR (u.role = 'SEO & Product Manager'
            AND (ARRAY['Product Manager','SEO Manager','Content Editor']::text[] && roles))
      )
  );
$$;

DROP POLICY IF EXISTS "staff read all promotions" ON promotions;
CREATE POLICY "staff read all promotions" ON promotions
  FOR SELECT TO authenticated
  USING (has_role('Super Admin','Admin','SEO & Product Manager'));

DROP POLICY IF EXISTS "manage promotions" ON promotions;
CREATE POLICY "manage promotions" ON promotions
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','SEO & Product Manager'))
  WITH CHECK (has_role('Super Admin','Admin','SEO & Product Manager'));

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE display_name text;
BEGIN
  display_name := coalesce(
    nullif(new.raw_user_meta_data->>'name', ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    split_part(new.email, '@', 1)
  );
  INSERT INTO public.users (id, name, email, role, status)
  VALUES (new.id, display_name, new.email, 'SEO & Product Manager', 'active')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

