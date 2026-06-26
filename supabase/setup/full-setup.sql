
-- ===================== 001_tables.sql =====================
-- ============================================================================
-- COMFYCLUB — Migration 001: Tables
-- 17 base tables. Schema follows the ERD (source of truth). Conflict
-- resolutions from the engineering review are applied:
--   • whatsapp_leads has NO phone_number/customer_name/message columns
--   • categories has schema_enabled only (NO schema_type column)
--   • media has NO used_by column (usage is computed by URL scan)
--   • error_logs uses is_resolved (NOT redirect_created)
-- ============================================================================

-- Required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── 1. PARENT CATEGORIES ────────────────────────────────────────────────────
CREATE TABLE parent_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  banner_image TEXT,
  seo_content JSONB DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  og_image TEXT,
  robots TEXT DEFAULT 'index, follow',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 2. CATEGORIES (child collections) ───────────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES parent_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  banner_image TEXT,
  intro_content TEXT,
  seo_content JSONB DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  og_image TEXT,
  robots TEXT DEFAULT 'index, follow',
  schema_enabled BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 3. PRODUCTS ─────────────────────────────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE,
  price INTEGER,
  sale_price INTEGER,
  sale_start TIMESTAMPTZ,
  sale_end TIMESTAMPTZ,
  short_description TEXT,
  long_description TEXT,
  features TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
  scheduled_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  secondary_keywords TEXT[],
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  robots TEXT DEFAULT 'index, follow',
  whatsapp_message_template TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- ── 4. PRODUCT IMAGES ───────────────────────────────────────────────────────
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

-- ── 5. REVIEWS ──────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT,
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  image_url TEXT,
  admin_reply TEXT,
  admin_reply_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 6. WHATSAPP LEADS ───────────────────────────────────────────────────────
CREATE TABLE whatsapp_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  message_type TEXT NOT NULL
    CHECK (message_type IN ('order', 'quote', 'consultation', 'general')),
  source_page TEXT,
  status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 7. BLOG POSTS ───────────────────────────────────────────────────────────
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  author TEXT DEFAULT 'Admin',
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled')),
  scheduled_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  faqs JSONB,
  internal_links JSONB,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 8. PAGES ────────────────────────────────────────────────────────────────
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'custom' CHECK (type IN ('core', 'policy', 'custom')),
  content TEXT,
  banner_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  og_image TEXT,
  schema_enabled BOOLEAN DEFAULT false,
  schema_type TEXT DEFAULT 'WebPage',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 9. MEDIA LIBRARY ────────────────────────────────────────────────────────
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  webp_url TEXT,
  alt_text TEXT,
  title TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  folder TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 10. PROMOTIONS ──────────────────────────────────────────────────────────
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('announcement_bar', 'popup', 'hero_banner', 'collection_banner')),
  content TEXT,
  cta_text TEXT,
  cta_url TEXT,
  background_color TEXT,
  text_color TEXT,
  image_url TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT false,
  show_on_mobile BOOLEAN DEFAULT true,
  show_on_desktop BOOLEAN DEFAULT true,
  display_delay_seconds INTEGER DEFAULT 0,
  display_frequency TEXT DEFAULT 'every_visit',
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'expired', 'paused')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 11. REDIRECTS ───────────────────────────────────────────────────────────
CREATE TABLE redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  type INTEGER DEFAULT 301 CHECK (type IN (301, 302)),
  is_active BOOLEAN DEFAULT true,
  hits INTEGER DEFAULT 0,
  last_hit TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 12. ERROR LOGS (404 monitor) ────────────────────────────────────────────
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  hits INTEGER DEFAULT 1,
  last_seen TIMESTAMPTZ DEFAULT now(),
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 13. USERS (extends Supabase auth.users) ─────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'Content Editor'
    CHECK (role IN ('Super Admin', 'Admin', 'SEO Manager', 'Product Manager', 'Content Editor')),
  avatar_url TEXT,
  last_login TIMESTAMPTZ,
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'invited')),
  notification_prefs JSONB DEFAULT '{"products":true,"reviews":true,"seo":true,"system":true}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 14. ACTIVITY LOGS ───────────────────────────────────────────────────────
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_name TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 15. CONTACT SUBMISSIONS ─────────────────────────────────────────────────
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 16. SEARCH QUERIES ──────────────────────────────────────────────────────
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  clicked_product_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 17. SETTINGS (key-value store) ──────────────────────────────────────────
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);


