SELECT p.slug AS product_slug,
       p.name AS product_name,
       pi.url AS wordpress_image_url,
       pi.sort_order
FROM product_images pi
JOIN products p   ON p.id = pi.product_id
JOIN categories c ON c.id = p.category_id
WHERE (c.slug = '/sofas/sofa-chair/' OR c.name ILIKE 'Sofa Chair%')
  AND p.deleted_at IS NULL
  AND pi.url LIKE '%wp-content%'
ORDER BY p.slug, pi.sort_order;
