-- 1) How many published products have NO category (these can't appear in any
--    collection listing, so they stay orphaned even after the grid fix).
SELECT count(*) AS uncategorized_published
FROM products
WHERE status = 'published' AND deleted_at IS NULL AND category_id IS NULL;

-- 2) The actual uncategorized products (so we can assign each to a collection).
SELECT p.name, p.slug
FROM products p
WHERE p.status = 'published' AND p.deleted_at IS NULL AND p.category_id IS NULL
ORDER BY p.name;

-- 3) Published product count per collection (helps confirm the grid fix covers them).
SELECT c.name AS collection, c.slug, count(p.id) AS published_products
FROM categories c
LEFT JOIN products p ON p.category_id = c.id AND p.status = 'published' AND p.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.name, c.slug
ORDER BY published_products DESC;
