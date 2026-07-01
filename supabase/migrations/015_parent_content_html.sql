-- ── Migration 015: long-form content on parent category pages ───────────────
-- Parent category pages (e.g. /sofas/, /seater-sofas/) can now carry the same
-- collapsible "Read More" content_html block that collection pages use.
ALTER TABLE parent_categories ADD COLUMN IF NOT EXISTS content_html TEXT;
