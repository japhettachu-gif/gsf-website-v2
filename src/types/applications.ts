export type ApplicationType = 'academy' | 'boot_camp'

export type ApplicationStatus =
  | 'received'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'waitlisted'
  | 'withdrawn'

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD'

export type StrongFoot = 'right' | 'left' | 'both'

export interface Application {
  id: string
  created_at: string
  updated_at: string

  // Type
  type: ApplicationType
  event_id: string | null         // lié à un événement (boot camp)

  // Player info
  first_name: string
  last_name: string
  birth_date: string
  position: PlayerPosition
  strong_foot: StrongFoot | null
  city: string
  country: string
  nationality: string | null
  height_cm: number | null
  weight_kg: number | null

  // Parent/Guardian
  parent_name: string
  parent_email: string
  parent_phone: string
  parent_relationship: string | null

  // Experience
  current_club: string | null
  years_playing: number | null
  experience: string | null
  previous_academies: string | null

  // Motivation
  message: string | null
  how_did_you_hear: string | null

  // Status & Review
  status: ApplicationStatus
  reviewed_by: string | null
  review_notes: string | null
  reviewed_at: string | null
  interview_date: string | null

  // Documents
  photo_url: string | null
  document_urls: string[] | null
}

// ─── LABELS ──────────────────────────────────────────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, { fr: string; en: string; color: string }> = {
  received:     { fr: 'Reçue',          en: 'Received',     color: '#6b7280' },
  under_review: { fr: 'En cours d\'examen', en: 'Under Review', color: '#0284c7' },
  accepted:     { fr: 'Acceptée',       en: 'Accepted',     color: '#16a34a' },
  rejected:     { fr: 'Refusée',        en: 'Rejected',     color: '#dc2626' },
  waitlisted:   { fr: 'Liste d\'attente', en: 'Waitlisted', color: '#ca8a04' },
  withdrawn:    { fr: 'Retirée',        en: 'Withdrawn',    color: '#9ca3af' },
}

export const POSITION_LABELS: Record<PlayerPosition, { fr: string; en: string }> = {
  GK:  { fr: 'Gardien',    en: 'Goalkeeper' },
  DEF: { fr: 'Défenseur',  en: 'Defender' },
  MID: { fr: 'Milieu',     en: 'Midfielder' },
  FWD: { fr: 'Attaquant',  en: 'Forward' },
}

export const STRONG_FOOT_LABELS: Record<StrongFoot, { fr: string }> = {
  right: { fr: 'Pied droit' },
  left:  { fr: 'Pied gauche' },
  both:  { fr: 'Les deux' },
}

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, { fr: string; en: string }> = {
  academy:   { fr: 'Académie',  en: 'Academy' },
  boot_camp: { fr: 'Boot Camp', en: 'Boot Camp' },
}
