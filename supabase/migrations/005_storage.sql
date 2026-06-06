-- ============================================================================
-- COMFYCLUB — Migration 005: Storage buckets + policies (Blueprint §6)
-- Public read (frontend needs image access); authenticated write/delete.
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('products', 'products', true),
  ('blog', 'blog', true),
  ('media', 'media', true),
  ('reviews', 'reviews', true),
  ('promotions', 'promotions', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for all image buckets.
CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('products', 'blog', 'media', 'reviews', 'promotions', 'avatars'));

-- Authenticated upload.
CREATE POLICY "Auth upload storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('products', 'blog', 'media', 'reviews', 'promotions', 'avatars'));

-- Authenticated update (e.g. replace file).
CREATE POLICY "Auth update storage" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('products', 'blog', 'media', 'reviews', 'promotions', 'avatars'));

-- Authenticated delete.
CREATE POLICY "Auth delete storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('products', 'blog', 'media', 'reviews', 'promotions', 'avatars'));
