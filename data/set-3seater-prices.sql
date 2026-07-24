-- =============================================================================
-- Set prices for every product in the "3 Seater Sofas" category.
--
-- Logic (per your spec, 3 seats per sofa):
--   * discounted price PER SEAT is between 24,499 and 27,000
--       -> total discounted price = per-seat x 3  (this is the SALE price)
--   * base price PER SEAT = discounted + a per-seat discount (100 .. 2,000)
--       -> total base price = per-seat x 3         (this is the ORIGINAL price)
--   * every product gets a DIFFERENT base/sale pair (20 patterns, then repeats)
--
-- Where it shows:
--   * Dashboard  -> Product editor: "Price" (base) and "Sale Price" (discounted)
--   * Storefront -> struck-through original + gold sale price + % off badge
--
-- Safe to re-run. Only touches products in /seater-sofas/3-seater-sofas/.
-- Run in: Supabase -> SQL Editor -> paste -> Run.
-- =============================================================================

WITH cat AS (
  SELECT id FROM categories WHERE slug = '/seater-sofas/3-seater-sofas/' LIMIT 1
),
ranked AS (
  SELECT p.id, ROW_NUMBER() OVER (ORDER BY p.created_at, p.id) AS rn
  FROM products p
  JOIN cat ON p.category_id = cat.id
  WHERE p.deleted_at IS NULL
),
-- (pattern #, BASE total, SALE total)  — sale/3 is always 24,499..27,000
combos (idx, base_total, sale_total) AS (
  VALUES
    (1,  81000, 75000),   -- 27000 base / 25000 sale per seat
    (2,  76200, 73500),   -- 25400 / 24500
    (3,  78600, 76500),   -- 26200 / 25500
    (4,  79500, 78000),   -- 26500 / 26000
    (5,  81900, 79500),   -- 27300 / 26500
    (6,  81900, 81000),   -- 27300 / 27000
    (7,  76797, 74997),   -- 25599 / 24999
    (8,  79197, 77997),   -- 26399 / 25999
    (9,  81597, 80997),   -- 27199 / 26999
    (10, 76497, 74397),   -- 25499 / 24799
    (11, 78699, 75999),   -- 26233 / 25333
    (12, 80799, 78999),   -- 26933 / 26333
    (13, 82398, 79998),   -- 27466 / 26666
    (14, 77898, 76998),   -- 25966 / 25666
    (15, 74997, 73797),   -- 24999 / 24599
    (16, 80400, 78300),   -- 26800 / 26100
    (17, 78000, 77400),   -- 26000 / 25800
    (18, 74997, 73497),   -- 24999 / 24499  (lowest sale)
    (19, 83100, 80400),   -- 27700 / 26800
    (20, 77400, 75600)    -- 25800 / 25200
),
assign AS (
  SELECT r.id, c.base_total, c.sale_total
  FROM ranked r
  JOIN combos c ON c.idx = ((r.rn - 1) % 20) + 1
)
UPDATE products p
SET price      = a.base_total,
    sale_price = a.sale_total,
    sale_start = NULL,   -- always-on discount (no start/end window)
    sale_end   = NULL,
    updated_at = now()
FROM assign a
WHERE p.id = a.id;

-- ---- Verify (optional): see what each 3-seater product is now priced at ----
SELECT p.name,
       p.price       AS base_price,
       p.sale_price  AS discounted_price,
       (p.price - p.sale_price) AS you_save
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = '/seater-sofas/3-seater-sofas/'
  AND p.deleted_at IS NULL
ORDER BY p.created_at, p.id;
