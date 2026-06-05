// ─── PROGRAMS ───────────────────────────────────────────────────────────────

export type AgeGroup =
  | 'U8' | 'U10' | 'U12' | 'U14' | 'U16' | 'U18' | 'U21'
  | 'senior' | 'feminin' | 'elite' | 'all'

export type ProgramLevel = 'initiation' | 'development' | 'performance' | 'elite'

export type ProgramStatus = 'active' | 'inactive' | 'upcoming' | 'archived'

export interface Program {
  id: string
  created_at: string
  updated_at: string

  // Content
  name: string
  name_fr: string
  slug: string
  description: string | null
  description_fr: string | null

  // Classification
  age_group: AgeGroup
  level: ProgramLevel
  status: ProgramStatus

  // Details
  max_players: number | null
  current_players: number
  duration_weeks: number | null
  sessions_per_week: number | null
  session_duration_minutes: number | null
  price_xaf: number | null

  // Media
  icon: string | null
  color: string | null
  cover_url: string | null

  // Display
  show_on_website: boolean
  display_order: number | null
  objectives: string[] | null
  objectives_fr: string[] | null
}

// ─── TRAINING SESSIONS ───────────────────────────────────────────────────────

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6
// 0=Dimanche, 1=Lundi, 2=Mardi, 3=Mercredi, 4=Jeudi, 5=Vendredi, 6=Samedi

export type SessionType =
  | 'training'
  | 'match'
  | 'evaluation'
  | 'physical'
  | 'tactical'
  | 'recovery'
  | 'event'

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'postponed'

export interface TrainingSession {
  id: string
  created_at: string
  updated_at: string

  // Relations
  program_id: string | null
  program?: Program

  // Schedule
  day_of_week: DayOfWeek
  start_time: string       // HH:MM
  end_time: string         // HH:MM
  effective_from: string   // date ISO
  effective_until: string | null

  // Details
  title: string | null
  title_fr: string | null
  type: SessionType
  status: SessionStatus
  location: string | null
  notes: string | null
  notes_fr: string | null

  // Staff
  coach_id: string | null
  coach?: { first_name: string; last_name: string; display_name: string | null }

  // Recurrence
  is_recurring: boolean
  recurrence_exceptions: string[] | null
}

// ─── LABELS ─────────────────────────────────────────────────────────────────

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  U8: 'U8 (- 8 ans)', U10: 'U10 (- 10 ans)', U12: 'U12 (- 12 ans)',
  U14: 'U14 (- 14 ans)', U16: 'U16 (- 16 ans)', U18: 'U18 (- 18 ans)',
  U21: 'U21 (- 21 ans)', senior: 'Séniors', feminin: 'Féminin',
  elite: 'Élite', all: 'Tous groupes',
}

export const PROGRAM_LEVEL_LABELS: Record<ProgramLevel, { en: string; fr: string }> = {
  initiation:   { en: 'Initiation',   fr: 'Initiation' },
  development:  { en: 'Development',  fr: 'Développement' },
  performance:  { en: 'Performance',  fr: 'Performance' },
  elite:        { en: 'Elite',        fr: 'Élite' },
}

export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, { en: string; fr: string }> = {
  active:   { en: 'Active',    fr: 'Actif' },
  inactive: { en: 'Inactive',  fr: 'Inactif' },
  upcoming: { en: 'Upcoming',  fr: 'À venir' },
  archived: { en: 'Archived',  fr: 'Archivé' },
}

export const SESSION_TYPE_LABELS: Record<SessionType, { en: string; fr: string }> = {
  training:   { en: 'Training',    fr: 'Entraînement' },
  match:      { en: 'Match',       fr: 'Match' },
  evaluation: { en: 'Evaluation',  fr: 'Évaluation' },
  physical:   { en: 'Physical',    fr: 'Prépa physique' },
  tactical:   { en: 'Tactical',    fr: 'Tactique' },
  recovery:   { en: 'Recovery',    fr: 'Récupération' },
  event:      { en: 'Event',       fr: 'Événement' },
}

export const SESSION_STATUS_LABELS: Record<SessionStatus, { en: string; fr: string }> = {
  scheduled:  { en: 'Scheduled',  fr: 'Planifié' },
  completed:  { en: 'Completed',  fr: 'Effectué' },
  cancelled:  { en: 'Cancelled',  fr: 'Annulé' },
  postponed:  { en: 'Postponed',  fr: 'Reporté' },
}

export const DAY_LABELS: Record<DayOfWeek, { en: string; fr: string; short: string }> = {
  0: { en: 'Sunday',    fr: 'Dimanche', short: 'Dim' },
  1: { en: 'Monday',    fr: 'Lundi',    short: 'Lun' },
  2: { en: 'Tuesday',   fr: 'Mardi',    short: 'Mar' },
  3: { en: 'Wednesday', fr: 'Mercredi', short: 'Mer' },
  4: { en: 'Thursday',  fr: 'Jeudi',    short: 'Jeu' },
  5: { en: 'Friday',    fr: 'Vendredi', short: 'Ven' },
  6: { en: 'Saturday',  fr: 'Samedi',   short: 'Sam' },
}

export const SESSION_TYPE_COLORS: Record<SessionType, string> = {
  training:   '#16a34a',
  match:      '#dc2626',
  evaluation: '#9333ea',
  physical:   '#ea580c',
  tactical:   '#0284c7',
  recovery:   '#0891b2',
  event:      '#ca8a04',
}
