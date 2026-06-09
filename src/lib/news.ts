import { createClient } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/client'
import type { NewsArticle, ArticleStatus } from '@/types/news'

export async function getPublishedArticles(limit?: number): Promise<NewsArticle[]> {
  const supabase = createClient()
  let query = supabase.from('news_articles').select('*').eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = createClient()
  const { data } = await supabase.from('news_articles').select('*')
    .eq('slug', slug).eq('status', 'published').single()
  return data
}

export async function getAllArticles(): Promise<NewsArticle[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('news_articles').select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getArticleById(id: string): Promise<NewsArticle | null> {
  const supabase = createClient()
  const { data } = await supabase.from('news_articles').select('*').eq('id', id).single()
  return data
}

export async function createArticle(payload: Partial<NewsArticle>): Promise<NewsArticle> {
  const supabase = createClient()
  const { data, error } = await supabase.from('news_articles').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateArticle(id: string, payload: Partial<NewsArticle>): Promise<NewsArticle> {
  const supabase = createClient()
  const { data, error } = await supabase.from('news_articles')
    .update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('news_articles').delete().eq('id', id)
  if (error) throw error
}

export async function publishArticle(id: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('news_articles').update({
    status: 'published', published_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }).eq('id', id)
}

function slugify(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
}
export { slugify }