-- ===================== 002_indexes.sql =====================
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


-- ===================== 003_functions_triggers.sql =====================
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


-- ===================== 004_rls.sql =====================
-- ============================================================================
-- COMFYCLUB — Migration 004: Row Level Security
--
-- Model:
--   • Frontend (anon) can READ published/approved/active content only.
--   • Dashboard (authenticated) can MANAGE per the role permissions matrix.
--   • Public WRITES (review/lead/contact/404/search submissions) are performed
--     server-side via the service-role key, which bypasses RLS — so NO
--     anonymous INSERT policies are defined here (review = §1.4 resolution).
-- ============================================================================

-- ── Role helpers (SECURITY DEFINER → bypass users RLS, no recursion) ────────
CREATE OR REPLACE FUNCTION current_app_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE id = auth.uid() AND status = 'active';
$$;

CREATE OR REPLACE FUNCTION has_role(VARIADIC roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT current_app_role() = ANY(roles);
$$;

-- ── Enable RLS on every table ───────────────────────────────────────────────
ALTER TABLE parent_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_leads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages              ENABLE ROW LEVEL SECURITY;
ALTER TABLE media              ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings           ENABLE ROW LEVEL SECURITY;

-- ── PARENT CATEGORIES ───────────────────────────────────────────────────────
CREATE POLICY "public read published parents" ON parent_categories
  FOR SELECT USING (status = 'published');
CREATE POLICY "staff read all parents" ON parent_categories
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin','Product Manager','SEO Manager'));
CREATE POLICY "manage parents" ON parent_categories
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','Product Manager'))
  WITH CHECK (has_role('Super Admin','Admin','Product Manager'));

-- ── CATEGORIES (collections) ────────────────────────────────────────────────
CREATE POLICY "public read published collections" ON categories
  FOR SELECT USING (status = 'published');
CREATE POLICY "staff read all collections" ON categories
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin','Product Manager','SEO Manager'));
CREATE POLICY "manage collections" ON categories
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','Product Manager'))
  WITH CHECK (has_role('Super Admin','Admin','Product Manager'));

-- ── PRODUCTS ────────────────────────────────────────────────────────────────
CREATE POLICY "public read published products" ON products
  FOR SELECT USING (status = 'published');
CREATE POLICY "staff read all products" ON products
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin','Product Manager','SEO Manager','Content Editor'));
CREATE POLICY "manage products" ON products
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','Product Manager'))
  WITH CHECK (has_role('Super Admin','Admin','Product Manager'));

-- ── PRODUCT IMAGES (read tied to published parent product) ──────────────────
CREATE POLICY "public read images of published products" ON product_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.status = 'published')
  );
CREATE POLICY "staff read all images" ON product_images
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin','Product Manager','SEO Manager','Content Editor'));
CREATE POLICY "manage images" ON product_images
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','Product Manager'))
  WITH CHECK (has_role('Super Admin','Admin','Product Manager'));

-- ── REVIEWS (public reads approved only; submission via service role) ────────
CREATE POLICY "public read approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');
CREATE POLICY "staff read all reviews" ON reviews
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin','Product Manager'));
CREATE POLICY "manage reviews" ON reviews
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','Product Manager'))
  WITH CHECK (has_role('Super Admin','Admin','Product Manager'));

-- ── WHATSAPP LEADS (no public read; submission via service role) ────────────
CREATE POLICY "manage leads" ON whatsapp_leads
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','Product Manager'))
  WITH CHECK (has_role('Super Admin','Admin','Product Manager'));

-- ── BLOG POSTS ──────────────────────────────────────────────────────────────
CREATE POLICY "public read published blog" ON blog_posts
  FOR SELECT USING (status = 'published');
CREATE POLICY "staff read all blog" ON blog_posts
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin','SEO Manager','Content Editor'));
CREATE POLICY "manage blog" ON blog_posts
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','SEO Manager','Content Editor'))
  WITH CHECK (has_role('Super Admin','Admin','SEO Manager','Content Editor'));

-- ── PAGES ───────────────────────────────────────────────────────────────────
CREATE POLICY "public read published pages" ON pages
  FOR SELECT USING (status = 'published');
