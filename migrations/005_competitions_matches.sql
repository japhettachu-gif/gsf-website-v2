-- ============================================================
-- GSF Platform — Migration 005: Competitions & Matches
-- ============================================================

CREATE TYPE competition_type AS ENUM (
  'league','cup','tournament','friendly','training_game','other'
);
CREATE TYPE competition_status AS ENUM ('upcoming','ongoing','completed','cancelled');
CREATE TYPE match_status AS ENUM ('scheduled','live','completed','cancelled','postponed');
CREATE TYPE match_result AS ENUM ('win','loss','draw');

-- COMPETITIONS
CREATE TABLE IF NOT EXISTS competitions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name             TEXT NOT NULL,
  name_fr          TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  description_fr   TEXT,
  type             competition_type NOT NULL DEFAULT 'tournament',
  status           competition_status NOT NULL DEFAULT 'upcoming',
  age_group        TEXT,
  season           TEXT,
  start_date       DATE,
  end_date         DATE,
  location         TEXT,
  organizer        TEXT,
  logo_url         TEXT,
  color            TEXT DEFAULT '#16a34a',
  show_on_website  BOOLEAN NOT NULL DEFAULT true,
  display_order    INT,
  is_featured      BOOLEAN NOT NULL DEFAULT false
);

CREATE TRIGGER competitions_updated_at BEFORE UPDATE ON competitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "competitions_public_read" ON competitions FOR SELECT
  USING (show_on_website = true);
CREATE POLICY "competitions_admin_all" ON competitions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- MATCHES
CREATE TABLE IF NOT EXISTS matches (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  competition_id   UUID REFERENCES competitions(id) ON DELETE SET NULL,
  home_team        TEXT NOT NULL,
  away_team        TEXT NOT NULL,
  is_home_game     BOOLEAN NOT NULL DEFAULT true,
  match_date       DATE NOT NULL,
  match_time       TIME,
  location         TEXT,
  status           match_status NOT NULL DEFAULT 'scheduled',
  home_score       INT,
  away_score       INT,
  result           match_result,
  round            TEXT,
  notes            TEXT,
  notes_fr         TEXT,
  match_report     TEXT,
  match_report_fr  TEXT,
  highlight_url    TEXT,
  photo_urls       TEXT[],
  gsf_scorers      TEXT[],
  gsf_assists      TEXT[],
  man_of_match     TEXT
);

CREATE INDEX idx_matches_competition ON matches(competition_id);
CREATE INDEX idx_matches_date        ON matches(match_date DESC);
CREATE INDEX idx_matches_status      ON matches(status);
CREATE INDEX idx_matches_result      ON matches(result);

CREATE TRIGGER matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_public_read" ON matches FOR SELECT USING (true);
CREATE POLICY "matches_admin_all" ON matches FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- SEED
INSERT INTO competitions (name, name_fr, slug, type, status, season, color, is_featured, show_on_website, display_order)
VALUES
  ('GSF Inter-Academy Tournament 2025', 'Tournoi Inter-Académies GSF 2025', 'gsf-tournament-2025',
   'tournament', 'completed', '2025', '#16a34a', true, true, 1),
  ('Douala Youth League 2025-2026', 'Championnat Jeunes Douala 2025-2026', 'douala-youth-league-2526',
   'league', 'ongoing', '2025-2026', '#0284c7', true, true, 2)
ON CONFLICT (slug) DO NOTHING;

SELECT 'Migration 005 - Competitions & Matches OK ✅' AS status;
