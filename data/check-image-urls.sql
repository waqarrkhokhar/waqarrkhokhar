-- Diagnose product image URLs. Run in Supabase → SQL Editor and share the
-- results. Nothing is changed by this file.

-- 1. WordPress vs Supabase image counts, per collection.
SELECT c.name AS collection,
       count(*) FILTER (WHERE pi.url LIKE '%wp-content%') AS wordpress,
       count(*) FILTER (WHERE pi.url LIKE '%supabase%')   AS supabase_urls,
       count(*) AS total
FROM product_images pi
JOIN products p   ON p.id = pi.product_id
JOIN categories c ON c.id = p.category_id
WHERE p.deleted_at IS NULL
GROUP BY c.name
ORDER BY c.name;

-- 2. Example sofa-cum-bed image file names still on WordPress.
SELECT regexp_replace(pi.url, '^.*/', '') AS wp_filename
FROM product_images pi
JOIN products p   ON p.id = pi.product_id
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%'
LIMIT 10;

-- 3. How many Supabase uploads are indexed in the Media Library, and a sample
--    of their file names (so we can compare them to the WordPress names above).
SELECT count(*) AS media_count FROM media;
SELECT filename, url FROM media ORDER BY created_at DESC LIMIT 10;
