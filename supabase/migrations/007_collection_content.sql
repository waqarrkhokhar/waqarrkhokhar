-- ============================================================================
-- COMFYCLUB — Migration 007: Collection long-form page content
-- Rich HTML rendered on the storefront below the product grid + pagination,
-- edited from the dashboard Collection editor (Content tab).
-- ============================================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS content_html TEXT;
