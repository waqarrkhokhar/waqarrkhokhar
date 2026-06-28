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
      'announcement_bar', 'branding', 'footer_config', 'site_url',
      'search_console_verification', 'custom_schemas',
      'robots_extra', 'robots_block_ai', 'site_verifications'
    )
  );
CREATE POLICY "staff read all settings" ON settings
  FOR SELECT TO authenticated USING (has_role('Super Admin','Admin'));
CREATE POLICY "manage settings" ON settings
  FOR ALL TO authenticated
  USING (has_role('Super Admin','Admin'))
  WITH CHECK (has_role('Super Admin','Admin'));