CREATE POLICY "staff read all pages" ON pages
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin','SEO Manager','Content Editor'));
CREATE POLICY "manage pages" ON pages
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','SEO Manager','Content Editor'))
  WITH CHECK (has_role('Super Admin','Admin','SEO Manager','Content Editor'));

-- ── MEDIA (any authenticated staff may upload/manage; delete = admins) ──────
CREATE POLICY "public read media" ON media
  FOR SELECT USING (true);
CREATE POLICY "staff upload media" ON media
  FOR INSERT TO authenticated WITH CHECK (current_app_role() IS NOT NULL);
CREATE POLICY "staff update media" ON media
  FOR UPDATE TO authenticated USING (current_app_role() IS NOT NULL);
CREATE POLICY "admins delete media" ON media
  FOR DELETE TO authenticated USING (has_role('Super Admin','Admin'));

-- ── PROMOTIONS (public reads active; manage = admins) ───────────────────────
CREATE POLICY "public read active promotions" ON promotions
  FOR SELECT USING (
    is_active = true
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date > now())
  );
CREATE POLICY "staff read all promotions" ON promotions
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin'));
CREATE POLICY "manage promotions" ON promotions
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin'))
  WITH CHECK (has_role('Super Admin','Admin'));

-- ── REDIRECTS (lookup done in middleware via service role; manage = SEO) ────
CREATE POLICY "manage redirects" ON redirects
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','SEO Manager'))
  WITH CHECK (has_role('Super Admin','Admin','SEO Manager'));

-- ── ERROR LOGS (logging via service role; staff read/resolve) ───────────────
CREATE POLICY "staff read errors" ON error_logs
  FOR SELECT TO authenticated USING (current_app_role() IS NOT NULL);
CREATE POLICY "staff update errors" ON error_logs
  FOR UPDATE TO authenticated USING (has_role('Super Admin','Admin','SEO Manager'));

-- ── USERS (self-read; Super Admin manages everyone) ─────────────────────────
CREATE POLICY "read own user row" ON users
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "super admin read users" ON users
  FOR SELECT TO authenticated USING (has_role('Super Admin'));
CREATE POLICY "super admin manage users" ON users
  FOR ALL TO authenticated
  USING (has_role('Super Admin'))
  WITH CHECK (has_role('Super Admin'));

-- ── ACTIVITY LOGS (staff read; writes via service role helper) ──────────────
CREATE POLICY "staff read activity" ON activity_logs
  FOR SELECT TO authenticated USING (current_app_role() IS NOT NULL);

-- ── CONTACT SUBMISSIONS (submission via service role; manage = admins) ───────
CREATE POLICY "manage contact" ON contact_submissions
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin'))
  WITH CHECK (has_role('Super Admin','Admin'));

-- ── SEARCH QUERIES (logging via service role; analytics read = staff) ───────
CREATE POLICY "staff read searches" ON search_queries
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin','SEO Manager'));

-- ── SETTINGS (whitelist of non-secret keys is public; manage = admins) ──────
CREATE POLICY "public read public settings" ON settings
  FOR SELECT USING (
    key IN (
      'business_info', 'social_links', 'whatsapp_templates',
      'homepage_config', 'ga4_id', 'gtm_id', 'search_console_property',
      'announcement_bar'
    )
  );
CREATE POLICY "staff read all settings" ON settings
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin'));
CREATE POLICY "manage settings" ON settings
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin'))
  WITH CHECK (has_role('Super Admin','Admin'));


-- ===================== 005_storage.sql =====================
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


-- ===================== 006_review_featured.sql =====================
-- ============================================================================
-- COMFYCLUB — Migration 006: Featured reviews
-- Lets staff feature standout reviews (shown first on the storefront).
-- ============================================================================

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_reviews_featured
  ON reviews (product_id, is_featured)
  WHERE status = 'approved';


-- ===================== 007_collection_content.sql =====================
-- ============================================================================
-- COMFYCLUB — Migration 007: Collection long-form page content
-- Rich HTML rendered on the storefront below the product grid + pagination,
-- edited from the dashboard Collection editor (Content tab).
-- ============================================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS content_html TEXT;


-- ===================== 008_blog_robots.sql =====================
-- ============================================================================
-- COMFYCLUB — Migration 008: Blog post robots directive
-- Lets staff mark a post noindex (e.g. filler/sample posts) from the editor.
-- ============================================================================

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS robots TEXT DEFAULT 'index, follow';


