-- ============================================================================
-- COMFYCLUB — Migration 006: Featured reviews
-- Lets staff feature standout reviews (shown first on the storefront).
-- ============================================================================

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_reviews_featured
  ON reviews (product_id, is_featured)
  WHERE status = 'approved';
