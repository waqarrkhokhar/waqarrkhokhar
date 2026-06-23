/* Replace 2 Seater Sofa product images with the Supabase uploads. */
/* Matched to each product by its existing image file names, targeted by SKU */
/* (stable even though slugs changed). Deletes old images, inserts new set. */
/* Run in Supabase SQL Editor. */

/* Billijo Scalloped Back Velvet Loveseat  [CC-2S-003]  (4 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-003' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-003' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-billijo-scalloped-velvet-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-billijo-scalloped-velvet-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-billijo-scalloped-velvet-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-billijo-scalloped-velvet-loveseat-4.webp', 3)
) AS v(url, ord);

/* Boucle Tufted Upholstered Loveseat  [CC-2S-001]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-001' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-001' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-boucle-tufted-upholstered-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-boucle-tufted-upholstered-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-boucle-tufted-upholstered-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-boucle-tufted-upholstered-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-boucle-tufted-upholstered-loveseat-5.webp', 4)
) AS v(url, ord);

/* Mid Century 2 Seater Sofa with Separate Cushions  [CC-2S-005]  (6 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-005' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-005' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-upholstered-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-upholstered-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-upholstered-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-upholstered-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-upholstered-loveseat-5.webp', 4),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-corduroy-upholstered-loveseat-6.webp', 5)
) AS v(url, ord);

/* Luxury 2 Seater Sofa with Ribbed Back and Gold Metal Legs  [CC-2S-007]  (6 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-007' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-007' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-demetrius-channel-tufted-velvet-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-demetrius-channel-tufted-velvet-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-demetrius-channel-tufted-velvet-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-demetrius-channel-tufted-velvet-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-demetrius-channel-tufted-velvet-loveseat-5.webp', 4),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-demetrius-channel-tufted-velvet-loveseat-6.webp', 5)
) AS v(url, ord);

/* Button Tufted Two Seater Sofa with Rolled Arms and Turned Wood Legs  [CC-2S-020]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-020' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-020' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-chesterfield-2-seater-sofa-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-chesterfield-2-seater-sofa-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-chesterfield-2-seater-sofa-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-chesterfield-2-seater-sofa-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-fabric-chesterfield-2-seater-sofa-5.webp', 4)
) AS v(url, ord);

/* Minimalist 2 Seater Sofa with Gold Legs for Bedroom and Lounge  [CC-2S-008]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-008' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-008' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-flovilla-curved-organic-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-flovilla-curved-organic-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-flovilla-curved-organic-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-flovilla-curved-organic-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-flovilla-curved-organic-loveseat-5.webp', 4)
) AS v(url, ord);

/* Hendrix Velvet Scalloped Loveseat  [CC-2S-011]  (6 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-011' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-011' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-hendrix-velvet-scalloped-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-hendrix-velvet-scalloped-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-hendrix-velvet-scalloped-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-hendrix-velvet-scalloped-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-hendrix-velvet-scalloped-loveseat-5.webp', 4),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-hendrix-velvet-scalloped-loveseat-6.webp', 5)
) AS v(url, ord);

/* Jopath Mini Channel Tufted Boucle Loveseat  [CC-2S-012]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-012' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-012' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-5.webp', 4)
) AS v(url, ord);

/* ComfyClub Square Arm Loveseat  [CC-2S-006]  (4 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-006' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-006' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-linen-square-arm-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-linen-square-arm-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-linen-square-arm-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-linen-square-arm-loveseat-4.webp', 3)
) AS v(url, ord);

/* Mid Century Corduroy Barrel Back Loveseat  [CC-2S-014]  (6 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-014' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-014' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-corduroy-barrel-back-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-corduroy-barrel-back-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-corduroy-barrel-back-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-corduroy-barrel-back-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-corduroy-barrel-back-loveseat-5.webp', 4),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-corduroy-barrel-back-loveseat-6.webp', 5)
) AS v(url, ord);

/* Mid Century Modern Scalloped Back Loveseat  [CC-2S-002]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-002' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-002' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-scalloped-back-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-scalloped-back-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-scalloped-back-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-scalloped-back-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-mid-century-scalloped-back-loveseat-5.webp', 4)
) AS v(url, ord);

/* Modern Boucle Curved Loveseat  [CC-2S-010]  (4 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-010' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-010' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-curved-low-profile-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-curved-low-profile-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-curved-low-profile-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-boucle-curved-low-profile-loveseat-4.webp', 3)
) AS v(url, ord);

/* Modern Curved Arm Boucle Loveseat  [CC-2S-013]  (6 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-013' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-013' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-curved-arm-boucle-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-curved-arm-boucle-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-curved-arm-boucle-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-curved-arm-boucle-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-curved-arm-boucle-loveseat-5.webp', 4),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-modern-curved-arm-boucle-loveseat-6.webp', 5)
) AS v(url, ord);

/* Provence Chesterfield Tufted Loveseat  [CC-2S-015]  (6 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-015' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-015' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-provence-chesterfield-tufted-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-provence-chesterfield-tufted-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-provence-chesterfield-tufted-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-provence-chesterfield-tufted-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-provence-chesterfield-tufted-loveseat-5.webp', 4),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-provence-chesterfield-tufted-loveseat-6.webp', 5)
) AS v(url, ord);

/* Rattan and Linen Upholstered Loveseat  [CC-2S-019]  (4 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-019' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-019' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-rattan-linen-upholstered-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-rattan-linen-upholstered-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-rattan-linen-upholstered-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-rattan-linen-upholstered-loveseat-4.webp', 3)
) AS v(url, ord);

/* Sidwell Channel Tufted Loveseat  [CC-2S-016]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-016' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-016' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-sidwell-channel-tufted-wave-back-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-sidwell-channel-tufted-wave-back-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-sidwell-channel-tufted-wave-back-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-sidwell-channel-tufted-wave-back-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-sidwell-channel-tufted-wave-back-loveseat-5.webp', 4)
) AS v(url, ord);

/* Terren Farmhouse Loveseat  [CC-2S-018]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-018' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-018' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-exposed-wood-loveseat-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-exposed-wood-loveseat-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-exposed-wood-loveseat-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-exposed-wood-loveseat-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-exposed-wood-loveseat-5.webp', 4)
) AS v(url, ord);

/* Terren Farmhouse Linen Loveseat  [CC-2S-017]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-017' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-017' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-5.webp', 4)
) AS v(url, ord);

/* Velvet Button Tufted Loveseat with Nailhead Trim  [CC-2S-009]  (5 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-009' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-009' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-velvet-tufted-loveseat-nailhead-trim-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-velvet-tufted-loveseat-nailhead-trim-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-velvet-tufted-loveseat-nailhead-trim-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-velvet-tufted-loveseat-nailhead-trim-4.webp', 3),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-velvet-tufted-loveseat-nailhead-trim-5.webp', 4)
) AS v(url, ord);

/* Wide Boucle Loveseat Sofa  [CC-2S-004]  (4 images) */
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku='CC-2S-004' AND deleted_at IS NULL);
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, p.name, v.ord, v.ord = 0
FROM (SELECT id, name FROM products WHERE sku='CC-2S-004' AND deleted_at IS NULL) p
CROSS JOIN (VALUES
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-boucle-organic-loveseat-sofa-1.webp', 0),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-boucle-organic-loveseat-sofa-2.webp', 1),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-boucle-organic-loveseat-sofa-3.webp', 2),
  ('https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/comfyclub-wide-boucle-organic-loveseat-sofa-4.webp', 3)
) AS v(url, ord);

