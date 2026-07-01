-- Homepage meta (home_seo setting; read by the storefront homepage)
INSERT INTO settings (key, value)
VALUES ('home_seo', jsonb_build_object(
  'meta_title', 'Custom Sofas & Furniture in Lahore — Buy Online | ComfyClub',
  'meta_description', 'Shop handcrafted custom sofas, sofa sets, sofa chairs & furniture in Pakistan. Pick your fabric, colour & size — solid wood, premium foam, nationwide delivery.'
))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ── Parent categories ───────────────────────────────────────────────────────
UPDATE parent_categories SET
  meta_title = 'Sofas in Pakistan — Chairs, Cum Beds & L-Shape',
  meta_description = 'Explore custom-built sofas — sofa chairs, sofa cum beds, L-shape, diwan, settee & ottoman. Solid wood frames, your fabric & colour, delivered across Pakistan.'
WHERE slug = '/sofas/' OR name ILIKE 'Sofas';

UPDATE parent_categories SET
  meta_title = 'Sofa Sets in Pakistan — 2 to 6 Seater Sofas',
  meta_description = 'Shop 2, 3, 4, 5 & 6 seater sofa sets in Pakistan. Choose the size, fabric & finish — solid wood frames, premium high-density foam, nationwide delivery.'
WHERE slug = '/seater-sofas/' OR name ILIKE 'Seater Sofas';

UPDATE parent_categories SET
  meta_title = 'Furniture in Lahore — Beds, Dining & Sofa Sets',
  meta_description = 'Custom furniture in Pakistan — beds, dining table sets & more, handcrafted in Lahore. Your design, fabric & finish. Solid wood, delivered across Pakistan.'
WHERE slug = '/furniture/' OR name ILIKE 'Furniture';

-- ── Sofas collections ───────────────────────────────────────────────────────
UPDATE categories SET
  meta_title = 'Sofa Chairs in Pakistan — Single Sofa Designs',
  meta_description = 'Buy custom sofa chairs & single seater sofas for drawing rooms, bedrooms & lounges. Velvet, boucle & linen, solid wood frames. Delivered across Pakistan.'
WHERE slug = '/sofas/sofa-chair/';

UPDATE categories SET
  meta_title = 'Sofa Cum Bed Price in Pakistan — Fold-Out Beds',
  meta_description = 'Buy custom sofa cum beds — a sofa by day, a bed by night. Solid wood frame, high-density foam, your fabric & colour. Order on WhatsApp, delivered nationwide.'
WHERE slug = '/sofas/sofa-come-bed/';

UPDATE categories SET
  meta_title = 'L-Shape Sofas in Pakistan — Corner Sofa Sets',
  meta_description = 'Shop custom L-shape & corner sofa sets for open living rooms. Solid wood frames, premium foam, your fabric & colour. Handcrafted in Lahore, delivered nationwide.'
WHERE slug = '/sofas/l-shape-sofas/';

UPDATE categories SET
  meta_title = 'Deewan Sofas in Pakistan — Diwan Seating',
  meta_description = 'Buy custom deewan (diwan) sofas — low, long seating for majlis & formal sitting rooms. Solid wood frame, your fabric & colour. Delivered across Pakistan.'
WHERE slug = '/sofas/deewan-sofas/';

UPDATE categories SET
  meta_title = 'Settee Sofas in Pakistan — Compact 2-Seaters',
  meta_description = 'Shop compact settee sofas for small rooms & extra seating. Solid wood frames, premium foam, your fabric & colour. Handcrafted in Lahore, nationwide delivery.'
WHERE slug = '/sofas/settee-sofas/';

UPDATE categories SET
  meta_title = 'Ottoman Sofas & Storage Benches in Pakistan',
  meta_description = 'Buy custom ottomans & storage benches — extra seating, a footrest or hidden storage. Solid wood frame, your fabric & colour. Delivered across Pakistan.'
WHERE slug = '/sofas/ottoman-sofas/';

-- ── Seater sofas collections ────────────────────────────────────────────────
UPDATE categories SET
  meta_title = '2 Seater Sofas in Pakistan — Compact Sofa',
  meta_description = 'Buy custom 2 seater sofas for bedrooms & small living rooms. Choose fabric & colour, solid wood frame, premium foam. Handcrafted in Lahore, delivered nationwide.'
WHERE slug = '/seater-sofas/2-seater-sofas/';

UPDATE categories SET
  meta_title = '3 Seater Sofa Price in Pakistan — Custom',
  meta_description = 'Buy custom 3 seater sofas — the anchor of any living room. Solid wood frame, premium foam, your fabric & size. Handcrafted in Lahore, delivered across Pakistan.'
WHERE slug = '/seater-sofas/3-seater-sofas/';

UPDATE categories SET
  meta_title = '4 Seater Sofas in Pakistan — Wide Sofa Sets',
  meta_description = 'Shop wide custom 4 seater sofas — one continuous piece between a 3 seater & a full set. Your fabric, solid wood frame, premium foam. Delivered nationwide.'
WHERE slug = '/seater-sofas/4-seater-sofas/';

UPDATE categories SET
  meta_title = '5 Seater Sofa Set Price in Pakistan — Custom',
  meta_description = 'Buy custom 5 seater sofa sets — single-piece, L-shape & 3+1+1 layouts built for hosting. Your fabric & size, solid wood frames. Delivered across Pakistan.'
WHERE slug = '/seater-sofas/5-seater-sofas/';

UPDATE categories SET
  meta_title = '6 Seater Sofa Sets in Pakistan — Large Sofas',
  meta_description = 'Shop large custom 6 seater sofa sets for spacious drawing rooms. Solid wood frames, premium high-density foam, your fabric. Handcrafted in Lahore, delivered.'
WHERE slug = '/seater-sofas/6-seater-sofas/';

-- ── Furniture collections ───────────────────────────────────────────────────
UPDATE categories SET
  meta_title = 'Single Beds in Pakistan — Custom Wood Beds',
  meta_description = 'Buy custom single beds — solid wood frames with upholstered options in your fabric & finish. Handcrafted in Lahore, delivered across Pakistan.'
WHERE slug = '/furniture/single-bed/';

UPDATE categories SET
  meta_title = 'Double & King Beds in Pakistan — Custom',
  meta_description = 'Buy custom double & king size beds — solid wood frames, premium upholstery, your fabric & colour. Handcrafted in Lahore, delivered across Pakistan.'
WHERE slug = '/furniture/double-bed/';

UPDATE categories SET
  meta_title = 'Dining Table Sets in Pakistan — Solid Wood',
  meta_description = 'Shop custom dining table sets — solid wood, sized for your room, in your finish. Seats 4 to 8. Handcrafted in Lahore, delivered across Pakistan.'
WHERE slug = '/furniture/dining-table-sets/';

-- ── Verify ──────────────────────────────────────────────────────────────────
SELECT 'home' AS scope, (value->>'meta_title') AS meta_title, length(value->>'meta_description') AS desc_len
FROM settings WHERE key = 'home_seo'
UNION ALL
SELECT 'parent: ' || slug, meta_title, length(meta_description) FROM parent_categories WHERE meta_title IS NOT NULL AND slug IN ('/sofas/','/seater-sofas/','/furniture/')
UNION ALL
SELECT 'collection: ' || slug, meta_title, length(meta_description) FROM categories WHERE slug LIKE '/sofas/%' OR slug LIKE '/seater-sofas/%' OR slug LIKE '/furniture/%'
ORDER BY scope;
