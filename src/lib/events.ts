import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/types/events'

export async function getPublicEvents(): Promise<Event[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('show_on_website', true)
    .not('status', 'in', '("draft","cancelled")')
    .order('is_featured', { ascending: false })
    .order('start_date', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('show_on_website', true)
    .in('status', ['published', 'registration_open', 'registration_closed'])
    .gte('start_date', today)
    .order('start_date', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('show_on_website', true)
    .eq('is_featured', true)
    .not('status', 'in', '("draft","cancelled")')
    .order('start_date', { ascending: true })
    .limit(3)
  if (error) throw error
  return data ?? []
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('events').select('*').eq('slug', slug).eq('show_on_website', true).single() as unknown as { data: any | null }
  return data
}

export async function getAllEvents(): Promise<Event[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events').select('*').order('start_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createClient()
  const { data } = await supabase.from('events').select('*').eq('id', id).single() as unknown as { data: any | null }
  return data
}

export async function createEvent(payload: Partial<Event>): Promise<Event> {
  const supabase = createClient()
  const { data, error } = await supabase.from('events').insert(payload).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function updateEvent(id: string, payload: Partial<Event>): Promise<Event> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events').update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}