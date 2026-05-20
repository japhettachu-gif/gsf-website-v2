// ─── Roles ────────────────────────────────────────────────────────────────────
export type UserRole =
  | "super_admin"
  | "technical_director"
  | "coach"
  | "logistics"
  | "parent"
  | "player"
  | "public";

// ─── Players ──────────────────────────────────────────────────────────────────
export type Category = "U10_U12" | "U13_U15" | "U16_U18";
export type Position = "GK" | "DEF" | "MID" | "FWD";
export type StrongFoot = "right" | "left" | "both";
export type PlayerStatus = "active" | "inactive" | "on_loan" | "alumni";

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  category: Category;
  position: Position;
  city: string;
  nationality: string;
  height_cm?: number;
  weight_kg?: number;
  strong_foot?: StrongFoot;
  photo_url?: string;
  bio_fr?: string;
  bio_en?: string;
  status: PlayerStatus;
  user_id?: string;
  created_at: string;
}

// ─── Coaches ──────────────────────────────────────────────────────────────────
export interface Coach {
  id: string;
  user_id: string;
  role_fr: string;
  role_en: string;
  categories: Category[];
  certifications: string[];
  bio_fr?: string;
  bio_en?: string;
  photo_url?: string;
}

// ─── Training ─────────────────────────────────────────────────────────────────
export type SessionStatus = "planned" | "completed" | "cancelled";

export interface TrainingSession {
  id: string;
  date: string;
  time_start: string;
  time_end: string;
  category: Category;
  coach_id: string;
  location: string;
  theme_fr?: string;
  theme_en?: string;
  objectives: string[];
  notes?: string;
  status: SessionStatus;
}

export type AttendanceStatus = "present" | "absent" | "excused" | "injured";

export interface Attendance {
  id: string;
  session_id: string;
  player_id: string;
  status: AttendanceStatus;
  notes?: string;
}

// ─── Matches ──────────────────────────────────────────────────────────────────
export type MatchStatus = "upcoming" | "played" | "postponed" | "cancelled";

export interface Match {
  id: string;
  date: string;
  competition: string;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  category: Category;
  status: MatchStatus;
  location?: string;
  notes?: string;
}

// ─── Boot Camp ────────────────────────────────────────────────────────────────
export type BootCampStatus = "planned" | "ongoing" | "completed";

export interface BootCampEdition {
  id: string;
  year: number;
  theme_fr: string;
  theme_en: string;
  date_start: string;
  date_end: string;
  participants_count: number;
  description_fr?: string;
  description_en?: string;
  cover_url?: string;
  status: BootCampStatus;
}

// ─── Applications ─────────────────────────────────────────────────────────────
export type ApplicationType = "academy" | "boot_camp";
export type ApplicationStatus =
  | "received"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted";

export interface Application {
  id: string;
  type: ApplicationType;
  edition_id?: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  position: Position;
  city: string;
  country: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  experience?: string;
  message?: string;
  status: ApplicationStatus;
  created_at: string;
}

// ─── Equipment ────────────────────────────────────────────────────────────────
export type EquipmentCategory =
  | "balls"
  | "jerseys"
  | "boots"
  | "protection"
  | "medical"
  | "admin"
  | "other";
export type EquipmentCondition = "new" | "good" | "worn" | "out_of_service";
export type LoanStatus = "ongoing" | "returned" | "overdue";

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  quantity_total: number;
  quantity_available: number;
  condition: EquipmentCondition;
  location?: string;
  notes?: string;
  last_checked?: string;
}

export interface EquipmentLoan {
  id: string;
  equipment_id: string;
  borrower_id: string;
  quantity: number;
  date_out: string;
  date_expected_back: string;
  date_returned?: string;
  status: LoanStatus;
  notes?: string;
}

// ─── Evaluations ─────────────────────────────────────────────────────────────
export type EvaluationPillar =
  | "physical"
  | "mental"
  | "behaviour"
  | "academic"
  | "technical"
  | "tactical";

export type EvaluationType = "weekly" | "monthly" | "semester";
export type EvaluationStatus = "draft" | "finalised" | "published";
export type Rating = "developing" | "satisfactory" | "good" | "excellent";

export interface EvaluationCriteria {
  id: string;
  pillar: EvaluationPillar;
  position_specific: Position[] | null;
  name_fr: string;
  name_en: string;
  description_fr?: string;
  description_en?: string;
  sort_order: number;
  active: boolean;
}

export interface PlayerEvaluation {
  id: string;
  player_id: string;
  coach_id: string;
  type: EvaluationType;
  period_start: string;
  period_end: string;
  general_comment_fr?: string;
  general_comment_en?: string;
  objectives_next_period?: string;
  status: EvaluationStatus;
  published_at?: string;
  created_at: string;
}

export interface EvaluationScore {
  id: string;
  evaluation_id: string;
  criteria_id: string;
  rating: Rating;
  comment: string;
}

// ─── Media & News ─────────────────────────────────────────────────────────────
export type ArticleStatus = "draft" | "published" | "archived";

export interface NewsArticle {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  body_fr: string;
  body_en: string;
  cover_url?: string;
  author_id: string;
  published_at?: string;
  status: ArticleStatus;
  tags: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  caption_fr?: string;
  caption_en?: string;
  album?: string;
  boot_camp_edition_id?: string;
  uploaded_by: string;
  created_at: string;
}

// ─── Partners ─────────────────────────────────────────────────────────────────
export type PartnerTier = "title" | "official" | "supporter";

export interface Partner {
  id: string;
  name: string;
  tier: PartnerTier;
  logo_url?: string;
  website?: string;
  description_fr?: string;
  description_en?: string;
  active: boolean;
  sort_order: number;
}

// ─── Alumni ───────────────────────────────────────────────────────────────────
export interface Alumni {
  id: string;
  player_id?: string;
  name: string;
  current_club: string;
  country: string;
  years_at_gsf: string;
  story_fr?: string;
  story_en?: string;
  photo_url?: string;
  active: boolean;
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

// ─── Parent ───────────────────────────────────────────────────────────────────
export interface ParentProfile {
  id: string;
  user_id: string;
  player_id: string;
  relationship: string;
  verified: boolean;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export type Locale = "fr" | "en";

export interface PageProps {
  params: { locale: Locale };
}
