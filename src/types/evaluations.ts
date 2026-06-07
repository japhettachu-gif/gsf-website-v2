export type EvaluationPillar =
  | 'physical' | 'mental' | 'behaviour' | 'academic' | 'technical' | 'tactical'

export type EvaluationPosition = 'GK' | 'DEF' | 'MID' | 'FWD'

export type EvaluationRating = 'developing' | 'satisfactory' | 'good' | 'excellent'

export type EvaluationType = 'weekly' | 'monthly' | 'semester'

export type EvaluationStatus = 'draft' | 'finalised' | 'published'

export interface EvaluationCriteria {
  id: string
  created_at: string
  pillar: EvaluationPillar
  position_specific: EvaluationPosition[] | null  // null = tous postes
  name_fr: string
  name_en: string
  description_fr: string | null
  description_en: string | null
  sort_order: number
  active: boolean
}

export interface PlayerEvaluation {
  id: string
  created_at: string
  updated_at: string
  player_id: string
  player?: { first_name: string; last_name: string; photo_url: string | null; position: string }
  coach_id: string | null
  coach?: { first_name: string; last_name: string; display_name: string | null }
  type: EvaluationType
  period_start: string
  period_end: string
  general_comment_fr: string | null
  general_comment_en: string | null
  objectives_next_period: string | null
  status: EvaluationStatus
  published_at: string | null
}

export interface EvaluationScore {
  id: string
  created_at: string
  evaluation_id: string
  criteria_id: string
  criteria?: EvaluationCriteria
  rating: EvaluationRating
  comment: string
}

// ─── LABELS ──────────────────────────────────────────────────────────────────

export const RATING_CONFIG: Record<EvaluationRating, { fr: string; en: string; color: string; bg: string; emoji: string }> = {
  developing:   { fr: 'En développement', en: 'Developing',  color: '#dc2626', bg: '#fef2f2', emoji: '🔴' },
  satisfactory: { fr: 'Satisfaisant',     en: 'Satisfactory',color: '#ca8a04', bg: '#fefce8', emoji: '🟡' },
  good:         { fr: 'Bien',             en: 'Good',        color: '#16a34a', bg: '#f0fdf4', emoji: '🟢' },
  excellent:    { fr: 'Excellent',        en: 'Excellent',   color: '#b45309', bg: '#fffbeb', emoji: '⭐' },
}

export const PILLAR_LABELS: Record<EvaluationPillar, { fr: string; emoji: string }> = {
  physical:   { fr: 'Physique',    emoji: '💪' },
  mental:     { fr: 'Mental',      emoji: '🧠' },
  behaviour:  { fr: 'Comportement',emoji: '🤝' },
  academic:   { fr: 'Académique',  emoji: '📚' },
  technical:  { fr: 'Technique',   emoji: '⚽' },
  tactical:   { fr: 'Tactique',    emoji: '🎯' },
}

export const EVALUATION_TYPE_LABELS: Record<EvaluationType, { fr: string; en: string }> = {
  weekly:   { fr: 'Rapport hebdomadaire', en: 'Weekly Report' },
  monthly:  { fr: 'Rapport mensuel',      en: 'Monthly Report' },
  semester: { fr: 'Rapport semestriel',   en: 'Semester Report' },
}

export const EVALUATION_STATUS_LABELS: Record<EvaluationStatus, { fr: string; color: string }> = {
  draft:      { fr: 'Brouillon',  color: '#9ca3af' },
  finalised:  { fr: 'Finalisé',   color: '#0284c7' },
  published:  { fr: 'Publié',     color: '#16a34a' },
}
