-- =============================================================================
-- Set prices for the 2, 4 and 5 SEATER sofa categories — run all together.
--
--   2 Seater: discounted 24,499 .. 27,000 PER SEAT  x 2 seats  = sale price
--   4 Seater: discounted 25,000 .. 28,000 PER SEAT  x 4 seats  = sale price
--   5 Seater: discounted 25,500 .. 28,500 PER SEAT  x 5 seats  = sale price
--
--   base price PER SEAT = discounted + a per-seat discount (100 .. 2,000)
--   every product gets a different base/sale pair (20 patterns, then repeats)
--
-- Shows in Dashboard (Price + Sale Price) and on the storefront (strike + % off).
-- Safe to re-run. Run in: Supabase -> SQL Editor -> paste -> Run.
-- =============================================================================

-- ---------------- 2 SEATER (x2, discounted 24,499..27,000/seat) ---------------
WITH cat AS (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/' LIMIT 1),
ranked AS (SELECT p.id, ROW_NUMBER() OVER (ORDER BY p.created_at,p.id) rn FROM products p JOIN cat ON p.category_id=cat.id WHERE p.deleted_at IS NULL),
combos(idx,base_total,sale_total) AS (VALUES
 (1,54000,50000),(2,50800,49000),(3,52400,51000),(4,53000,52000),(5,54600,53000),
 (6,54600,54000),(7,51198,49998),(8,52798,51998),(9,54398,53998),(10,50998,49598),
 (11,52466,50666),(12,53866,52666),(13,54932,53332),(14,51932,51332),(15,49998,49198),
 (16,53600,52200),(17,52000,51600),(18,49998,48998),(19,55400,53600),(20,51600,50400)),
assign AS (SELECT r.id,c.base_total,c.sale_total FROM ranked r JOIN combos c ON c.idx=((r.rn-1)%20)+1)
UPDATE products p SET price=a.base_total, sale_price=a.sale_total, sale_start=NULL, sale_end=NULL, updated_at=now()
FROM assign a WHERE p.id=a.id;

-- ---------------- 4 SEATER (x4, discounted 25,000..28,000/seat) ---------------
WITH cat AS (SELECT id FROM categories WHERE slug='/seater-sofas/4-seater-sofas/' LIMIT 1),
ranked AS (SELECT p.id, ROW_NUMBER() OVER (ORDER BY p.created_at,p.id) rn FROM products p JOIN cat ON p.category_id=cat.id WHERE p.deleted_at IS NULL),
combos(idx,base_total,sale_total) AS (VALUES
 (1,108000,100000),(2,105600,102000),(3,106800,104000),(4,108000,106000),(5,111200,108000),
 (6,111200,110000),(7,114400,112000),(8,105596,103996),(9,108796,107996),(10,114796,111996),
 (11,104932,101332),(12,107732,105332),(13,112532,109332),(14,104200,103000),(15,108600,107000),
 (16,113800,111000),(17,101800,101000),(18,107000,105000),(19,112600,109000),(20,102800,100400)),
assign AS (SELECT r.id,c.base_total,c.sale_total FROM ranked r JOIN combos c ON c.idx=((r.rn-1)%20)+1)
UPDATE products p SET price=a.base_total, sale_price=a.sale_total, sale_start=NULL, sale_end=NULL, updated_at=now()
FROM assign a WHERE p.id=a.id;

-- ---------------- 5 SEATER (x5, discounted 25,500..28,500/seat) ---------------
WITH cat AS (SELECT id FROM categories WHERE slug='/seater-sofas/5-seater-sofas/' LIMIT 1),
ranked AS (SELECT p.id, ROW_NUMBER() OVER (ORDER BY p.created_at,p.id) rn FROM products p JOIN cat ON p.category_id=cat.id WHERE p.deleted_at IS NULL),
combos(idx,base_total,sale_total) AS (VALUES
 (1,137500,127500),(2,134500,130000),(3,136000,132500),(4,137500,135000),(5,141500,137500),
 (6,141500,140000),(7,145500,142500),(8,131995,129995),(9,135995,134995),(10,143495,139995),
 (11,133250,128750),(12,136750,133750),(13,142750,138750),(14,142750,141250),(15,130000,128000),
 (16,135500,133000),(17,141500,138000),(18,143000,142000),(19,132500,129500),(20,140000,135500)),
assign AS (SELECT r.id,c.base_total,c.sale_total FROM ranked r JOIN combos c ON c.idx=((r.rn-1)%20)+1)
UPDATE products p SET price=a.base_total, sale_price=a.sale_total, sale_start=NULL, sale_end=NULL, updated_at=now()
FROM assign a WHERE p.id=a.id;

-- ---- Verify (optional): list 2, 4 & 5 seater products with their new prices --
SELECT c.name AS category, p.name,
       p.price AS base_price, p.sale_price AS discounted_price,
       (p.price - p.sale_price) AS you_save
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug IN ('/seater-sofas/2-seater-sofas/','/seater-sofas/4-seater-sofas/','/seater-sofas/5-seater-sofas/')
  AND p.deleted_at IS NULL
ORDER BY c.name, p.created_at, p.id;
