-- ============================================================
-- GSF Academy Platform — Schéma Supabase complet
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── ENUMS ────────────────────────────────────────────────────────────────────

create type user_role as enum (
  'super_admin', 'technical_director', 'coach', 'logistics', 'parent', 'player'
);

create type player_category as enum ('U10_U12', 'U13_U15', 'U16_U18');
create type player_position as enum ('GK', 'DEF', 'MID', 'FWD');
create type strong_foot as enum ('right', 'left', 'both');
create type player_status as enum ('active', 'inactive', 'on_loan', 'alumni');

create type session_status as enum ('planned', 'completed', 'cancelled');
create type attendance_status as enum ('present', 'absent', 'excused', 'injured');

create type match_status as enum ('upcoming', 'played', 'postponed', 'cancelled');
create type boot_camp_status as enum ('planned', 'ongoing', 'completed');

create type application_type as enum ('academy', 'boot_camp');
create type application_status as enum (
  'received', 'under_review', 'accepted', 'rejected', 'waitlisted'
);

create type equipment_category as enum (
  'balls', 'jerseys', 'boots', 'protection', 'medical', 'admin', 'other'
);
create type equipment_condition as enum ('new', 'good', 'worn', 'out_of_service');
create type loan_status as enum ('ongoing', 'returned', 'overdue');

create type evaluation_pillar as enum (
  'physical', 'mental', 'behaviour', 'academic', 'technical', 'tactical'
);
create type evaluation_type as enum ('weekly', 'monthly', 'semester');
create type evaluation_status as enum ('draft', 'finalised', 'published');
create type rating as enum ('developing', 'satisfactory', 'good', 'excellent');

create type article_status as enum ('draft', 'published', 'archived');
create type partner_tier as enum ('title', 'official', 'supporter');

-- ─── PROFILES ────────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'player',
  display_name text not null,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now()
);

-- Trigger: créer profil automatiquement à l'inscription
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'player'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── PLAYERS ─────────────────────────────────────────────────────────────────

create table players (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  birth_date date not null,
  category player_category not null,
  position player_position not null,
  city text not null default '',
  nationality text not null default 'Camerounaise',
  height_cm int,
  weight_kg int,
  strong_foot strong_foot,
  photo_url text,
  bio_fr text,
  bio_en text,
  status player_status not null default 'active',
  user_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ─── COACHES ─────────────────────────────────────────────────────────────────

create table coaches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  role_fr text not null,
  role_en text not null,
  categories player_category[] not null default '{}',
  certifications text[] not null default '{}',
  bio_fr text,
  bio_en text,
  photo_url text
);

-- ─── TRAINING SESSIONS ───────────────────────────────────────────────────────

create table training_sessions (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  time_start time not null,
  time_end time not null,
  category player_category not null,
  coach_id uuid not null references coaches(id) on delete restrict,
  location text not null default 'Terrain Deido',
  theme_fr text,
  theme_en text,
  objectives text[] not null default '{}',
  notes text,
  status session_status not null default 'planned',
  created_at timestamptz not null default now()
);

-- ─── ATTENDANCES ─────────────────────────────────────────────────────────────

