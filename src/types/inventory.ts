export type ItemCategory =
  | 'ball' | 'jersey' | 'shorts' | 'socks' | 'boots' | 'goalkeeper'
  | 'training_cone' | 'bibs' | 'goal' | 'medical' | 'electronics'
  | 'office' | 'trophy' | 'other'

export type ItemCondition = 'new' | 'good' | 'fair' | 'poor' | 'damaged'

export type ItemStatus = 'available' | 'in_use' | 'maintenance' | 'lost' | 'retired'

export interface InventoryItem {
  id: string
  created_at: string
  updated_at: string

  name: string
  name_fr: string
  description: string | null
  category: ItemCategory
  status: ItemStatus
  condition: ItemCondition

  quantity_total: number
  quantity_available: number
  quantity_in_use: number

  unit_price_xaf: number | null
  purchase_date: string | null
  supplier: string | null

  assigned_to: string | null      // programme ou groupe
  location: string | null         // salle de stockage, terrain...
  serial_number: string | null
  photo_url: string | null

  notes: string | null
  reorder_threshold: number | null
  is_consumable: boolean
}

export interface EquipmentRequest {
  id: string
  created_at: string
  updated_at: string

  requested_by: string           // nom du demandeur
  requested_by_user_id: string | null
  item_id: string | null
  item?: InventoryItem

  item_name: string              // au cas où item non lié
  quantity_requested: number
  purpose: string | null
  needed_by: string | null       // date

  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  reviewed_by: string | null
  review_notes: string | null
  reviewed_at: string | null
}

// ─── LABELS ──────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<ItemCategory, { fr: string; emoji: string }> = {
  ball:           { fr: 'Ballons',          emoji: '⚽' },
  jersey:         { fr: 'Maillots',         emoji: '👕' },
  shorts:         { fr: 'Shorts',           emoji: '🩳' },
  socks:          { fr: 'Chaussettes',      emoji: '🧦' },
  boots:          { fr: 'Chaussures',       emoji: '👟' },
  goalkeeper:     { fr: 'Équip. gardien',   emoji: '🧤' },
  training_cone:  { fr: 'Cônes/Plots',      emoji: '🔺' },
  bibs:           { fr: 'Chasubles',        emoji: '🎽' },
  goal:           { fr: 'Buts',             emoji: '🥅' },
  medical:        { fr: 'Médical',          emoji: '🏥' },
  electronics:    { fr: 'Électronique',     emoji: '💻' },
  office:         { fr: 'Bureau/Admin',     emoji: '📁' },
  trophy:         { fr: 'Trophées',         emoji: '🏆' },
  other:          { fr: 'Autre',            emoji: '📦' },
}

export const CONDITION_LABELS: Record<ItemCondition, { fr: string; color: string }> = {
  new:      { fr: 'Neuf',        color: '#16a34a' },
  good:     { fr: 'Bon état',    color: '#0284c7' },
  fair:     { fr: 'Correct',     color: '#ca8a04' },
  poor:     { fr: 'Mauvais',     color: '#ea580c' },
  damaged:  { fr: 'Endommagé',   color: '#dc2626' },
}

export const STATUS_LABELS: Record<ItemStatus, { fr: string; color: string }> = {
  available:    { fr: 'Disponible',    color: '#16a34a' },
  in_use:       { fr: 'En utilisation',color: '#0284c7' },
  maintenance:  { fr: 'Maintenance',   color: '#ca8a04' },
  lost:         { fr: 'Perdu',         color: '#dc2626' },
  retired:      { fr: 'Retraité',      color: '#9ca3af' },
}

export const REQUEST_STATUS_LABELS = {
  pending:   { fr: 'En attente',  color: '#ca8a04' },
  approved:  { fr: 'Approuvé',    color: '#16a34a' },
  rejected:  { fr: 'Refusé',      color: '#dc2626' },
  fulfilled: { fr: 'Traité',      color: '#0284c7' },
}
