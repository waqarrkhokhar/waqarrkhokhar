-- ============================================================================
-- COMFYCLUB — Migration 003: Functions, triggers, and the ratings view
-- ============================================================================

-- ── Auto-update updated_at on modified rows ─────────────────────────────────
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_parents_updated BEFORE UPDATE ON parent_categories
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_blog_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_pages_updated BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ── Auto-publish scheduled content (called by cron every 5 min) ─────────────
CREATE OR REPLACE FUNCTION publish_scheduled_content()
RETURNS void AS $$
BEGIN
  UPDATE products SET status = 'published', published_at = now()
  WHERE status = 'scheduled' AND scheduled_at <= now();

  UPDATE blog_posts SET status = 'published', published_at = now()
  WHERE status = 'scheduled' AND scheduled_at <= now();
END;
$$ LANGUAGE plpgsql;

-- ── Auto-expire promotions (called by cron every hour) ──────────────────────
CREATE OR REPLACE FUNCTION expire_promotions()
RETURNS void AS $$
BEGIN
  UPDATE promotions SET status = 'expired', is_active = false
  WHERE status = 'active' AND end_date IS NOT NULL AND end_date <= now();
END;
$$ LANGUAGE plpgsql;

-- ── Aggregate rating view (materialized for fast card/PDP reads) ────────────
CREATE MATERIALIZED VIEW product_ratings AS
SELECT
  product_id,
  ROUND(AVG(rating)::numeric, 1) AS avg_rating,
  COUNT(*)::integer AS review_count
FROM reviews
WHERE status = 'approved'
GROUP BY product_id;

CREATE UNIQUE INDEX idx_product_ratings_product ON product_ratings (product_id);

-- Refresh helper — call from API after approve/reject/delete:
--   SELECT refresh_product_ratings();
CREATE OR REPLACE FUNCTION refresh_product_ratings()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_ratings;
END;
$$ LANGUAGE plpgsql;
