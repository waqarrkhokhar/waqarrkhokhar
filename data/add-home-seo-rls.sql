DROP POLICY IF EXISTS "public read public settings" ON settings;
CREATE POLICY "public read public settings" ON settings
  FOR SELECT USING (
    key IN (
      'business_info', 'social_links', 'whatsapp_templates',
      'homepage_config', 'ga4_id', 'gtm_id', 'search_console_property',
      'announcement_bar', 'branding', 'footer_config', 'site_url',
      'search_console_verification', 'custom_schemas',
      'robots_extra', 'robots_block_ai', 'site_verifications', 'home_seo'
    )
  );
