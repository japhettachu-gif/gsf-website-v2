-- ============================================================
-- GSF Platform — Migration 007: Logistics & Equipment
-- ============================================================

CREATE TYPE item_category AS ENUM (
  'ball','jersey','shorts','socks','boots','goalkeeper',
  'training_cone','bibs','goal','medical','electronics','office','trophy','other'
);
CREATE TYPE item_condition AS ENUM ('new','good','fair','poor','damaged');
CREATE TYPE item_status AS ENUM ('available','in_use','maintenance','lost','retired');
CREATE TYPE loan_status AS ENUM ('ongoing','returned','overdue');
CREATE TYPE request_status AS ENUM ('pending','approved','rejected','fulfilled');

-- INVENTORY ITEMS
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

CREATE INDEX idx_inventory_category ON inventory_items(category);
CREATE INDEX idx_inventory_status   ON inventory_items(status);

CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_admin_all" ON inventory_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- EQUIPMENT LOANS
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

CREATE INDEX idx_loans_item   ON equipment_loans(item_id);
CREATE INDEX idx_loans_status ON equipment_loans(status);

CREATE TRIGGER loans_updated_at BEFORE UPDATE ON equipment_loans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE equipment_loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loans_admin_all" ON equipment_loans FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','super_admin')));

-- EQUIPMENT REQUESTS
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

-- SEED
INSERT INTO inventory_items (name, name_fr, category, status, condition, quantity_total, quantity_available, quantity_in_use, unit_price_xaf, location, reorder_threshold)
VALUES
  ('Training Ball Size 5', 'Ballon d''entraînement T5', 'ball', 'available', 'good', 20, 15, 5, 15000, 'Salle de stockage A', 5),
  ('Training Cone', 'Cône d''entraînement', 'training_cone', 'available', 'good', 50, 45, 5, 2000, 'Salle de stockage A', 10),
  ('Training Bib Yellow', 'Chasuble jaune', 'bibs', 'available', 'good', 30, 28, 2, 3500, 'Salle de stockage A', 8),
  ('Training Bib Red', 'Chasuble rouge', 'bibs', 'available', 'good', 30, 27, 3, 3500, 'Salle de stockage A', 8),
  ('First Aid Kit', 'Trousse de premiers soins', 'medical', 'available', 'new', 3, 3, 0, 25000, 'Bureau médical', 1)
ON CONFLICT DO NOTHING;

SELECT 'Migration 007 - Logistics & Equipment OK ✅' AS status;
