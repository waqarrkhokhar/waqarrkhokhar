-- ComfyClub — ensure the public-write tables exist (contact form, site search).
-- Safe to run anytime: only creates them if missing. Service-role API routes
-- write here; RLS blocks anonymous direct access.
BEGIN;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

COMMIT;
