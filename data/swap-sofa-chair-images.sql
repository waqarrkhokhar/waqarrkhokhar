/* Replace Sofa Chair product images with the Supabase uploads. */
/* Each product is identified from its existing image file names, then ALL */
/* its uploaded images are inserted (handles your reduced/changed counts). */
/* Run in Supabase SQL Editor. */

/* Armless Tufted Velvet Accent Chair  (5 images) */
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

/* Bohemian Boucle Accent Chair  (5 images) */
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

/* Button Tufted Wingback Accent Chair  (4 images) */
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

/* Modern Upholstered Corduroy Wide Armchair  (5 images) */
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

/* Dukinfield Upholstered Side Chair  (5 images) */
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

/* Fabric Upholstered Dining Chair with Arms  (4 images) */
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

/* George Oliver Accent Chair with Metal Legs  (4 images) */
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

/* Modern Single Sofa Chair for Bedroom and Office  (5 images) */
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

/* Solid Wood and Jute Rope Armrests Armchair  (4 images) */
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

/* Meribeth Upholstered Accent Chair  (5 images) */
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

/* Fabric Upholstered Single Sofa Chair for Living Room  (5 images) */
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


