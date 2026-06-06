-- ============================================================
-- GSF Platform — Migration 006: Boot Camp & Événements
-- ============================================================

CREATE TYPE event_type AS ENUM (
  'bootcamp','stage','tournament','open_day','gala','workshop','ceremony','other'
);
CREATE TYPE event_status AS ENUM (
  'draft','published','registration_open','registration_closed','ongoing','completed','cancelled'
);
CREATE TYPE event_audience AS ENUM ('players','parents','coaches','public','all');

CREATE TABLE IF NOT EXISTS events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  title                 TEXT NOT NULL,
  title_fr              TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  excerpt               TEXT,
  excerpt_fr            TEXT,
  description           TEXT,
  description_fr        TEXT,

  type                  event_type NOT NULL DEFAULT 'other',
  status                event_status NOT NULL DEFAULT 'draft',
  audience              event_audience NOT NULL DEFAULT 'all',

  start_date            DATE NOT NULL,
  end_date              DATE,
  start_time            TIME,
  end_time              TIME,
  timezone              TEXT NOT NULL DEFAULT 'Africa/Douala',

  location              TEXT,
  location_details      TEXT,
  is_online             BOOLEAN NOT NULL DEFAULT false,

  registration_required BOOLEAN NOT NULL DEFAULT false,
  registration_url      TEXT,
  registration_deadline DATE,
  max_participants      INT,
  current_participants  INT NOT NULL DEFAULT 0,
  price_xaf             INT,
  is_free               BOOLEAN NOT NULL DEFAULT true,

  cover_url             TEXT,
  gallery_urls          TEXT[],

  color                 TEXT DEFAULT '#16a34a',
  icon                  TEXT,
  show_on_website       BOOLEAN NOT NULL DEFAULT true,
  is_featured           BOOLEAN NOT NULL DEFAULT false,
  display_order         INT,

  contact_name          TEXT,
  contact_phone         TEXT,
  contact_email         TEXT
);

CREATE INDEX idx_events_status    ON events(status);
CREATE INDEX idx_events_type      ON events(type);
CREATE INDEX idx_events_date      ON events(start_date);
CREATE INDEX idx_events_featured  ON events(is_featured, show_on_website);

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON events FOR SELECT
  USING (show_on_website = true AND status != 'draft');
CREATE POLICY "events_admin_all" ON events FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- SEED
INSERT INTO events (title, title_fr, slug, type, status, audience, start_date, end_date, location, is_free, is_featured, show_on_website, color, icon, excerpt, excerpt_fr)
VALUES
  ('GSF Summer Boot Camp 2026', 'Boot Camp Été GSF 2026', 'gsf-bootcamp-ete-2026',
   'bootcamp', 'registration_open', 'players',
   '2026-07-14', '2026-07-19', 'Terrain Municipal de Bonapriso, Douala',
   false, true, true, '#16a34a', '🏕️',
   'Intensive 6-day boot camp for U12 to U18 players. Technical, tactical and physical training.',
   'Boot camp intensif de 6 jours pour les joueurs U12 à U18. Entraînement technique, tactique et physique.'),
  ('GSF Open Day 2026', 'Journée Portes Ouvertes GSF 2026', 'gsf-open-day-2026',
   'open_day', 'published', 'all',
   '2026-08-01', null, 'Académie GSF, Douala',
   true, true, true, '#0284c7', '🎪',
   'Come discover the GSF Academy. Free entry for all.',
   'Venez découvrir l''Académie GSF. Entrée gratuite pour tous.')
ON CONFLICT (slug) DO NOTHING;

SELECT 'Migration 006 - Events OK ✅' AS status;
