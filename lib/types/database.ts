/**
 * Database types for the ComfyClub Supabase schema (17 tables + 1 view).
 *
 * Hand-written to match supabase/migrations/001_tables.sql. After the project
 * is linked you can regenerate this with:
 *   supabase gen types typescript --linked > lib/types/database.generated.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ── Domain enums (mirror the SQL CHECK constraints) ──────────────────────────
export type ProductStatus = "draft" | "published" | "archived" | "scheduled";
export type CatalogStatus = "draft" | "published";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type BlogStatus = "draft" | "published" | "scheduled";
export type PageStatus = "draft" | "published";
export type PageType = "core" | "policy" | "custom";
export type LeadType = "order" | "quote" | "consultation" | "general";
export type LeadStatus = "new" | "contacted" | "converted" | "lost";
export type ContactStatus = "new" | "read" | "replied" | "closed";
export type PromotionType =
  | "announcement_bar"
  | "popup"
  | "hero_banner"
  | "collection_banner";
export type PromotionStatus = "draft" | "active" | "expired" | "paused";
export type UserRole =
  | "Super Admin"
  | "Admin"
  | "SEO Manager"
  | "Product Manager"
  | "Content Editor";
export type UserStatus = "active" | "suspended" | "invited";

type Timestamps = { created_at: string };
type WithUpdated = { updated_at: string };
type SoftDelete = { deleted_at: string | null };

// Helper to build the standard table shape supabase-js expects.
type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      parent_categories: Table<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        banner_image: string | null;
        seo_content: Json;
        meta_title: string | null;
        meta_description: string | null;
        focus_keyword: string | null;
        canonical_url: string | null;
        og_image: string | null;
        robots: string | null;
        sort_order: number;
        status: CatalogStatus;
      } & Timestamps & WithUpdated & SoftDelete>;

      categories: Table<{
        id: string;
        parent_id: string;
        name: string;
        slug: string;
        description: string | null;
        banner_image: string | null;
        intro_content: string | null;
        content_html: string | null;
        seo_content: Json;
        meta_title: string | null;
        meta_description: string | null;
        focus_keyword: string | null;
        canonical_url: string | null;
        og_image: string | null;
        robots: string | null;
        schema_enabled: boolean;
        sort_order: number;
        is_featured: boolean;
        status: CatalogStatus;
      } & Timestamps & WithUpdated & SoftDelete>;

      products: Table<{
        id: string;
        name: string;
        slug: string;
        sku: string | null;
        price: number | null;
        sale_price: number | null;
        sale_start: string | null;
        sale_end: string | null;
        short_description: string | null;
        long_description: string | null;
        features: string | null;
        category_id: string | null;
        status: ProductStatus;
        scheduled_at: string | null;
        is_featured: boolean;
        is_bestseller: boolean;
        is_trending: boolean;
        sort_order: number;
        meta_title: string | null;
        meta_description: string | null;
        focus_keyword: string | null;
        secondary_keywords: string[] | null;
        canonical_url: string | null;
        og_title: string | null;
        og_description: string | null;
        og_image: string | null;
        robots: string | null;
        whatsapp_message_template: string | null;
        published_at: string | null;
      } & Timestamps & WithUpdated & SoftDelete>;

      product_images: Table<{
        id: string;
        product_id: string;
        url: string;
        alt_text: string | null;
        sort_order: number;
        is_primary: boolean;
      }>;

      reviews: Table<{
        id: string;
        product_id: string;
        name: string;
        city: string | null;
        rating: number;
        text: string;
        image_url: string | null;
        admin_reply: string | null;
        admin_reply_at: string | null;
        status: ReviewStatus;
        is_featured: boolean;
      } & Timestamps & SoftDelete>;

      whatsapp_leads: Table<{
        id: string;
        product_id: string | null;
        product_name: string | null;
        message_type: LeadType;
        source_page: string | null;
        status: LeadStatus;
        notes: string | null;
      } & Timestamps>;

      blog_posts: Table<{
        id: string;
        title: string;
        slug: string;
        content: string | null;
        excerpt: string | null;
        featured_image: string | null;
        category: string;
        tags: string[] | null;
        author: string;
        status: BlogStatus;
        scheduled_at: string | null;
        meta_title: string | null;
        meta_description: string | null;
        focus_keyword: string | null;
        canonical_url: string | null;
        og_title: string | null;
        og_description: string | null;
        robots: string | null;
        faqs: Json | null;
        internal_links: Json | null;
        published_at: string | null;
      } & Timestamps & WithUpdated & SoftDelete>;

      pages: Table<{
        id: string;
        title: string;
        slug: string;
        type: PageType;
        content: string | null;
        banner_image: string | null;
        meta_title: string | null;
        meta_description: string | null;
        focus_keyword: string | null;
        canonical_url: string | null;
        og_image: string | null;
        schema_enabled: boolean;
        schema_type: string;
        status: PageStatus;
      } & Timestamps & WithUpdated & SoftDelete>;

      media: Table<{
        id: string;
        filename: string;
        url: string;
        thumbnail_url: string | null;
        webp_url: string | null;
        alt_text: string | null;
        title: string | null;
        mime_type: string | null;
        size_bytes: number | null;
        width: number | null;
        height: number | null;
        folder: string;
      } & Timestamps>;

      promotions: Table<{
        id: string;
        title: string;
        type: PromotionType;
        content: string | null;
        cta_text: string | null;
        cta_url: string | null;
        background_color: string | null;
        text_color: string | null;
        image_url: string | null;
        start_date: string | null;
        end_date: string | null;
        is_active: boolean;
        show_on_mobile: boolean;
        show_on_desktop: boolean;
        display_delay_seconds: number;
        display_frequency: string;
        impressions: number;
        clicks: number;
        status: PromotionStatus;
      } & Timestamps & SoftDelete>;

      redirects: Table<{
        id: string;
        source_url: string;
        target_url: string;
        type: number;
        is_active: boolean;
        hits: number;
        last_hit: string | null;
      } & Timestamps>;

      error_logs: Table<{
        id: string;
        url: string;
        referrer: string | null;
        user_agent: string | null;
        hits: number;
        last_seen: string;
        is_resolved: boolean;
      } & Timestamps>;

      users: Table<{
        id: string;
        name: string;
        email: string;
        role: UserRole;
        avatar_url: string | null;
        last_login: string | null;
        status: UserStatus;
        notification_prefs: Json;
        created_at: string;
      }>;

      activity_logs: Table<{
        id: string;
        user_id: string | null;
        user_name: string | null;
        action: string;
        entity_type: string;
        entity_id: string | null;
        entity_name: string | null;
        details: Json | null;
      } & Timestamps>;

      contact_submissions: Table<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        subject: string | null;
        message: string;
        status: ContactStatus;
      } & Timestamps>;

      search_queries: Table<{
        id: string;
        query: string;
        results_count: number;
        clicked_product_id: string | null;
      } & Timestamps>;

      settings: Table<{
        key: string;
        value: Json;
        updated_at: string;
      }>;
    };
    Views: {
      product_ratings: {
        Row: {
          product_id: string;
          avg_rating: number;
          review_count: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      refresh_product_ratings: { Args: Record<string, never>; Returns: undefined };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
