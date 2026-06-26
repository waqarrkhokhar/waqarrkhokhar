SELECT pi.url AS current_url,
       'https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/'
         || regexp_replace(pi.url, '^.*/', '') AS new_url
FROM product_images pi
JOIN products p   ON p.id = pi.product_id
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%'
LIMIT 10;

UPDATE product_images pi
SET url = 'https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/'
          || regexp_replace(pi.url, '^.*/', '')
FROM products p, categories c
WHERE pi.product_id = p.id
  AND p.category_id = c.id
  AND (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%';

SELECT count(*) AS remaining_wordpress_images
FROM product_images pi
JOIN products p   ON p.id = pi.product_id
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%';

