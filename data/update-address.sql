-- =============================================================================
-- Update the business address + map coordinates everywhere the site reads them.
-- Run in: Supabase -> SQL Editor -> paste -> Run.
-- =============================================================================

-- 1) Business info (drives the footer address + contact details)
UPDATE settings
SET value = value || jsonb_build_object(
      'address', 'Al Jannat Street, Nasirabad Road, Behind Shell Fuel Station, Al Hamra Town, Lahore',
      'coordinates', '31.45294157968887,74.2547213022145'
    ),
    updated_at = now()
WHERE key = 'business_info';

-- 2) LocalBusiness schema (JSON-LD address shown to Google), IF you use the SEO
--    schema pack. Only updates it when it's already set — safe no-op otherwise.
UPDATE settings
SET value = (
      SELECT jsonb_agg(
        CASE
          WHEN (item->>'json') LIKE '%Jan Muhammad Road%'
          THEN jsonb_set(item, '{json}',
                 to_jsonb(replace(
                   replace(item->>'json',
                     'Jan Muhammad Road, Nawab Town',
                     'Al Jannat Street, Nasirabad Road, Behind Shell Fuel Station, Al Hamra Town'),
                   '31.4503', '31.45294157968887')))
          ELSE item
        END
      )
      FROM jsonb_array_elements(value) AS item
    ),
    updated_at = now()
WHERE key = 'custom_schemas'
  AND jsonb_typeof(value) = 'array'
  AND value::text LIKE '%Jan Muhammad Road%';

-- Verify
SELECT value ->> 'address' AS address, value ->> 'coordinates' AS coordinates
FROM settings WHERE key = 'business_info';
