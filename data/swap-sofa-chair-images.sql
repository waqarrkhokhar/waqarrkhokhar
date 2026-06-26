DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='armless-tufted-velvet-accent-chair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='armless-tufted-velvet-accent-chair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-armless-tufted-velvet-accent-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-armless-tufted-velvet-accent-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-armless-tufted-velvet-accent-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-armless-tufted-velvet-accent-chair-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-armless-tufted-velvet-accent-chair-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='bohemian-boucle-accent-chair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='bohemian-boucle-accent-chair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-bohemian-boucle-accent-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-bohemian-boucle-accent-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-bohemian-boucle-accent-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-bohemian-boucle-accent-chair-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-bohemian-boucle-accent-chair-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='button-tufted-wingback-accent-chair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='button-tufted-wingback-accent-chair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-button-tufted-wingback-accent-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-button-tufted-wingback-accent-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-button-tufted-wingback-accent-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-button-tufted-wingback-accent-chair-4.webp', 3)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='modern-upholstered-corduroy-wide-armchair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='modern-upholstered-corduroy-wide-armchair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-wide-armchair-bolster-pillows-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-wide-armchair-bolster-pillows-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-wide-armchair-bolster-pillows-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-wide-armchair-bolster-pillows-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-wide-armchair-bolster-pillows-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='dukinfield-upholstered-side-chair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='dukinfield-upholstered-side-chair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-dukinfield-upholstered-side-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-dukinfield-upholstered-side-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-dukinfield-upholstered-side-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-dukinfield-upholstered-side-chair-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-dukinfield-upholstered-side-chair-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='fabric-upholstered-dining-chair-with-arms' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='fabric-upholstered-dining-chair-with-arms' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-upholstered-dining-chair-with-arms-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-upholstered-dining-chair-with-arms-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-upholstered-dining-chair-with-arms-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-upholstered-dining-chair-with-arms-4.webp', 3)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='george-oliver-accent-chair-with-metal-legs' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='george-oliver-accent-chair-with-metal-legs' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-george-oliver-accent-chair-metal-legs-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-george-oliver-accent-chair-metal-legs-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-george-oliver-accent-chair-metal-legs-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-george-oliver-accent-chair-metal-legs-4.webp', 3)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='modern-single-sofa-chair-for-bedroom-and-office' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='modern-single-sofa-chair-for-bedroom-and-office' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='solid-wood-and-jute-rope-armrests-armchair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='solid-wood-and-jute-rope-armrests-armchair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-metal-legs-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-metal-legs-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-metal-legs-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-holiway-flannel-accent-chair-metal-legs-4.webp', 3)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='meribeth-upholstered-accent-chair' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='meribeth-upholstered-accent-chair' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-meribeth-upholstered-accent-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-meribeth-upholstered-accent-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-meribeth-upholstered-accent-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-meribeth-upholstered-accent-chair-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-meribeth-upholstered-accent-chair-5.webp', 4)
) AS v(url, ord);

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug='fabric-upholstered-single-sofa-chair-for-living-room' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE slug='fabric-upholstered-single-sofa-chair-for-living-room' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-modern-lounge-chair-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-modern-lounge-chair-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-modern-lounge-chair-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-modern-lounge-chair-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-modern-lounge-chair-5.webp', 4)
) AS v(url, ord);


