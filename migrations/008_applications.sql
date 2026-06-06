-- ============================================================
-- GSF Platform — Migration 008: Applications & Inscriptions
-- ============================================================

CREATE TYPE application_type AS ENUM ('academy', 'boot_camp');
CREATE TYPE application_status AS ENUM (
  'received', 'under_review', 'accepted', 'rejected', 'waitlisted', 'withdrawn'
);
CREATE TYPE player_position AS ENUM ('GK', 'DEF', 'MID', 'FWD');
CREATE TYPE strong_foot AS ENUM ('right', 'left', 'both');

CREATE TABLE IF NOT EXISTS applications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  type                  application_type NOT NULL DEFAULT 'academy',
  event_id              UUID REFERENCES events(id) ON DELETE SET NULL,

  -- Player
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  birth_date            DATE NOT NULL,
  position              player_position NOT NULL,
  strong_foot           strong_foot,
  city                  TEXT NOT NULL,
  country               TEXT NOT NULL DEFAULT 'Cameroun',
  nationality           TEXT,
  height_cm             INT,
  weight_kg             INT,

  -- Parent
  parent_name           TEXT NOT NULL,
  parent_email          TEXT NOT NULL,
  parent_phone          TEXT NOT NULL,
  parent_relationship   TEXT,

  -- Experience
  current_club          TEXT,
  years_playing         INT,
  experience            TEXT,
  previous_academies    TEXT,

  -- Motivation
  message               TEXT,
  how_did_you_hear      TEXT,

  -- Status
  status                application_status NOT NULL DEFAULT 'received',
  reviewed_by           TEXT,
  review_notes          TEXT,
  reviewed_at           TIMESTAMPTZ,
  interview_date        DATE,

  -- Documents
  photo_url             TEXT,
  document_urls         TEXT[]
);

CREATE INDEX idx_applications_type   ON applications(type);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date   ON applications(created_at DESC);

CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public: submit only (INSERT)
CREATE POLICY "applications_public_insert" ON applications
  FOR INSERT WITH CHECK (true);

-- Admin: full access
CREATE POLICY "applications_admin_all" ON applications FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  ));

SELECT 'Migration 008 - Applications OK ✅' AS status;
