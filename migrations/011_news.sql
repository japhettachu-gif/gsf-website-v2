-- ============================================================
-- GSF Platform — Migration 011: News & CMS
-- ============================================================

CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE IF NOT EXISTS news_articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug          TEXT NOT NULL UNIQUE,
  title_fr      TEXT NOT NULL,
  title_en      TEXT,
  excerpt_fr    TEXT,
  excerpt_en    TEXT,
  body_fr       TEXT,
  body_en       TEXT,
  cover_url     TEXT,
  author_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name   TEXT,
  published_at  TIMESTAMPTZ,
  status        article_status NOT NULL DEFAULT 'draft',
  tags          TEXT[],
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  views_count   INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_news_status     ON news_articles(status);
CREATE INDEX idx_news_published  ON news_articles(published_at DESC);
CREATE INDEX idx_news_featured   ON news_articles(is_featured);
CREATE INDEX idx_news_slug       ON news_articles(slug);

CREATE TRIGGER news_updated_at BEFORE UPDATE ON news_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_public_read" ON news_articles FOR SELECT
  USING (status = 'published');
CREATE POLICY "news_admin_all" ON news_articles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- Seed
INSERT INTO news_articles (slug, title_fr, title_en, excerpt_fr, status, published_at, is_featured)
VALUES
  ('bienvenue-gsf-academy', 'Bienvenue sur la plateforme GSF Academy', 'Welcome to GSF Academy Platform',
   'La Genius Soccer Foundation lance sa nouvelle plateforme digitale.',
   'published', NOW(), true)
ON CONFLICT (slug) DO NOTHING;

SELECT 'Migration 011 - News & CMS OK ✅' AS status;
