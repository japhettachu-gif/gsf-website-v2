// ─── COMPETITIONS ────────────────────────────────────────────────────────────

export type CompetitionType =
  | 'league' | 'cup' | 'tournament' | 'friendly' | 'training_game' | 'other'

export type CompetitionStatus =
  | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export interface Competition {
  id: string
  created_at: string
  updated_at: string

  name: string
  name_fr: string
  slug: string
  description: string | null
  description_fr: string | null

  type: CompetitionType
  status: CompetitionStatus
  age_group: string | null
  season: string | null

  start_date: string | null
  end_date: string | null
  location: string | null
  organizer: string | null

  logo_url: string | null
  color: string | null

  show_on_website: boolean
  display_order: number | null
  is_featured: boolean
}

// ─── MATCHES ────────────────────────────────────────────────────────────────

export type MatchStatus =
  | 'scheduled' | 'live' | 'completed' | 'cancelled' | 'postponed'

export type MatchResult = 'win' | 'loss' | 'draw' | null

export interface Match {
  id: string
  created_at: string
  updated_at: string

  competition_id: string | null
  competition?: Competition

  // Teams
  home_team: string
  away_team: string
  is_home_game: boolean   // true = GSF joue à domicile

  // Schedule
  match_date: string
  match_time: string | null
  location: string | null

  // Score
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  result: MatchResult

  // Details
  round: string | null
  notes: string | null
  notes_fr: string | null
  match_report: string | null
  match_report_fr: string | null

  // Media
  highlight_url: string | null
  photo_urls: string[] | null

  // Stats
  gsf_scorers: string[] | null
  gsf_assists: string[] | null
  man_of_match: string | null
}

// ─── LABELS ─────────────────────────────────────────────────────────────────

export const COMPETITION_TYPE_LABELS: Record<CompetitionType, { en: string; fr: string }> = {
  league:        { en: 'League',        fr: 'Championnat' },
  cup:           { en: 'Cup',           fr: 'Coupe' },
  tournament:    { en: 'Tournament',    fr: 'Tournoi' },
  friendly:      { en: 'Friendly',      fr: 'Match amical' },
  training_game: { en: 'Training Game', fr: 'Match d\'entraînement' },
  other:         { en: 'Other',         fr: 'Autre' },
}

export const COMPETITION_STATUS_LABELS: Record<CompetitionStatus, { en: string; fr: string }> = {
  upcoming:  { en: 'Upcoming',  fr: 'À venir' },
  ongoing:   { en: 'Ongoing',   fr: 'En cours' },
  completed: { en: 'Completed', fr: 'Terminé' },
  cancelled: { en: 'Cancelled', fr: 'Annulé' },
}

export const MATCH_STATUS_LABELS: Record<MatchStatus, { en: string; fr: string }> = {
  scheduled: { en: 'Scheduled', fr: 'Planifié' },
  live:      { en: 'Live',      fr: 'En direct' },
  completed: { en: 'Completed', fr: 'Terminé' },
  cancelled: { en: 'Cancelled', fr: 'Annulé' },
  postponed: { en: 'Postponed', fr: 'Reporté' },
}

export const RESULT_COLORS: Record<string, string> = {
  win:  '#16a34a',
  loss: '#dc2626',
  draw: '#ca8a04',
}
