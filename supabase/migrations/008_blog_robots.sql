-- ============================================================================
-- COMFYCLUB — Migration 008: Blog post robots directive
-- Lets staff mark a post noindex (e.g. filler/sample posts) from the editor.
-- ============================================================================

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS robots TEXT DEFAULT 'index, follow';
