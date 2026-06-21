-- Swap Sofa Cum Bed product images from WordPress to Supabase.
-- Your Supabase files use the SAME file names as WordPress and live at:
--   https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/<filename>
-- This keeps each file name and just changes the domain. Run in Supabase.
-- Only touches sofa-cum-bed products (other collections keep their WP images
-- until their Supabase images are uploaded).

-- ── Preview first (changes nothing): old vs new URL ──
SELECT pi.url AS current_url,
       'https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/'
         || regexp_replace(pi.url, '^.*/', '') AS new_url
FROM product_images pi
JOIN products p   ON p.id = pi.product_id
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%'
LIMIT 10;

-- ── Apply the swap ──
UPDATE product_images pi
SET url = 'https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/'
          || regexp_replace(pi.url, '^.*/', '')
FROM products p, categories c
WHERE pi.product_id = p.id
  AND p.category_id = c.id
  AND (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%';

-- ── Verify none remain ──
SELECT count(*) AS remaining_wordpress_images
FROM product_images pi
JOIN products p   ON p.id = pi.product_id
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%';
