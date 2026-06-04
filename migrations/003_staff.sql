-- ============================================================
-- GSF Platform — Migration 003: Staff & Encadreurs
-- ============================================================

CREATE TYPE staff_role AS ENUM (
  'head_coach',
  'assistant_coach',
  'goalkeeper_coach',
  'fitness_coach',
  'physiotherapist',
  'team_manager',
  'scout',
  'administrator',
  'medical_staff',
  'other'
);

CREATE TYPE staff_status AS ENUM (
  'active',
  'inactive',
  'on_leave'
);

CREATE TABLE IF NOT EXISTS staff (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Identity
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  display_name      TEXT,
  photo_url         TEXT,

  -- Role
  role              staff_role NOT NULL DEFAULT 'other',
  status            staff_status NOT NULL DEFAULT 'active',
  bio               TEXT,
  bio_fr            TEXT,

  -- Contact
  email             TEXT,
  phone             TEXT,
  whatsapp          TEXT,

  -- Professional
  nationality       TEXT,
  date_of_birth     DATE,
  years_experience  INT,
  certifications    TEXT[],
  specialties       TEXT[],

  -- Social
  linkedin_url      TEXT,
  instagram_url     TEXT,

  -- Visibility
  show_on_website   BOOLEAN NOT NULL DEFAULT true,
  display_order     INT
);

-- Indexes
CREATE INDEX idx_staff_role    ON staff(role);
CREATE INDEX idx_staff_status  ON staff(status);
CREATE INDEX idx_staff_website ON staff(show_on_website, status);
CREATE INDEX idx_staff_order   ON staff(display_order);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_staff_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_staff_updated_at();

-- RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Public read: active staff visible on website
CREATE POLICY "staff_public_read" ON staff
  FOR SELECT USING (show_on_website = true AND status = 'active');

-- Admin full access
CREATE POLICY "staff_admin_all" ON staff
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Seed data — staff GSF exemple
INSERT INTO staff (first_name, last_name, role, status, bio, bio_fr, nationality, years_experience, show_on_website, display_order)
VALUES
  ('Hervé', 'NJAHA Bardo', 'head_coach', 'active',
   'Co-founder and Head Coach of Genius Soccer Foundation. Passionate about youth development and player excellence.',
   'Co-fondateur et Entraîneur Principal de la Genius Soccer Foundation. Passionné par le développement des jeunes et l''excellence sportive.',
   'Camerounaise', 10, true, 1),
  ('Japhel', 'Tachu Memba', 'administrator', 'active',
   'Co-founder and Project Director. Oversees operations, partnerships and platform development.',
   'Co-fondateur et Directeur de Projet. Supervise les opérations, les partenariats et le développement de la plateforme.',
   'Camerounaise', 10, true, 2);
