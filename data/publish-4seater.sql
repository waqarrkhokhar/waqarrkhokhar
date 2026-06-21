-- Make the "4 Seater Sofas" collection and its products live on the storefront.
-- Safe to run multiple times. Run in Supabase → SQL Editor.

-- 1. Make sure the parent "Seater Sofas" and the 4-seater collection are published.
UPDATE parent_categories
SET status = 'published'
WHERE slug = '/seater-sofas/' AND status <> 'published';

UPDATE categories
SET status = 'published'
WHERE (slug = '/seater-sofas/4-seater-sofas/' OR name ILIKE '4 Seater%')
  AND status <> 'published';

-- 2. If the import didn't map the products to the collection, attach them by SKU
--    (4-seater SKUs look like CC-4S-001 …). Only fills products with no category.
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE (c.slug = '/seater-sofas/4-seater-sofas/' OR c.name ILIKE '4 Seater%')
  AND p.category_id IS NULL
  AND p.sku LIKE 'CC-4S-%'
  AND p.deleted_at IS NULL;

-- 3. Publish every product in the 4-seater collection that is still draft.
UPDATE products p
SET status = 'published',
    published_at = COALESCE(published_at, now())
FROM categories c
WHERE p.category_id = c.id
  AND (c.slug = '/seater-sofas/4-seater-sofas/' OR c.name ILIKE '4 Seater%')
  AND p.deleted_at IS NULL
  AND p.status <> 'published';
