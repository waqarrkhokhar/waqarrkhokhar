UPDATE categories
SET name = 'Single Bed', slug = '/furniture/single-bed/', sort_order = 0
WHERE slug = '/furniture/wooden-beds/' OR name ILIKE 'Wooden Bed%';

UPDATE categories
SET name = 'Double Bed', slug = '/furniture/double-bed/', sort_order = 1
WHERE slug = '/furniture/poshish-bed-sets/' OR name ILIKE 'Poshish%';

INSERT INTO categories (name, slug, parent_id, sort_order, status)
SELECT 'Dining Table Sets', '/furniture/dining-table-sets/', p.id, 2, 'draft'
FROM parent_categories p
WHERE p.slug = '/furniture/'
  AND NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = '/furniture/dining-table-sets/');

SELECT c.name, c.slug, c.status, c.sort_order
FROM categories c
JOIN parent_categories p ON p.id = c.parent_id
WHERE p.slug = '/furniture/' AND c.deleted_at IS NULL
ORDER BY c.sort_order;
