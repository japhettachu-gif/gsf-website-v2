export interface GalleryImage {
  id: string
  created_at: string
  url: string
  thumbnail_url: string | null
  caption_fr: string | null
  caption_en: string | null
  album: string | null
  event_id: string | null
  show_on_website: boolean
  display_order: number | null
  is_featured: boolean
  width: number | null
  height: number | null
  file_size_kb: number | null
}

export interface MediaVideo {
  id: string
  created_at: string
  updated_at: string
  title_fr: string
  title_en: string | null
  description_fr: string | null
  youtube_url: string
  youtube_id: string | null
  thumbnail_url: string | null
  category: string | null
  show_on_website: boolean
  is_featured: boolean
  display_order: number | null
  published_at: string | null
}