-- ===================== 009_soft_delete.sql =====================
-- 009_soft_delete.sql — Trash / Bin support.
-- Adds a nullable deleted_at timestamp to the main content tables. A row with
-- deleted_at set is "in the trash": hidden from the storefront and from normal
-- dashboard lists, but fully restoreable until permanently deleted.

alter table if exists products          add column if not exists deleted_at timestamptz;
alter table if exists categories        add column if not exists deleted_at timestamptz;
alter table if exists parent_categories add column if not exists deleted_at timestamptz;
alter table if exists blog_posts        add column if not exists deleted_at timestamptz;
alter table if exists pages             add column if not exists deleted_at timestamptz;
alter table if exists promotions        add column if not exists deleted_at timestamptz;
alter table if exists reviews           add column if not exists deleted_at timestamptz;

create index if not exists idx_products_deleted_at          on products(deleted_at);
create index if not exists idx_categories_deleted_at        on categories(deleted_at);
create index if not exists idx_parent_categories_deleted_at on parent_categories(deleted_at);
create index if not exists idx_blog_posts_deleted_at        on blog_posts(deleted_at);
create index if not exists idx_pages_deleted_at             on pages(deleted_at);
create index if not exists idx_promotions_deleted_at        on promotions(deleted_at);
create index if not exists idx_reviews_deleted_at           on reviews(deleted_at);

-- Exclude trashed reviews from the aggregate rating view.
DROP MATERIALIZED VIEW IF EXISTS product_ratings;
CREATE MATERIALIZED VIEW product_ratings AS
SELECT
  product_id,
  ROUND(AVG(rating)::numeric, 1) AS avg_rating,
  COUNT(*)::integer AS review_count
FROM reviews
WHERE status = 'approved' AND deleted_at IS NULL
GROUP BY product_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_ratings_product ON product_ratings (product_id);


-- ===================== 010_auth_user_sync.sql =====================
-- 010_auth_user_sync.sql — Mirror new Supabase Auth users into public.users.
-- Workflow: add a user's email in Supabase → Authentication; they automatically
-- appear in Dashboard → Users & Roles, where you set their role. (Without this,
-- auth users never get a public.users row and can't be assigned a role.)

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
begin
  display_name := coalesce(
    nullif(new.raw_user_meta_data->>'name', ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    split_part(new.email, '@', 1)
  );

  insert into public.users (id, name, email, role, status)
  values (new.id, display_name, new.email, 'Content Editor', 'active')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists tr_auth_user_created on auth.users;
create trigger tr_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Backfill any existing auth users that don't yet have a profile row.
insert into public.users (id, name, email, role, status)
select u.id,
       coalesce(nullif(u.raw_user_meta_data->>'name', ''), split_part(u.email, '@', 1)),
       u.email, 'Content Editor', 'active'
from auth.users u
left join public.users p on p.id = u.id
where p.id is null and u.email is not null
on conflict (id) do nothing;


-- ===================== 011_consolidate_roles.sql =====================
-- Consolidate dashboard roles to three: Super Admin, Admin, SEO & Product Manager.
-- Run the WHOLE file in Supabase SQL Editor. Safe to run once.

-- 1. Remap existing users to the new roles (before tightening the constraint).
UPDATE users SET role = 'SEO & Product Manager'
WHERE role IN ('SEO Manager', 'Product Manager', 'Content Editor');

-- 2. Allow only the three roles.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('Super Admin', 'Admin', 'SEO & Product Manager'));

-- 3. New users default to the manager role.
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'SEO & Product Manager';

-- 4. has_role(): the manager role satisfies any policy that allowed the old
--    Product Manager / SEO Manager / Content Editor roles, so existing RLS
--    policies keep working without rewriting all of them.
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

-- 5. Promotions were admin-only; allow the manager role to handle them too.
DROP POLICY IF EXISTS "staff read all promotions" ON promotions;
CREATE POLICY "staff read all promotions" ON promotions
  FOR SELECT TO authenticated
  USING (has_role('Super Admin','Admin','SEO & Product Manager'));

DROP POLICY IF EXISTS "manage promotions" ON promotions;
CREATE POLICY "manage promotions" ON promotions
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin','SEO & Product Manager'))
  WITH CHECK (has_role('Super Admin','Admin','SEO & Product Manager'));

-- 6. New Supabase Auth users land as the manager role.
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

