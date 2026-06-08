export type PartnerTier = 'title' | 'official' | 'supporter'

export interface Partner {
  id: string
  created_at: string
  updated_at: string
  name: string
  tier: PartnerTier
  logo_url: string | null
  website: string | null
  description_fr: string | null
  description_en: string | null
  contact_name: string | null
  contact_email: string | null
  partnership_start: string | null
  partnership_end: string | null
  active: boolean
  show_on_website: boolean
  sort_order: number | null
}

export interface Alumni {
  id: string
  created_at: string
  updated_at: string
  player_id: string | null
  name: string
  photo_url: string | null
  position: string | null
  years_at_gsf: string | null
  current_club: string | null
  current_country: string | null
  story_fr: string | null
  story_en: string | null
  achievements: string[] | null
  instagram_url: string | null
  active: boolean
  show_on_website: boolean
  is_featured: boolean
  sort_order: number | null
}

export const TIER_CONFIG: Record<PartnerTier, { fr: string; color: string; bg: string }> = {
  title:     { fr: 'Titre',    color: '#b45309', bg: '#fffbeb' },
  official:  { fr: 'Officiel', color: '#0284c7', bg: '#eff6ff' },
  supporter: { fr: 'Soutien',  color: '#16a34a', bg: '#f0fdf4' },
}
