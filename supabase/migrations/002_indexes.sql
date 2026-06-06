-- ============================================================================
-- COMFYCLUB — Migration 002: Indexes (from ERD performance analysis)
-- ============================================================================

-- ── Products (most queried table) ───────────────────────────────────────────
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_products_category ON products (category_id) WHERE status = 'published';
CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_featured ON products (is_featured)
  WHERE is_featured = true AND status = 'published';
CREATE INDEX idx_products_sale ON products (sale_price)
  WHERE sale_price IS NOT NULL AND status = 'published';
CREATE INDEX idx_products_scheduled ON products (scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_products_price_asc ON products (COALESCE(sale_price, price) ASC)
  WHERE status = 'published';
CREATE INDEX idx_products_price_desc ON products (COALESCE(sale_price, price) DESC)
  WHERE status = 'published';
CREATE INDEX idx_products_created ON products (created_at DESC);
CREATE INDEX idx_products_search ON products USING GIN (
  to_tsvector(
    'english',
    COALESCE(name, '') || ' ' || COALESCE(short_description, '') || ' ' || COALESCE(sku, '')
  )
);

-- ── Categories ──────────────────────────────────────────────────────────────
CREATE INDEX idx_categories_parent ON categories (parent_id);
CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_categories_featured ON categories (is_featured) WHERE is_featured = true;

-- ── Product images ──────────────────────────────────────────────────────────
CREATE INDEX idx_product_images_product ON product_images (product_id);

-- ── Reviews ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_reviews_product_approved ON reviews (product_id) WHERE status = 'approved';
CREATE INDEX idx_reviews_pending ON reviews (id) WHERE status = 'pending';
CREATE INDEX idx_reviews_product_all ON reviews (product_id, status);

-- ── WhatsApp leads ──────────────────────────────────────────────────────────
CREATE INDEX idx_leads_date ON whatsapp_leads (created_at DESC);
CREATE INDEX idx_leads_product ON whatsapp_leads (product_id);
CREATE INDEX idx_leads_status ON whatsapp_leads (status);

-- ── Blog ────────────────────────────────────────────────────────────────────
CREATE INDEX idx_blog_slug ON blog_posts (slug);
CREATE INDEX idx_blog_status ON blog_posts (status, published_at DESC);
CREATE INDEX idx_blog_category ON blog_posts (category) WHERE status = 'published';
CREATE INDEX idx_blog_scheduled ON blog_posts (scheduled_at) WHERE status = 'scheduled';

-- ── Pages ───────────────────────────────────────────────────────────────────
CREATE INDEX idx_pages_slug ON pages (slug);

-- ── Media ───────────────────────────────────────────────────────────────────
CREATE INDEX idx_media_folder ON media (folder);
CREATE INDEX idx_media_date ON media (created_at DESC);

-- ── Promotions ──────────────────────────────────────────────────────────────
CREATE INDEX idx_promotions_active ON promotions (is_active) WHERE is_active = true;

-- ── Redirects (CRITICAL: checked on every request by middleware) ────────────
CREATE INDEX idx_redirects_source ON redirects (source_url) WHERE is_active = true;

-- ── Error logs ──────────────────────────────────────────────────────────────
CREATE INDEX idx_errors_url ON error_logs (url);
CREATE INDEX idx_errors_hits ON error_logs (hits DESC) WHERE is_resolved = false;

-- ── Activity logs ───────────────────────────────────────────────────────────
CREATE INDEX idx_activity_date ON activity_logs (created_at DESC);
CREATE INDEX idx_activity_entity ON activity_logs (entity_type, entity_id);
CREATE INDEX idx_activity_user ON activity_logs (user_id);

-- ── Search queries ──────────────────────────────────────────────────────────
CREATE INDEX idx_search_date ON search_queries (created_at DESC);
CREATE INDEX idx_search_query ON search_queries (query);

-- ── Contact submissions ─────────────────────────────────────────────────────
CREATE INDEX idx_contact_status ON contact_submissions (status);
CREATE INDEX idx_contact_date ON contact_submissions (created_at DESC);
