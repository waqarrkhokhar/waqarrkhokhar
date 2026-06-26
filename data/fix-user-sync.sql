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

DROP TRIGGER IF EXISTS tr_auth_user_created ON auth.users;
CREATE TRIGGER tr_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

INSERT INTO public.users (id, name, email, role, status)
SELECT u.id,
       coalesce(nullif(u.raw_user_meta_data->>'name', ''), split_part(u.email, '@', 1)),
       u.email,
       'SEO & Product Manager',
       'active'
FROM auth.users u
LEFT JOIN public.users p ON p.id = u.id
WHERE p.id IS NULL
  AND u.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

SELECT email, role, status FROM public.users ORDER BY created_at;

