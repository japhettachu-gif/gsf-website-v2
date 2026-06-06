export type EventType =
  | 'bootcamp'
  | 'stage'
  | 'tournament'
  | 'open_day'
  | 'gala'
  | 'workshop'
  | 'ceremony'
  | 'other'

export type EventStatus =
  | 'draft'
  | 'published'
  | 'registration_open'
  | 'registration_closed'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export type EventAudience =
  | 'players'
  | 'parents'
  | 'coaches'
  | 'public'
  | 'all'

export interface Event {
  id: string
  created_at: string
  updated_at: string

  // Content
  title: string
  title_fr: string
  slug: string
  excerpt: string | null
  excerpt_fr: string | null
  description: string | null
  description_fr: string | null

  // Classification
  type: EventType
  status: EventStatus
  audience: EventAudience

  // Schedule
  start_date: string
  end_date: string | null
  start_time: string | null
  end_time: string | null
  timezone: string

  // Location
  location: string | null
  location_details: string | null
  is_online: boolean

  // Registration
  registration_required: boolean
  registration_url: string | null
  registration_deadline: string | null
  max_participants: number | null
  current_participants: number
  price_xaf: number | null
  is_free: boolean

  // Media
  cover_url: string | null
  gallery_urls: string[] | null

  // Display
  color: string | null
  icon: string | null
  show_on_website: boolean
  is_featured: boolean
  display_order: number | null

  // Contact
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
}

export const EVENT_TYPE_LABELS: Record<EventType, { en: string; fr: string; emoji: string }> = {
  bootcamp:    { en: 'Boot Camp',      fr: 'Boot Camp',         emoji: '🏕️' },
  stage:       { en: 'Training Stage', fr: 'Stage d\'entraînement', emoji: '⚽' },
  tournament:  { en: 'Tournament',     fr: 'Tournoi',           emoji: '🏆' },
  open_day:    { en: 'Open Day',       fr: 'Journée Portes Ouvertes', emoji: '🎪' },
  gala:        { en: 'Gala',          fr: 'Gala',              emoji: '🎭' },
  workshop:    { en: 'Workshop',       fr: 'Atelier',           emoji: '🎓' },
  ceremony:    { en: 'Ceremony',       fr: 'Cérémonie',         emoji: '🎖️' },
  other:       { en: 'Other',          fr: 'Autre',             emoji: '📅' },
}

export const EVENT_STATUS_LABELS: Record<EventStatus, { en: string; fr: string }> = {
  draft:                { en: 'Draft',                fr: 'Brouillon' },
  published:            { en: 'Published',            fr: 'Publié' },
  registration_open:    { en: 'Registration Open',    fr: 'Inscriptions ouvertes' },
  registration_closed:  { en: 'Registration Closed',  fr: 'Inscriptions fermées' },
  ongoing:              { en: 'Ongoing',              fr: 'En cours' },
  completed:            { en: 'Completed',            fr: 'Terminé' },
  cancelled:            { en: 'Cancelled',            fr: 'Annulé' },
}

export const EVENT_AUDIENCE_LABELS: Record<EventAudience, { en: string; fr: string }> = {
  players:  { en: 'Players',       fr: 'Joueurs' },
  parents:  { en: 'Parents',       fr: 'Parents' },
  coaches:  { en: 'Coaches',       fr: 'Encadreurs' },
  public:   { en: 'General Public',fr: 'Grand public' },
  all:      { en: 'Everyone',      fr: 'Tous' },
}

export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  draft:               '#9ca3af',
  published:           '#0284c7',
  registration_open:   '#16a34a',
  registration_closed: '#ca8a04',
  ongoing:             '#dc2626',
  completed:           '#6b7280',
  cancelled:           '#ef4444',
}
