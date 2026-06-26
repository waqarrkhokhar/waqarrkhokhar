SELECT 'COLLECTION' AS section, c.id::text, c.name, c.slug, c.status,
       CASE WHEN c.deleted_at IS NULL THEN 'live' ELSE 'TRASHED' END AS state
FROM categories c
WHERE c.slug = '/seater-sofas/5-seater-sofas/' OR c.name ILIKE '5 Seater%';

SELECT 'LIVE PRODUCTS' AS section, count(*) AS visible_on_site
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/seater-sofas/5-seater-sofas/' OR c.name ILIKE '5 Seater%')
  AND p.deleted_at IS NULL
  AND p.status = 'published';

SELECT 'TRASHED PRODUCTS' AS section, p.name, p.slug, p.status, p.deleted_at
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/seater-sofas/5-seater-sofas/' OR c.name ILIKE '5 Seater%')
  AND p.deleted_at IS NOT NULL
ORDER BY p.deleted_at DESC;

SELECT 'HIDDEN (NOT PUBLISHED)' AS section, p.name, p.slug, p.status
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/seater-sofas/5-seater-sofas/' OR c.name ILIKE '5 Seater%')
  AND p.deleted_at IS NULL
  AND p.status <> 'published'
ORDER BY p.name;

SELECT 'DUPLICATE SLUGS' AS section, p.slug, count(*) AS copies
FROM products p
WHERE p.deleted_at IS NULL
GROUP BY p.slug
HAVING count(*) > 1
ORDER BY copies DESC;

SELECT 'EMPTY SLUG' AS section, p.id::text, p.name, p.status
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/seater-sofas/5-seater-sofas/' OR c.name ILIKE '5 Seater%')
  AND p.deleted_at IS NULL
  AND (p.slug IS NULL OR btrim(p.slug) = '');

SELECT 'NO IMAGES' AS section, p.name, p.slug
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/seater-sofas/5-seater-sofas/' OR c.name ILIKE '5 Seater%')
  AND p.deleted_at IS NULL
  AND p.status = 'published'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id)
ORDER BY p.name;
