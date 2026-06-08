-- ============================================================
-- GSF Platform — Migration 010: Gallery & Media
-- ============================================================

CREATE TABLE IF NOT EXISTS gallery_images (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  url              TEXT NOT NULL,
  thumbnail_url    TEXT,
  caption_fr       TEXT,
  caption_en       TEXT,
  album            TEXT,
  event_id         UUID REFERENCES events(id) ON DELETE SET NULL,
  uploaded_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  show_on_website  BOOLEAN NOT NULL DEFAULT true,
  display_order    INT,
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  width            INT,
  height           INT,
  file_size_kb     INT
);

CREATE INDEX idx_gallery_album   ON gallery_images(album);
CREATE INDEX idx_gallery_event   ON gallery_images(event_id);
CREATE INDEX idx_gallery_website ON gallery_images(show_on_website);
CREATE INDEX idx_gallery_featured ON gallery_images(is_featured);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON gallery_images FOR SELECT
  USING (show_on_website = true);
CREATE POLICY "gallery_admin_all" ON gallery_images FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

CREATE TABLE IF NOT EXISTS media_videos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title_fr         TEXT NOT NULL,
  title_en         TEXT,
  description_fr   TEXT,
  youtube_url      TEXT NOT NULL,
  youtube_id       TEXT,
  thumbnail_url    TEXT,
  category         TEXT DEFAULT 'general',
  show_on_website  BOOLEAN NOT NULL DEFAULT true,
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  display_order    INT,
  published_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE media_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos_public_read" ON media_videos FOR SELECT USING (show_on_website = true);
CREATE POLICY "videos_admin_all" ON media_videos FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

SELECT 'Migration 010 - Gallery & Media OK ✅' AS status;
