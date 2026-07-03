import { createClient } from '@/lib/supabase/client'
import type { GalleryImage, MediaVideo } from '@/types/media'

export async function getPublicGallery(album?: string): Promise<GalleryImage[]> {
  const supabase = createClient()
  let query = supabase.from('gallery_images').select('*').eq('show_on_website', true)
  if (album) query = query.eq('album', album)
  const { data, error } = await query
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getFeaturedImages(limit = 6): Promise<GalleryImage[]> {
  const supabase = createClient()
  const { data } = await supabase.from('gallery_images').select('*')
    .eq('show_on_website', true).eq('is_featured', true)
    .order('display_order', { ascending: true, nullsFirst: false }).limit(limit) as unknown as { data: any[] | null }
  return data ?? []
}

export async function getGalleryAlbums(): Promise<string[]> {
  const supabase = createClient()
  const { data } = await supabase.from('gallery_images').select('album').eq('show_on_website', true).not('album', 'is', null) as unknown as { data: any[] | null }
  const albums = Array.from(new Set((data ?? []).map(d => d.album).filter(Boolean))) as string[]
  return albums
}

export async function getAllImages(): Promise<GalleryImage[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('gallery_images').select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createImage(payload: Partial<GalleryImage>): Promise<GalleryImage> {
  const supabase = createClient()
  const { data, error } = await supabase.from('gallery_images').insert(payload as any).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function updateImage(id: string, payload: Partial<GalleryImage>): Promise<GalleryImage> {
  const supabase = createClient()
  const { data, error } = await supabase.from('gallery_images').update(payload as any).eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function deleteImage(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('gallery_images').delete().eq('id', id)
  if (error) throw error
}

export async function uploadImage(file: File, album?: string): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `gallery/${album ?? 'general'}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('gsf-media').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('gsf-media').getPublicUrl(path)
  return data.publicUrl
}

export function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match?.[1] ?? null
}

export async function getPublicVideos(): Promise<MediaVideo[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('media_videos').select('*')
    .eq('show_on_website', true)
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAllVideos(): Promise<MediaVideo[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('media_videos').select('*').order('published_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createVideo(payload: Partial<MediaVideo>): Promise<MediaVideo> {
  const supabase = createClient()
  const youtubeId = payload.youtube_url ? extractYoutubeId(payload.youtube_url) : null
  const { data, error } = await supabase.from('media_videos').insert({
    ...payload,
    youtube_id: youtubeId,
    thumbnail_url: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null,
  } as any).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function updateVideo(id: string, payload: Partial<MediaVideo>): Promise<MediaVideo> {
  const supabase = createClient()
  const youtubeId = payload.youtube_url ? extractYoutubeId(payload.youtube_url) : undefined
  const { data, error } = await supabase.from('media_videos').update({
    ...payload,
    ...(youtubeId ? { youtube_id: youtubeId, thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` } : {}),
    updated_at: new Date().toISOString(),
  } as any).eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function deleteVideo(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('media_videos').delete().eq('id', id)
  if (error) throw error
}
