-- =============================================================================
-- Set the site-wide default Open Graph / social-share image (1200 x 630).
-- Used on the homepage and any page without its own photo (policies, about,
-- contact, blog list). Product & category pages keep their own images.
--
-- Merges into the existing `branding` setting without touching the logos/favicon.
-- Run in: Supabase -> SQL Editor -> paste -> Run.
-- =============================================================================

-- NOTE: the ?v=2 on the end is a cache-buster. If you ever REPLACE the image at
-- the same URL again, bump it to ?v=3, ?v=4, ... so social sites re-fetch it.
UPDATE settings
SET value = value || jsonb_build_object(
      'og_image',
      'https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/1784968259974-vey8r7.webp?v=2'
    ),
    updated_at = now()
WHERE key = 'branding';

-- Verify
SELECT value ->> 'og_image' AS og_image FROM settings WHERE key = 'branding';
