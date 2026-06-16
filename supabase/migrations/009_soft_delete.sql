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
