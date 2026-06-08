-- ============================================================
-- GSF Platform — Migration 012: Partners & Alumni
-- ============================================================

CREATE TYPE partner_tier AS ENUM ('title', 'official', 'supporter');

CREATE TABLE IF NOT EXISTS partners (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name             TEXT NOT NULL,
  tier             partner_tier NOT NULL DEFAULT 'supporter',
  logo_url         TEXT,
  website          TEXT,
  description_fr   TEXT,
  description_en   TEXT,
  contact_name     TEXT,
  contact_email    TEXT,
  partnership_start DATE,
  partnership_end   DATE,
  active           BOOLEAN NOT NULL DEFAULT true,
  show_on_website  BOOLEAN NOT NULL DEFAULT true,
  sort_order       INT
);

CREATE TRIGGER partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partners_public_read" ON partners FOR SELECT USING (show_on_website = true AND active = true);
CREATE POLICY "partners_admin_all" ON partners FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

CREATE TABLE IF NOT EXISTS alumni (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  player_id        UUID REFERENCES players(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  photo_url        TEXT,
  position         TEXT,
  years_at_gsf     TEXT,
  current_club     TEXT,
  current_country  TEXT,
  story_fr         TEXT,
  story_en         TEXT,
  achievements     TEXT[],
  instagram_url    TEXT,
  active           BOOLEAN NOT NULL DEFAULT true,
  show_on_website  BOOLEAN NOT NULL DEFAULT true,
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  sort_order       INT
);

CREATE TRIGGER alumni_updated_at BEFORE UPDATE ON alumni
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alumni_public_read" ON alumni FOR SELECT USING (show_on_website = true AND active = true);
CREATE POLICY "alumni_admin_all" ON alumni FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- Seed partners
INSERT INTO partners (name, tier, description_fr, active, show_on_website, sort_order)
VALUES
  ('Partenaire Titre GSF', 'title', 'Partenaire principal de la Genius Soccer Foundation.', true, true, 1),
  ('Sponsor Officiel', 'official', 'Partenaire officiel de l''académie.', true, true, 2)
ON CONFLICT DO NOTHING;

SELECT 'Migration 012 - Partners & Alumni OK ✅' AS status;
