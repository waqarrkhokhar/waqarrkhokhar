-- =============================================================================
-- Wire the alt text you set in the MEDIA LIBRARY onto the product gallery.
--
-- Your alt text is stored on the media rows (media.alt_text), but the product
-- gallery reads product_images.alt_text (a separate column that was empty).
-- This copies your alt text across, matching by the image URL.
--
-- (Even without this, every image now has non-empty alt via a code fallback to
--  the product name — but this makes your OWN alt text the one that shows.)
--
-- Safe to re-run. Run in: Supabase -> SQL Editor -> paste -> Run.
-- =============================================================================

UPDATE product_images pi
SET alt_text = m.alt_text
FROM media m
WHERE (pi.url = m.url OR pi.url = m.webp_url)
  AND m.alt_text IS NOT NULL
  AND btrim(m.alt_text) <> ''
  AND (pi.alt_text IS NULL OR btrim(pi.alt_text) = '');

-- Verify: how many product images have alt text now vs still missing
SELECT
  count(*) FILTER (WHERE alt_text IS NOT NULL AND btrim(alt_text) <> '') AS with_alt,
  count(*) FILTER (WHERE alt_text IS NULL OR btrim(alt_text) = '')       AS missing_alt
FROM product_images;
