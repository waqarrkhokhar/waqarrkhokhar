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
