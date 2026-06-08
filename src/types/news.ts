export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface NewsArticle {
  id: string
  created_at: string
  updated_at: string
  slug: string
  title_fr: string
  title_en: string | null
  excerpt_fr: string | null
  excerpt_en: string | null
  body_fr: string | null
  body_en: string | null
  cover_url: string | null
  author_id: string | null
  author_name: string | null
  published_at: string | null
  status: ArticleStatus
  tags: string[] | null
  is_featured: boolean
  views_count: number
}

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, { fr: string; color: string }> = {
  draft:     { fr: 'Brouillon',  color: '#9ca3af' },
  published: { fr: 'Publié',     color: '#16a34a' },
  archived:  { fr: 'Archivé',    color: '#6b7280' },
}
