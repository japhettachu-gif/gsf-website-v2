-- ============================================================
-- GSF Platform — Migration 009: Evaluations & Parent Portal
-- ============================================================

CREATE TYPE eval_pillar AS ENUM ('physical','mental','behaviour','academic','technical','tactical');
CREATE TYPE eval_position AS ENUM ('GK','DEF','MID','FWD');
CREATE TYPE eval_rating AS ENUM ('developing','satisfactory','good','excellent');
CREATE TYPE eval_type AS ENUM ('weekly','monthly','semester');
CREATE TYPE eval_status AS ENUM ('draft','finalised','published');

-- CRITERIA (configurable)
CREATE TABLE IF NOT EXISTS evaluation_criteria (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pillar           eval_pillar NOT NULL,
  position_specific eval_position[],
  name_fr          TEXT NOT NULL,
  name_en          TEXT NOT NULL,
  description_fr   TEXT,
  description_en   TEXT,
  sort_order       INT NOT NULL DEFAULT 0,
  active           BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE evaluation_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "criteria_admin_all" ON evaluation_criteria FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));
CREATE POLICY "criteria_coaches_read" ON evaluation_criteria FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid()));

-- EVALUATIONS
CREATE TABLE IF NOT EXISTS player_evaluations (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  player_id              UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  coach_id               UUID REFERENCES staff(id) ON DELETE SET NULL,
  type                   eval_type NOT NULL DEFAULT 'weekly',
  period_start           DATE NOT NULL,
  period_end             DATE NOT NULL,
  general_comment_fr     TEXT,
  general_comment_en     TEXT,
  objectives_next_period TEXT,
  status                 eval_status NOT NULL DEFAULT 'draft',
  published_at           TIMESTAMPTZ
);

CREATE INDEX idx_evals_player ON player_evaluations(player_id);
CREATE INDEX idx_evals_status ON player_evaluations(status);
CREATE INDEX idx_evals_date   ON player_evaluations(period_start DESC);

CREATE TRIGGER evals_updated_at BEFORE UPDATE ON player_evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE player_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "evals_admin_all" ON player_evaluations FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));
CREATE POLICY "evals_published_parent" ON player_evaluations FOR SELECT
  USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM parent_profiles pp
      WHERE pp.user_id = auth.uid() AND pp.player_id = player_evaluations.player_id
    )
  );

-- SCORES
CREATE TABLE IF NOT EXISTS evaluation_scores (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  evaluation_id  UUID NOT NULL REFERENCES player_evaluations(id) ON DELETE CASCADE,
  criteria_id    UUID NOT NULL REFERENCES evaluation_criteria(id) ON DELETE CASCADE,
  rating         eval_rating NOT NULL,
  comment        TEXT NOT NULL DEFAULT '',
  UNIQUE(evaluation_id, criteria_id)
);

ALTER TABLE evaluation_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scores_admin_all" ON evaluation_scores FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));
CREATE POLICY "scores_published_parent" ON evaluation_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM player_evaluations ev
      JOIN parent_profiles pp ON pp.player_id = ev.player_id
      WHERE ev.id = evaluation_scores.evaluation_id
        AND ev.status = 'published'
        AND pp.user_id = auth.uid()
    )
  );

-- PARENT PROFILES
CREATE TABLE IF NOT EXISTS parent_profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  player_id      UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  relationship   TEXT,
  verified       BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, player_id)
);

ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parent_profiles_own" ON parent_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "parent_profiles_admin" ON parent_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- SEED CRITERIA
INSERT INTO evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) VALUES
  ('physical', NULL, 'Vitesse', 'Speed', 1),
  ('physical', NULL, 'Agilité', 'Agility', 2),
  ('physical', NULL, 'Explosivité', 'Explosiveness', 3),
  ('physical', NULL, 'Endurance', 'Endurance', 4),
  ('physical', NULL, 'Force', 'Strength', 5),
  ('mental', NULL, 'Concentration', 'Concentration', 1),
  ('mental', NULL, 'Résilience', 'Resilience', 2),
  ('mental', NULL, 'Leadership', 'Leadership', 3),
  ('mental', NULL, 'Confiance en soi', 'Self-confidence', 4),
  ('behaviour', NULL, 'Discipline', 'Discipline', 1),
  ('behaviour', NULL, 'Respect', 'Respect', 2),
  ('behaviour', NULL, 'Esprit d''équipe', 'Team spirit', 3),
  ('behaviour', NULL, 'Ponctualité', 'Punctuality', 4),
  ('academic', NULL, 'Assiduité entraînement', 'Training attendance', 1),
  ('academic', NULL, 'Résultats scolaires', 'School results', 2),
  ('technical', ARRAY['GK']::eval_position[], 'Mains sûres', 'Safe hands', 1),
  ('technical', ARRAY['GK']::eval_position[], 'Arrêts réflexes', 'Reflex saves', 2),
  ('technical', ARRAY['DEF']::eval_position[], 'Duel défensif', 'Defensive duel', 1),
  ('technical', ARRAY['DEF']::eval_position[], 'Distribution courte/longue', 'Short/long distribution', 2),
  ('technical', ARRAY['MID']::eval_position[], 'Qualité de passe', 'Pass quality', 1),
  ('technical', ARRAY['MID']::eval_position[], 'Contrôle orienté', 'Oriented control', 2),
  ('technical', ARRAY['FWD']::eval_position[], 'Finition', 'Finishing', 1),
  ('technical', ARRAY['FWD']::eval_position[], 'Dribble', 'Dribbling', 2),
  ('tactical', ARRAY['GK']::eval_position[], 'Placement dans le but', 'Goal positioning', 1),
  ('tactical', ARRAY['DEF']::eval_position[], 'Marquage', 'Marking', 1),
  ('tactical', ARRAY['MID']::eval_position[], 'Vision et prise de décision', 'Vision and decision-making', 1),
  ('tactical', ARRAY['FWD']::eval_position[], 'Déplacements et appels', 'Movement and runs', 1)
ON CONFLICT DO NOTHING;

SELECT 'Migration 009 - Evaluations OK ✅' AS status;
