-- ============================================================
-- GSF Platform — Migrations 005 + 006 + 007 consolidées
-- Exécuter UNE SEULE FOIS dans Supabase SQL Editor
-- ============================================================

-- ─── MIGRATION 005 : COMPETITIONS & MATCHES ─────────────────

CREATE TYPE competition_type AS ENUM (
  'league','cup','tournament','friendly','training_game','other'
);
CREATE TYPE competition_status AS ENUM ('upcoming','ongoing','completed','cancelled');
CREATE TYPE match_status AS ENUM ('scheduled','live','completed','cancelled','postponed');
CREATE TYPE match_result AS ENUM ('win','loss','draw');

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
CREATE POLICY "competitions_public_read" ON competitions FOR SELECT USING (show_on_website = true);
CREATE POLICY "competitions_admin_all" ON competitions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

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

CREATE TRIGGER matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_public_read" ON matches FOR SELECT USING (true);
CREATE POLICY "matches_admin_all" ON matches FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

INSERT INTO competitions (name, name_fr, slug, type, status, season, color, is_featured, show_on_website, display_order)
VALUES
  ('GSF Inter-Academy Tournament 2025','Tournoi Inter-Académies GSF 2025','gsf-tournament-2025','tournament','completed','2025','#16a34a',true,true,1),
  ('Douala Youth League 2025-2026','Championnat Jeunes Douala 2025-2026','douala-youth-league-2526','league','ongoing','2025-2026','#0284c7',true,true,2)
ON CONFLICT (slug) DO NOTHING;

-- ─── MIGRATION 006 : EVENTS ──────────────────────────────────

CREATE TYPE event_type AS ENUM ('bootcamp','stage','tournament','open_day','gala','workshop','ceremony','other');
CREATE TYPE event_status AS ENUM ('draft','published','registration_open','registration_closed','ongoing','completed','cancelled');
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

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON events FOR SELECT USING (show_on_website = true AND status != 'draft');
CREATE POLICY "events_admin_all" ON events FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

INSERT INTO events (title, title_fr, slug, type, status, audience, start_date, end_date, location, is_free, is_featured, show_on_website, color, icon, excerpt, excerpt_fr)
VALUES
  ('GSF Summer Boot Camp 2026','Boot Camp Été GSF 2026','gsf-bootcamp-ete-2026','bootcamp','registration_open','players','2026-07-14','2026-07-19','Terrain Municipal de Bonapriso, Douala',false,true,true,'#16a34a','🏕️','Intensive 6-day boot camp for U12 to U18 players.','Boot camp intensif de 6 jours pour les joueurs U12 à U18.'),
  ('GSF Open Day 2026','Journée Portes Ouvertes GSF 2026','gsf-open-day-2026','open_day','published','all','2026-08-01',null,'Académie GSF, Douala',true,true,true,'#0284c7','🎪','Come discover the GSF Academy. Free entry for all.','Venez découvrir l''Académie GSF. Entrée gratuite pour tous.')
ON CONFLICT (slug) DO NOTHING;

-- ─── MIGRATION 007 : INVENTORY & LOGISTICS ───────────────────

CREATE TYPE item_category AS ENUM ('ball','jersey','shorts','socks','boots','goalkeeper','training_cone','bibs','goal','medical','electronics','office','trophy','other');
CREATE TYPE item_condition AS ENUM ('new','good','fair','poor','damaged');
CREATE TYPE item_status AS ENUM ('available','in_use','maintenance','lost','retired');
CREATE TYPE loan_status AS ENUM ('ongoing','returned','overdue');
CREATE TYPE request_status AS ENUM ('pending','approved','rejected','fulfilled');

CREATE TABLE IF NOT EXISTS inventory_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name                TEXT NOT NULL,
  name_fr             TEXT NOT NULL,
  description         TEXT,
  category            item_category NOT NULL DEFAULT 'other',
  status              item_status NOT NULL DEFAULT 'available',
  condition           item_condition NOT NULL DEFAULT 'good',
  quantity_total      INT NOT NULL DEFAULT 1,
  quantity_available  INT NOT NULL DEFAULT 1,
  quantity_in_use     INT NOT NULL DEFAULT 0,
  unit_price_xaf      INT,
  purchase_date       DATE,
  supplier            TEXT,
  assigned_to         TEXT,
  location            TEXT,
  serial_number       TEXT,
  photo_url           TEXT,
  notes               TEXT,
  reorder_threshold   INT,
  is_consumable       BOOLEAN NOT NULL DEFAULT false
);

CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_admin_all" ON inventory_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

CREATE TABLE IF NOT EXISTS equipment_loans (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  item_id               UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  borrower_name         TEXT NOT NULL,
  borrower_user_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  quantity              INT NOT NULL DEFAULT 1,
  date_out              DATE NOT NULL DEFAULT CURRENT_DATE,
  date_expected_back    DATE,
  date_returned         DATE,
  status                loan_status NOT NULL DEFAULT 'ongoing',
  notes                 TEXT
);

CREATE TRIGGER loans_updated_at BEFORE UPDATE ON equipment_loans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE equipment_loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loans_admin_all" ON equipment_loans FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

CREATE TABLE IF NOT EXISTS equipment_requests (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  requested_by          TEXT NOT NULL,
  requested_by_user_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  item_id               UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name             TEXT NOT NULL,
  quantity_requested    INT NOT NULL DEFAULT 1,
  purpose               TEXT,
  needed_by             DATE,
  status                request_status NOT NULL DEFAULT 'pending',
  reviewed_by           TEXT,
  review_notes          TEXT,
  reviewed_at           TIMESTAMPTZ
);

CREATE TRIGGER requests_updated_at BEFORE UPDATE ON equipment_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE equipment_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "requests_admin_all" ON equipment_requests FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

INSERT INTO inventory_items (name, name_fr, category, status, condition, quantity_total, quantity_available, quantity_in_use, unit_price_xaf, location, reorder_threshold)
VALUES
  ('Training Ball Size 5','Ballon d''entraînement T5','ball','available','good',20,15,5,15000,'Salle de stockage A',5),
  ('Training Cone','Cône d''entraînement','training_cone','available','good',50,45,5,2000,'Salle de stockage A',10),
  ('Training Bib Yellow','Chasuble jaune','bibs','available','good',30,28,2,3500,'Salle de stockage A',8),
  ('Training Bib Red','Chasuble rouge','bibs','available','good',30,27,3,3500,'Salle de stockage A',8),
  ('First Aid Kit','Trousse de premiers soins','medical','available','new',3,3,0,25000,'Bureau médical',1)
ON CONFLICT DO NOTHING;

SELECT 'Migrations 005 + 006 + 007 installées avec succès ✅' AS status;
