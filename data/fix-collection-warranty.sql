UPDATE categories
SET content_html = REPLACE(content_html, '2-year solid wood frame warranty', '2.5-year solid wood frame warranty')
WHERE content_html LIKE '%2-year solid wood frame warranty%';

UPDATE categories
SET content_html = REPLACE(content_html, 'Molty Foam', 'high-density foam')
WHERE content_html LIKE '%Molty Foam%';

UPDATE categories
SET content_html = REPLACE(content_html, '3 1 1', '3+1+1')
WHERE content_html LIKE '%3 1 1%';

SELECT name, slug,
       (content_html LIKE '%2.5-year%') AS frame_2_5yr,
       (content_html LIKE '%high-density foam%') AS high_density,
       (content_html LIKE '%Molty Foam%') AS still_molty,
       (content_html LIKE '%3 1 1%') AS still_old_311
FROM categories
WHERE content_html IS NOT NULL
ORDER BY slug;
