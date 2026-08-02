-- =============================================================================
-- Mobile hero images for collections/categories + set the 2 Seater hero.
-- Run in: Supabase -> SQL Editor -> paste -> Run.  (Run this FIRST, before
-- editing categories in the dashboard, so the new field exists.)
-- =============================================================================

-- 1) Add the mobile hero column to both tables (safe to re-run).
ALTER TABLE categories        ADD COLUMN IF NOT EXISTS banner_image_mobile TEXT;
ALTER TABLE parent_categories ADD COLUMN IF NOT EXISTS banner_image_mobile TEXT;

-- 2) Set the 2 Seater Sofas hero: desktop + mobile.
UPDATE categories
SET banner_image        = 'https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/1785684690553-qrif4y.webp',  -- desktop
    banner_image_mobile = 'https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/1785684681516-at86ed.webp',  -- mobile
    updated_at = now()
WHERE slug = '/seater-sofas/2-seater-sofas/';

-- Verify
SELECT slug, banner_image AS desktop, banner_image_mobile AS mobile
FROM categories WHERE slug = '/seater-sofas/2-seater-sofas/';
