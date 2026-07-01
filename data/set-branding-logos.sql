INSERT INTO settings (key, value) VALUES ('branding', '{}'::jsonb)
ON CONFLICT (key) DO NOTHING;

UPDATE settings
SET value = coalesce(value, '{}'::jsonb)
          || jsonb_build_object('favicon', 'https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/1782909315560-nc681t.png')
          || jsonb_build_object('footer_logo', 'PASTE_FOOTER_LOGO_URL_HERE')
WHERE key = 'branding';

SELECT value FROM settings WHERE key = 'branding';
