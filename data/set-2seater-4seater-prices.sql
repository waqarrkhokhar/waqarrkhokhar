-- =============================================================================
-- Set prices for the 4 SEATER and 2 SEATER sofa categories.
--
--   4 Seater: discounted 25,000 .. 28,000 PER SEAT  x 4 seats  = sale price
--   2 Seater: discounted 24,499 .. 27,000 PER SEAT  x 2 seats  = sale price
--             (same per-seat range/style as the 3-seater update)
--
--   base price PER SEAT = discounted + a per-seat discount (100 .. 2,000)
--   every product gets a different base/sale pair (20 patterns, then repeats)
--
-- Shows in Dashboard (Price + Sale Price) and on the storefront (strike + % off).
-- Safe to re-run. Run in: Supabase -> SQL Editor -> paste -> Run.
-- =============================================================================

-- ---------- 4 SEATER SOFAS (x4 seats, discounted 25,000..28,000/seat) --------
WITH cat AS (
  SELECT id FROM categories WHERE slug = '/seater-sofas/4-seater-sofas/' LIMIT 1
),
ranked AS (
  SELECT p.id, ROW_NUMBER() OVER (ORDER BY p.created_at, p.id) AS rn
  FROM products p
  JOIN cat ON p.category_id = cat.id
  WHERE p.deleted_at IS NULL
),
-- (pattern #, BASE total, SALE total) ; sale/4 is always 25,000..28,000
combos (idx, base_total, sale_total) AS (
  VALUES
    (1,  108000, 100000),  -- 27000 / 25000 per seat
    (2,  105600, 102000),  -- 26400 / 25500
    (3,  106800, 104000),  -- 26700 / 26000
    (4,  108000, 106000),  -- 27000 / 26500
    (5,  111200, 108000),  -- 27800 / 27000
    (6,  111200, 110000),  -- 27800 / 27500
    (7,  114400, 112000),  -- 28600 / 28000 (highest sale)
    (8,  105596, 103996),  -- 26399 / 25999
    (9,  108796, 107996),  -- 27199 / 26999
    (10, 114796, 111996),  -- 28699 / 27999
    (11, 104932, 101332),  -- 26233 / 25333
    (12, 107732, 105332),  -- 26933 / 26333
    (13, 112532, 109332),  -- 28133 / 27333
    (14, 104200, 103000),  -- 26050 / 25750
    (15, 108600, 107000),  -- 27150 / 26750
    (16, 113800, 111000),  -- 28450 / 27750
    (17, 101800, 101000),  -- 25450 / 25250
    (18, 107000, 105000),  -- 26750 / 26250
    (19, 112600, 109000),  -- 28150 / 27250
    (20, 102800, 100400)   -- 25700 / 25100
),
assign AS (
  SELECT r.id, c.base_total, c.sale_total
  FROM ranked r JOIN combos c ON c.idx = ((r.rn - 1) % 20) + 1
)
UPDATE products p
SET price = a.base_total, sale_price = a.sale_total,
    sale_start = NULL, sale_end = NULL, updated_at = now()
FROM assign a
WHERE p.id = a.id;

-- ---------- 2 SEATER SOFAS (x2 seats, discounted 24,499..27,000/seat) ---------
WITH cat AS (
  SELECT id FROM categories WHERE slug = '/seater-sofas/2-seater-sofas/' LIMIT 1
),
ranked AS (
  SELECT p.id, ROW_NUMBER() OVER (ORDER BY p.created_at, p.id) AS rn
  FROM products p
  JOIN cat ON p.category_id = cat.id
  WHERE p.deleted_at IS NULL
),
-- (pattern #, BASE total, SALE total) ; sale/2 is always 24,499..27,000
combos (idx, base_total, sale_total) AS (
  VALUES
    (1,  54000, 50000),  -- 27000 / 25000 per seat
    (2,  50800, 49000),  -- 25400 / 24500
    (3,  52400, 51000),  -- 26200 / 25500
    (4,  53000, 52000),  -- 26500 / 26000
    (5,  54600, 53000),  -- 27300 / 26500
    (6,  54600, 54000),  -- 27300 / 27000
    (7,  51198, 49998),  -- 25599 / 24999
    (8,  52798, 51998),  -- 26399 / 25999
    (9,  54398, 53998),  -- 27199 / 26999
    (10, 50998, 49598),  -- 25499 / 24799
    (11, 52466, 50666),  -- 26233 / 25333
    (12, 53866, 52666),  -- 26933 / 26333
    (13, 54932, 53332),  -- 27466 / 26666
    (14, 51932, 51332),  -- 25966 / 25666
    (15, 49998, 49198),  -- 24999 / 24599
    (16, 53600, 52200),  -- 26800 / 26100
    (17, 52000, 51600),  -- 26000 / 25800
    (18, 49998, 48998),  -- 24999 / 24499 (lowest sale)
    (19, 55400, 53600),  -- 27700 / 26800
    (20, 51600, 50400)   -- 25800 / 25200
),
assign AS (
  SELECT r.id, c.base_total, c.sale_total
  FROM ranked r JOIN combos c ON c.idx = ((r.rn - 1) % 20) + 1
)
UPDATE products p
SET price = a.base_total, sale_price = a.sale_total,
    sale_start = NULL, sale_end = NULL, updated_at = now()
FROM assign a
WHERE p.id = a.id;

-- ---- Verify (optional): list 2 & 4 seater products with their new prices ----
SELECT c.name AS category, p.name,
       p.price AS base_price, p.sale_price AS discounted_price,
       (p.price - p.sale_price) AS you_save
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug IN ('/seater-sofas/2-seater-sofas/', '/seater-sofas/4-seater-sofas/')
  AND p.deleted_at IS NULL
ORDER BY c.name, p.created_at, p.id;
