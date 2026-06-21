-- Swap Sofa Cum Bed product images from the old WordPress URLs to your Supabase
-- uploads, matched by file name. No project URL needed — the Supabase URL comes
-- straight from the Media Library.
--
-- BEFORE running this:
--   1. Upload the sofa-cum-bed images to Supabase (done).
--   2. Dashboard → Media Library → "Sync from Storage" (so they're indexed).
-- The image file names in Supabase must match the WordPress file names
-- (the part after the last "/"), e.g. comfyclub-velvet-futon-sofa-bed-1.webp.

-- ── Preview: how many images will be swapped vs still unmatched ──
-- (Run this SELECT first to check; it changes nothing.)
SELECT
  count(*) FILTER (WHERE m.url IS NOT NULL) AS will_swap,
  count(*) FILTER (WHERE m.url IS NULL)     AS unmatched
FROM product_images pi
JOIN products p   ON p.id = pi.product_id
JOIN categories c ON c.id = p.category_id
LEFT JOIN media m ON m.filename = regexp_replace(pi.url, '^.*/', '')
WHERE (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%';

-- ── Swap: replace WordPress URLs with the matching Supabase URL ──
UPDATE product_images pi
SET url = m.url
FROM products p, categories c, media m
WHERE pi.product_id = p.id
  AND p.category_id = c.id
  AND (c.slug = '/sofas/sofa-come-bed/' OR c.name ILIKE 'Sofa C_m Bed%')
  AND pi.url LIKE '%wp-content%'
  AND m.filename = regexp_replace(pi.url, '^.*/', '');
