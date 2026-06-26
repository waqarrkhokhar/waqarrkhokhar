DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='mid-century-wingback-upholstered-accent-chair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='mid-century-wingback-upholstered-accent-chair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-wingback-upholstered-accent-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-wingback-upholstered-accent-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-wingback-upholstered-accent-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-wingback-upholstered-accent-chair-4.webp', 3)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='soft-velvet-upholstered-accent-chair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='soft-velvet-upholstered-accent-chair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-soft-velvet-upholstered-accent-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-soft-velvet-upholstered-accent-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-soft-velvet-upholstered-accent-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-soft-velvet-upholstered-accent-chair-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-soft-velvet-upholstered-accent-chair-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-spindle-accent-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-spindle-accent-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-spindle-accent-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-spindle-accent-chair-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-spindle-accent-chair-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='wide-tufted-armchair-with-solid-wood-legs' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='wide-tufted-armchair-with-solid-wood-legs' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-tufted-armchair-solid-wood-legs-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-tufted-armchair-solid-wood-legs-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-tufted-armchair-solid-wood-legs-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-tufted-armchair-solid-wood-legs-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-tufted-armchair-solid-wood-legs-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='mustard-yellow-velvet-accent-chair-with-metal-legs' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='mustard-yellow-velvet-accent-chair-with-metal-legs' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='modern-boucle-wingback-armchair-with-solid-wood-legs' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='modern-boucle-wingback-armchair-with-solid-wood-legs' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-wingback-armchair-solid-wood-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-wingback-armchair-solid-wood-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-wingback-armchair-solid-wood-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-wingback-armchair-solid-wood-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-wingback-armchair-solid-wood-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='curved-upholstered-single-sofa-chair-for-living-room' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='curved-upholstered-single-sofa-chair-for-living-room' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/modern-curved-upholstered-boucle-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/modern-curved-upholstered-boucle-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/modern-curved-upholstered-boucle-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/modern-curved-upholstered-boucle-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/modern-curved-upholstered-boucle-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='plush-lambswool-style-side-chair-with-metal-legs' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='plush-lambswool-style-side-chair-with-metal-legs' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-plush-lambswool-side-chair-metal-legs-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-plush-lambswool-side-chair-metal-legs-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-plush-lambswool-side-chair-metal-legs-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-plush-lambswool-side-chair-metal-legs-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-plush-lambswool-side-chair-metal-legs-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='willow-single-seat-lounge-chair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='willow-single-seat-lounge-chair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-willow-single-seat-lounge-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-willow-single-seat-lounge-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-willow-single-seat-lounge-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-willow-single-seat-lounge-chair-4.webp', 3)
) AS v(url, ord);

SELECT p.slug, count(*) AS image_count,
       sum((pi.url LIKE '%wp-content%')::int) AS still_on_wordpress
FROM products p
JOIN product_images pi ON pi.product_id = p.id
WHERE p.slug IN (
  'mid-century-wingback-upholstered-accent-chair',
  'soft-velvet-upholstered-accent-chair',
  'comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room',
  'wide-tufted-armchair-with-solid-wood-legs',
  'mustard-yellow-velvet-accent-chair-with-metal-legs',
  'modern-boucle-wingback-armchair-with-solid-wood-legs',
  'curved-upholstered-single-sofa-chair-for-living-room',
  'plush-lambswool-style-side-chair-with-metal-legs',
  'willow-single-seat-lounge-chair'
)
GROUP BY p.slug
ORDER BY p.slug;