create table attendances (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references training_sessions(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  status attendance_status not null default 'present',
  notes text,
  unique(session_id, player_id)
);

-- ─── MATCHES ─────────────────────────────────────────────────────────────────

create table matches (
  id uuid primary key default uuid_generate_v4(),
  date timestamptz not null,
  competition text not null,
  home_team text not null,
  away_team text not null,
  home_score int,
  away_score int,
  category player_category not null,
  status match_status not null default 'upcoming',
  location text,
  notes text,
  created_at timestamptz not null default now()
);

-- ─── BOOT CAMP EDITIONS ──────────────────────────────────────────────────────

create table boot_camp_editions (
  id uuid primary key default uuid_generate_v4(),
  year int not null unique,
  theme_fr text not null,
  theme_en text not null,
  date_start date not null,
  date_end date not null,
  participants_count int not null default 0,
  description_fr text,
  description_en text,
  cover_url text,
  status boot_camp_status not null default 'planned',
  created_at timestamptz not null default now()
);

-- ─── APPLICATIONS ────────────────────────────────────────────────────────────

create table applications (
  id uuid primary key default uuid_generate_v4(),
  type application_type not null,
  edition_id uuid references boot_camp_editions(id) on delete set null,
  first_name text not null,
  last_name text not null,
  birth_date date not null,
  position player_position not null,
  city text not null,
  country text not null default 'Cameroun',
  parent_name text not null,
  parent_email text not null,
  parent_phone text not null,
  experience text,
  message text,
  status application_status not null default 'received',
  created_at timestamptz not null default now()
);

-- ─── EQUIPMENT ───────────────────────────────────────────────────────────────

create table equipment (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category equipment_category not null,
  quantity_total int not null default 0,
  quantity_available int not null default 0,
  condition equipment_condition not null default 'new',
  location text,
  notes text,
  last_checked date,
  created_at timestamptz not null default now()
);

create table equipment_loans (
  id uuid primary key default uuid_generate_v4(),
  equipment_id uuid not null references equipment(id) on delete restrict,
  borrower_id uuid not null references profiles(id) on delete restrict,
  quantity int not null default 1,
  date_out date not null,
  date_expected_back date not null,
  date_returned date,
  status loan_status not null default 'ongoing',
  notes text,
  created_at timestamptz not null default now()
);

-- ─── EVALUATION CRITERIA ─────────────────────────────────────────────────────

create table evaluation_criteria (
  id uuid primary key default uuid_generate_v4(),
  pillar evaluation_pillar not null,
  position_specific player_position[],
  name_fr text not null,
  name_en text not null,
  description_fr text,
  description_en text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── PLAYER EVALUATIONS ──────────────────────────────────────────────────────

create table player_evaluations (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references players(id) on delete cascade,
  coach_id uuid not null references coaches(id) on delete restrict,
  type evaluation_type not null,
  period_start date not null,
  period_end date not null,
  general_comment_fr text,
  general_comment_en text,
  objectives_next_period text,
  status evaluation_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table evaluation_scores (
  id uuid primary key default uuid_generate_v4(),
  evaluation_id uuid not null references player_evaluations(id) on delete cascade,
  criteria_id uuid not null references evaluation_criteria(id) on delete restrict,
  rating rating not null,
  comment text not null,
  created_at timestamptz not null default now(),
  unique(evaluation_id, criteria_id)
);

-- ─── PARENT PROFILES ─────────────────────────────────────────────────────────

create table parent_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  relationship text not null default 'parent',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, player_id)
);

-- ─── NEWS ARTICLES ───────────────────────────────────────────────────────────

create table news_articles (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title_fr text not null,
  title_en text not null,
  excerpt_fr text not null,
  excerpt_en text not null,
  body_fr text not null,
  body_en text not null,
  cover_url text,
  author_id uuid not null references profiles(id) on delete restrict,
  published_at timestamptz,
  status article_status not null default 'draft',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ─── GALLERY IMAGES ──────────────────────────────────────────────────────────

create table gallery_images (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  caption_fr text,
  caption_en text,
  album text,
  boot_camp_edition_id uuid references boot_camp_editions(id) on delete set null,
  uploaded_by uuid not null references profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

-- ─── PARTNERS ────────────────────────────────────────────────────────────────

create table partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  tier partner_tier not null,
  logo_url text,
  website text,
  description_fr text,
  description_en text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── ALUMNI ──────────────────────────────────────────────────────────────────

create table alumni (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references players(id) on delete set null,
  name text not null,
  current_club text not null,
  country text not null,
  years_at_gsf text not null,
  story_fr text,
  story_en text,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Activer RLS sur toutes les tables
alter table profiles enable row level security;
alter table players enable row level security;
alter table coaches enable row level security;
alter table training_sessions enable row level security;
alter table attendances enable row level security;
alter table matches enable row level security;
alter table boot_camp_editions enable row level security;
alter table applications enable row level security;
alter table equipment enable row level security;
alter table equipment_loans enable row level security;
alter table evaluation_criteria enable row level security;
alter table player_evaluations enable row level security;
alter table evaluation_scores enable row level security;
alter table parent_profiles enable row level security;
alter table news_articles enable row level security;
alter table gallery_images enable row level security;
alter table partners enable row level security;
alter table alumni enable row level security;

-- Helper: obtenir le rôle de l'utilisateur courant
create or replace function get_user_role()
returns user_role language sql security definer stable as $$
  select role from profiles where id = auth.uid()
$$;

-- Helper: vérifier si admin
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select get_user_role() in ('super_admin', 'technical_director')
$$;

-- Helper: vérifier si staff
create or replace function is_staff()
returns boolean language sql security definer stable as $$
  select get_user_role() in ('super_admin', 'technical_director', 'coach', 'logistics')
$$;

-- ── PROFILES ──────────────────────────────────────────────────
create policy "Profil visible par l'utilisateur lui-même et le staff"
  on profiles for select
  using (id = auth.uid() or is_staff());

create policy "Profil modifiable par l'utilisateur lui-même"
  on profiles for update
  using (id = auth.uid());

create policy "Super admin peut tout modifier"
  on profiles for all
  using (get_user_role() = 'super_admin');

-- ── PLAYERS ───────────────────────────────────────────────────
-- Lecture publique pour joueurs actifs
create policy "Joueurs actifs visibles publiquement"
  on players for select
  using (status = 'active' or is_staff() or id = (
    select p.id from players p where p.user_id = auth.uid() limit 1
  ));

create policy "Staff peut créer des joueurs"
  on players for insert
  with check (is_admin());

create policy "Staff peut modifier des joueurs"
  on players for update
  using (is_staff());

create policy "Admin peut supprimer des joueurs"
  on players for delete
  using (is_admin());

-- ── COACHES ───────────────────────────────────────────────────
create policy "Coachs visibles publiquement"
  on coaches for select using (true);

create policy "Admin gère les coachs"
  on coaches for all using (is_admin());

-- ── TRAINING SESSIONS ─────────────────────────────────────────
create policy "Séances visibles par le staff"
  on training_sessions for select using (is_staff());

create policy "Staff peut créer des séances"
  on training_sessions for insert with check (is_staff());

create policy "Staff peut modifier ses séances"
  on training_sessions for update using (is_staff());

create policy "Admin peut supprimer des séances"
  on training_sessions for delete using (is_admin());

-- ── MATCHES ───────────────────────────────────────────────────
create policy "Matchs visibles publiquement"
  on matches for select using (true);

create policy "Admin gère les matchs"
  on matches for all using (is_admin());

-- ── BOOT CAMP ─────────────────────────────────────────────────
create policy "Éditions Boot Camp visibles publiquement"
  on boot_camp_editions for select using (true);

create policy "Admin gère les éditions Boot Camp"
  on boot_camp_editions for all using (is_admin());

-- ── APPLICATIONS ──────────────────────────────────────────────
create policy "Candidatures visibles par l'admin"
  on applications for select using (is_admin());

create policy "Candidatures créables publiquement"
  on applications for insert with check (true);

create policy "Admin peut modifier les candidatures"
  on applications for update using (is_admin());

-- ── EQUIPMENT ─────────────────────────────────────────────────
create policy "Équipement visible par le staff"
  on equipment for select
  using (is_staff());

create policy "Logistique et admin gèrent l'équipement"
  on equipment for all
  using (get_user_role() in ('super_admin', 'technical_director', 'logistics'));

-- ── EVALUATIONS ───────────────────────────────────────────────
create policy "Critères d'évaluation visibles par le staff"
  on evaluation_criteria for select using (is_staff());

create policy "Super admin configure les critères"
  on evaluation_criteria for all
  using (get_user_role() = 'super_admin');

create policy "Bulletins visibles par le staff concerné"
  on player_evaluations for select
  using (
    is_admin()
    or (get_user_role() = 'coach' and coach_id = (
      select id from coaches where user_id = auth.uid() limit 1
    ))
    or (get_user_role() = 'player' and player_id = (
      select id from players where user_id = auth.uid() limit 1
    ))
    or (get_user_role() = 'parent' and player_id in (
      select player_id from parent_profiles where user_id = auth.uid()
    ) and status = 'published')
  );

create policy "Coach peut créer des bulletins"
  on player_evaluations for insert
  with check (is_staff());

create policy "Coach peut modifier ses bulletins en brouillon"
  on player_evaluations for update
  using (
    is_admin()
    or (get_user_role() = 'coach' and status = 'draft')
  );

create policy "Scores visibles avec le bulletin"
  on evaluation_scores for select
  using (
    evaluation_id in (
      select id from player_evaluations
    )
  );

create policy "Staff peut créer des scores"
  on evaluation_scores for insert with check (is_staff());

create policy "Staff peut modifier des scores"
  on evaluation_scores for update using (is_staff());

-- ── PARENT PROFILES ───────────────────────────────────────────
create policy "Parent voit ses propres liens"
  on parent_profiles for select
  using (user_id = auth.uid() or is_admin());

create policy "Admin gère les liens parent-joueur"
  on parent_profiles for all using (is_admin());

-- ── NEWS ──────────────────────────────────────────────────────
create policy "Articles publiés visibles publiquement"
  on news_articles for select
  using (status = 'published' or is_admin());

create policy "Admin gère les articles"
  on news_articles for all using (is_admin());

-- ── GALLERY ───────────────────────────────────────────────────
create policy "Galerie visible publiquement"
  on gallery_images for select using (true);

create policy "Admin gère la galerie"
  on gallery_images for all using (is_admin());

-- ── PARTNERS ──────────────────────────────────────────────────
create policy "Partenaires actifs visibles publiquement"
  on partners for select using (active = true or is_admin());

create policy "Super admin gère les partenaires"
  on partners for all using (is_admin());

-- ── ALUMNI ────────────────────────────────────────────────────
create policy "Alumni actifs visibles publiquement"
  on alumni for select using (active = true or is_admin());

create policy "Admin gère les alumni"
  on alumni for all using (is_admin());

-- ═══════════════════════════════════════════════════════════════
-- DONNÉES INITIALES — Critères d'évaluation
-- ═══════════════════════════════════════════════════════════════

-- Physique (commun à tous)
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('physical', null, 'Vitesse', 'Speed', 1),
('physical', null, 'Vivacité', 'Agility', 2),
('physical', null, 'Explosivité', 'Explosiveness', 3),
('physical', null, 'Force', 'Strength', 4),
('physical', null, 'Puissance', 'Power', 5),
('physical', null, 'Détente', 'Vertical leap', 6),
('physical', null, 'Souplesse', 'Flexibility', 7),
('physical', null, 'Endurance', 'Endurance', 8);

-- Mental (commun)
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('mental', null, 'Concentration', 'Concentration', 10),
('mental', null, 'Résilience', 'Resilience', 11),
('mental', null, 'Leadership', 'Leadership', 12),
('mental', null, 'Gestion du stress', 'Stress management', 13),
('mental', null, 'Confiance en soi', 'Self-confidence', 14);

-- Comportement (commun)
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('behaviour', null, 'Discipline', 'Discipline', 20),
('behaviour', null, 'Respect', 'Respect', 21),
('behaviour', null, 'Esprit d''équipe', 'Team spirit', 22),
('behaviour', null, 'Communication', 'Communication', 23),
('behaviour', null, 'Ponctualité', 'Punctuality', 24);

-- Académique (commun)
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('academic', null, 'Assiduité', 'Attendance', 30),
('academic', null, 'Résultats scolaires', 'School results', 31),
('academic', null, 'Engagement intellectuel', 'Intellectual engagement', 32);

-- Technique GK
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('technical', '{GK}', 'Jeu de main', 'Handling', 40),
('technical', '{GK}', 'Jeu au pied', 'Distribution', 41),
('technical', '{GK}', 'Sorties', 'Shot-stopping', 42),
('technical', '{GK}', 'Plongeon', 'Diving', 43);

-- Tactique GK
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('tactical', '{GK}', 'Placement', 'Positioning', 50),
('tactical', '{GK}', 'Commandement', 'Organisation', 51),
('tactical', '{GK}', 'Lecture du jeu', 'Game reading', 52);

-- Technique DEF
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('technical', '{DEF}', 'Duel défensif', 'Defensive duel', 40),
('technical', '{DEF}', 'Relance', 'Distribution', 41),
('technical', '{DEF}', 'Jeu de tête', 'Aerial defending', 42),
('technical', '{DEF}', 'Contrôle', 'First touch', 43);

-- Tactique DEF
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('tactical', '{DEF}', 'Marquage', 'Marking', 50),
('tactical', '{DEF}', 'Positionnement', 'Positioning', 51),
('tactical', '{DEF}', 'Couverture', 'Cover', 52);

-- Technique MID
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('technical', '{MID}', 'Qualité de passe', 'Pass quality', 40),
('technical', '{MID}', 'Contrôle orienté', 'Oriented control', 41),
('technical', '{MID}', 'Dribble', 'Dribbling', 42),
('technical', '{MID}', 'Frappe', 'Shooting', 43);

-- Tactique MID
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('tactical', '{MID}', 'Vision du jeu', 'Vision', 50),
('tactical', '{MID}', 'Transition', 'Transition', 51),
('tactical', '{MID}', 'Pressing', 'Pressing', 52),
('tactical', '{MID}', 'Occupation des espaces', 'Space occupation', 53);

-- Technique FWD
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('technical', '{FWD}', 'Finition', 'Finishing', 40),
('technical', '{FWD}', 'Dribble', 'Dribbling', 41),
('technical', '{FWD}', 'Conservation', 'Ball retention', 42),
('technical', '{FWD}', 'Jeu de tête offensif', 'Aerial play', 43);

-- Tactique FWD
insert into evaluation_criteria (pillar, position_specific, name_fr, name_en, sort_order) values
('tactical', '{FWD}', 'Démarquage', 'Movement', 50),
('tactical', '{FWD}', 'Pressing offensif', 'High press', 51),
('tactical', '{FWD}', 'Jeu dos au but', 'Hold-up play', 52),
('tactical', '{FWD}', 'Courses en profondeur', 'Runs in behind', 53);
