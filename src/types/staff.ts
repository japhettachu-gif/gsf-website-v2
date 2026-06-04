export type StaffRole =
  | 'head_coach'
  | 'assistant_coach'
  | 'goalkeeper_coach'
  | 'fitness_coach'
  | 'physiotherapist'
  | 'team_manager'
  | 'scout'
  | 'administrator'
  | 'medical_staff'
  | 'other'

export type StaffStatus = 'active' | 'inactive' | 'on_leave'

export interface StaffMember {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  display_name: string | null
  photo_url: string | null
  role: StaffRole
  status: StaffStatus
  bio: string | null
  bio_fr: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  nationality: string | null
  date_of_birth: string | null
  years_experience: number | null
  certifications: string[] | null
  specialties: string[] | null
  linkedin_url: string | null
  instagram_url: string | null
  show_on_website: boolean
  display_order: number | null
}

export interface StaffFormData {
  first_name: string
  last_name: string
  display_name: string
  role: StaffRole
  status: StaffStatus
  bio: string
  bio_fr: string
  email: string
  phone: string
  whatsapp: string
  nationality: string
  date_of_birth: string
  years_experience: string
  certifications: string
  specialties: string
  linkedin_url: string
  instagram_url: string
  show_on_website: boolean
  display_order: string
}

export const STAFF_ROLE_LABELS: Record<StaffRole, { en: string; fr: string }> = {
  head_coach:        { en: 'Head Coach',        fr: 'Entraîneur Principal' },
  assistant_coach:   { en: 'Assistant Coach',   fr: 'Entraîneur Assistant' },
  goalkeeper_coach:  { en: 'Goalkeeper Coach',  fr: 'Entraîneur des Gardiens' },
  fitness_coach:     { en: 'Fitness Coach',     fr: 'Préparateur Physique' },
  physiotherapist:   { en: 'Physiotherapist',   fr: 'Kinésithérapeute' },
  team_manager:      { en: 'Team Manager',      fr: "Manager d'Équipe" },
  scout:             { en: 'Scout',             fr: 'Recruteur' },
  administrator:     { en: 'Administrator',     fr: 'Administrateur' },
  medical_staff:     { en: 'Medical Staff',     fr: 'Staff Médical' },
  other:             { en: 'Other',             fr: 'Autre' },
}

export const STAFF_STATUS_LABELS: Record<StaffStatus, { en: string; fr: string }> = {
  active:   { en: 'Active',   fr: 'Actif' },
  inactive: { en: 'Inactive', fr: 'Inactif' },
  on_leave: { en: 'On Leave', fr: 'En Congé' },
}
