-- ── Migration 016: separate mobile hero image per collection/category ───────
-- Each parent category and collection can now carry a second hero image shown
-- only on phones (banner_image = desktop, banner_image_mobile = mobile).
ALTER TABLE categories        ADD COLUMN IF NOT EXISTS banner_image_mobile TEXT;
ALTER TABLE parent_categories ADD COLUMN IF NOT EXISTS banner_image_mobile TEXT;
