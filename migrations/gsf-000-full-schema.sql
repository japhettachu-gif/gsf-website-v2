-- ============================================================
-- GSF Academy Platform — Schema Complet
-- À exécuter UNE SEULE FOIS dans Supabase SQL Editor
-- Ordre : Extensions → Auth → Profiles → Staff → Programs → Sessions
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TYPES GLOBAUX ──────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'coach', 'parent', 'player');

-- ─── TABLE PROFILES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email         TEXT,
  full_name     TEXT,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'parent',
  phone         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_read" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── TYPES STAFF ────────────────────────────────────────────
CREATE TYPE staff_role AS ENUM (
  'head_coach','assistant_coach','goalkeeper_coach','fitness_coach',
  'physiotherapist','team_manager','scout','administrator','medical_staff','other'
);
CREATE TYPE staff_status AS ENUM ('active','inactive','on_leave');

-- ─── TABLE STAFF ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  display_name      TEXT,
  photo_url         TEXT,
  role              staff_role NOT NULL DEFAULT 'other',
  status            staff_status NOT NULL DEFAULT 'active',
  bio               TEXT,
  bio_fr            TEXT,
  email             TEXT,
  phone             TEXT,
  whatsapp          TEXT,
  nationality       TEXT,
  date_of_birth     DATE,
  years_experience  INT,
  certifications    TEXT[],
  specialties       TEXT[],
  linkedin_url      TEXT,
  instagram_url     TEXT,
  show_on_website   BOOLEAN NOT NULL DEFAULT true,
  display_order     INT
);

CREATE INDEX IF NOT EXISTS idx_staff_role    ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_status  ON staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_website ON staff(show_on_website, status);

CREATE TRIGGER staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_public_read" ON staff FOR SELECT
  USING (show_on_website = true AND status = 'active');
CREATE POLICY "staff_admin_all" ON staff FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- ─── TYPES PROGRAMS ─────────────────────────────────────────
CREATE TYPE age_group AS ENUM ('U8','U10','U12','U14','U16','U18','U21','senior','feminin','elite','all');
CREATE TYPE program_level AS ENUM ('initiation','development','performance','elite');
CREATE TYPE program_status AS ENUM ('active','inactive','upcoming','archived');
CREATE TYPE session_type AS ENUM ('training','match','evaluation','physical','tactical','recovery','event');
CREATE TYPE session_status AS ENUM ('scheduled','completed','cancelled','postponed');

-- ─── TABLE PROGRAMS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name                     TEXT NOT NULL,
  name_fr                  TEXT NOT NULL,
  slug                     TEXT NOT NULL UNIQUE,
  description              TEXT,
  description_fr           TEXT,
  age_group                age_group NOT NULL DEFAULT 'all',
  level                    program_level NOT NULL DEFAULT 'development',
  status                   program_status NOT NULL DEFAULT 'active',
  max_players              INT,
  current_players          INT NOT NULL DEFAULT 0,
  duration_weeks           INT,
  sessions_per_week        INT,
  session_duration_minutes INT,
  price_xaf                INT,
  icon                     TEXT,
  color                    TEXT DEFAULT '#16a34a',
  cover_url                TEXT,
  show_on_website          BOOLEAN NOT NULL DEFAULT true,
  display_order            INT,
  objectives               TEXT[],
  objectives_fr            TEXT[]
);

CREATE TRIGGER programs_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "programs_public_read" ON programs FOR SELECT
  USING (show_on_website = true AND status IN ('active','upcoming'));
CREATE POLICY "programs_admin_all" ON programs FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- ─── TABLE TRAINING SESSIONS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS training_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  program_id            UUID REFERENCES programs(id) ON DELETE SET NULL,
  day_of_week           SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time            TIME NOT NULL,
  end_time              TIME NOT NULL,
  effective_from        DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_until       DATE,
  title                 TEXT,
  title_fr              TEXT,
  type                  session_type NOT NULL DEFAULT 'training',
  status                session_status NOT NULL DEFAULT 'scheduled',
  location              TEXT,
  notes                 TEXT,
  notes_fr              TEXT,
  coach_id              UUID REFERENCES staff(id) ON DELETE SET NULL,
  is_recurring          BOOLEAN NOT NULL DEFAULT true,
  recurrence_exceptions DATE[]
);

CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON training_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_public_read" ON training_sessions FOR SELECT
  USING (status = 'scheduled' AND is_recurring = true);
CREATE POLICY "sessions_admin_all" ON training_sessions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- ─── SEED DATA ───────────────────────────────────────────────

INSERT INTO staff (first_name, last_name, role, status, bio, bio_fr, nationality, years_experience, show_on_website, display_order)
VALUES
  ('Hervé', 'NJAHA Bardo', 'head_coach', 'active',
   'Co-founder and Head Coach of Genius Soccer Foundation.',
   'Co-fondateur et Entraîneur Principal de la Genius Soccer Foundation.',
   'Camerounaise', 10, true, 1),
  ('Japhel', 'Tachu Memba', 'administrator', 'active',
   'Co-founder and Project Director.',
   'Co-fondateur et Directeur de Projet.',
   'Camerounaise', 10, true, 2)
ON CONFLICT DO NOTHING;

INSERT INTO programs (name, name_fr, slug, age_group, level, status, sessions_per_week, session_duration_minutes, max_players, color, icon, show_on_website, display_order, description, description_fr, objectives, objectives_fr)
VALUES
  ('U12 Development','Développement U12','u12-development','U12','development','active',3,90,20,'#16a34a','⚽',true,1,
   'Technical and tactical development for players under 12.',
   'Développement technique et tactique pour les moins de 12 ans.',
   ARRAY['Ball mastery','Passing & receiving','Positional awareness'],
   ARRAY['Maîtrise du ballon','Passe et contrôle','Sens du placement']),
  ('U16 Performance','Performance U16','u16-performance','U16','performance','active',4,100,18,'#0284c7','🏆',true,2,
   'High-performance program for competitive players under 16.',
   'Programme haute performance pour joueurs compétitifs de moins de 16 ans.',
   ARRAY['Advanced tactics','Physical conditioning','Competition preparation'],
   ARRAY['Tactique avancée','Préparation physique','Préparation aux compétitions']),
  ('Elite Academy','Académie Élite','elite-academy','elite','elite','active',5,120,15,'#ca8a04','⭐',true,3,
   'Elite program targeting professional careers.',
   'Programme élite visant une carrière professionnelle.',
   ARRAY['Professional standards','Individual development plans'],
   ARRAY['Standards professionnels','Plans de développement individuels']),
  ('Féminin GSF','Section Féminine GSF','feminin-gsf','feminin','development','active',3,90,20,'#ec4899','💪',true,4,
   'Dedicated program for female players of all ages.',
   'Programme dédié aux joueuses de tous âges.',
   ARRAY['Technical skills','Teamwork','Confidence building'],
   ARRAY['Compétences techniques','Esprit d''équipe','Confiance en soi'])
ON CONFLICT (slug) DO NOTHING;

-- ─── FIN ─────────────────────────────────────────────────────
SELECT 'GSF Schema installé avec succès ✅' AS status;
