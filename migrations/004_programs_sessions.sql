-- ============================================================
-- GSF Platform — Migration 004: Programs & Training Sessions
-- ============================================================

-- ENUMS
CREATE TYPE age_group AS ENUM (
  'U8','U10','U12','U14','U16','U18','U21','senior','feminin','elite','all'
);
CREATE TYPE program_level AS ENUM ('initiation','development','performance','elite');
CREATE TYPE program_status AS ENUM ('active','inactive','upcoming','archived');
CREATE TYPE session_type AS ENUM ('training','match','evaluation','physical','tactical','recovery','event');
CREATE TYPE session_status AS ENUM ('scheduled','completed','cancelled','postponed');

-- PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS programs (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name                    TEXT NOT NULL,
  name_fr                 TEXT NOT NULL,
  slug                    TEXT NOT NULL UNIQUE,
  description             TEXT,
  description_fr          TEXT,

  age_group               age_group NOT NULL DEFAULT 'all',
  level                   program_level NOT NULL DEFAULT 'development',
  status                  program_status NOT NULL DEFAULT 'active',

  max_players             INT,
  current_players         INT NOT NULL DEFAULT 0,
  duration_weeks          INT,
  sessions_per_week       INT,
  session_duration_minutes INT,
  price_xaf               INT,

  icon                    TEXT,
  color                   TEXT DEFAULT '#16a34a',
  cover_url               TEXT,

  show_on_website         BOOLEAN NOT NULL DEFAULT true,
  display_order           INT,
  objectives              TEXT[],
  objectives_fr           TEXT[]
);

CREATE INDEX idx_programs_status   ON programs(status);
CREATE INDEX idx_programs_website  ON programs(show_on_website, status);
CREATE INDEX idx_programs_order    ON programs(display_order);

CREATE OR REPLACE FUNCTION update_programs_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER programs_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_programs_updated_at();

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "programs_public_read" ON programs FOR SELECT
  USING (show_on_website = true AND status IN ('active','upcoming'));
CREATE POLICY "programs_admin_all" ON programs FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- TRAINING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS training_sessions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  program_id              UUID REFERENCES programs(id) ON DELETE SET NULL,
  day_of_week             SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time              TIME NOT NULL,
  end_time                TIME NOT NULL,
  effective_from          DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_until         DATE,

  title                   TEXT,
  title_fr                TEXT,
  type                    session_type NOT NULL DEFAULT 'training',
  status                  session_status NOT NULL DEFAULT 'scheduled',
  location                TEXT,
  notes                   TEXT,
  notes_fr                TEXT,

  coach_id                UUID REFERENCES staff(id) ON DELETE SET NULL,

  is_recurring            BOOLEAN NOT NULL DEFAULT true,
  recurrence_exceptions   DATE[]
);

CREATE INDEX idx_sessions_program    ON training_sessions(program_id);
CREATE INDEX idx_sessions_day        ON training_sessions(day_of_week);
CREATE INDEX idx_sessions_status     ON training_sessions(status);
CREATE INDEX idx_sessions_coach      ON training_sessions(coach_id);
CREATE INDEX idx_sessions_recurring  ON training_sessions(is_recurring, status);

CREATE OR REPLACE FUNCTION update_sessions_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON training_sessions
  FOR EACH ROW EXECUTE FUNCTION update_sessions_updated_at();

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_public_read" ON training_sessions FOR SELECT
  USING (status = 'scheduled' AND is_recurring = true);
CREATE POLICY "sessions_admin_all" ON training_sessions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- SEED DATA
INSERT INTO programs (name, name_fr, slug, age_group, level, status, sessions_per_week, session_duration_minutes, max_players, color, icon, show_on_website, display_order,
  description, description_fr, objectives, objectives_fr)
VALUES
  ('U12 Development', 'Développement U12', 'u12-development', 'U12', 'development', 'active', 3, 90, 20, '#16a34a', '⚽', true, 1,
   'Technical and tactical development program for players under 12.',
   'Programme de développement technique et tactique pour les joueurs de moins de 12 ans.',
   ARRAY['Ball mastery','Passing & receiving','Positional awareness'],
   ARRAY['Maîtrise du ballon','Passe et contrôle','Sens du placement']),

  ('U16 Performance', 'Performance U16', 'u16-performance', 'U16', 'performance', 'active', 4, 100, 18, '#0284c7', '🏆', true, 2,
   'High-performance program for competitive players under 16.',
   'Programme haute performance pour joueurs compétitifs de moins de 16 ans.',
   ARRAY['Advanced tactics','Physical conditioning','Competition preparation'],
   ARRAY['Tactique avancée','Préparation physique','Préparation aux compétitions']),

  ('Elite Academy', 'Académie Élite', 'elite-academy', 'elite', 'elite', 'active', 5, 120, 15, '#ca8a04', '⭐', true, 3,
   'Elite program for the most talented players targeting professional careers.',
   'Programme élite pour les joueurs les plus talentueux visant une carrière professionnelle.',
   ARRAY['Professional standards','Individual development plans','Agent network access'],
   ARRAY['Standards professionnels','Plans de développement individuels','Accès réseau agents']),

  ('Féminin GSF', 'Section Féminine GSF', 'feminin-gsf', 'feminin', 'development', 'active', 3, 90, 20, '#ec4899', '💪', true, 4,
   'Dedicated program for female players of all ages.',
   'Programme dédié aux joueuses de tous âges.',
   ARRAY['Technical skills','Teamwork','Confidence building'],
   ARRAY['Compétences techniques','Esprit d''équipe','Confiance en soi']);
