import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Program, TrainingSession } from '@/types/programs'

// ─── PROGRAMS — PUBLIC ───────────────────────────────────────────────────────

export async function getPublicPrograms(): Promise<Program[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('show_on_website', true)
    .in('status', ['active', 'upcoming'])
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .eq('show_on_website', true)
    .single()
  return data
}

// ─── PROGRAMS — ADMIN ────────────────────────────────────────────────────────

export async function getAllPrograms(): Promise<Program[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = createServerClient()
  const { data } = await supabase.from('programs').select('*').eq('id', id).single()
  return data
}

export async function createProgram(payload: Partial<Program>): Promise<Program> {
  const supabase = createClient()
  const { data, error } = await supabase.from('programs').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateProgram(id: string, payload: Partial<Program>): Promise<Program> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('programs').update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProgram(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('programs').delete().eq('id', id)
  if (error) throw error
}

// ─── SESSIONS — PUBLIC ───────────────────────────────────────────────────────

export async function getPublicSchedule(): Promise<TrainingSession[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('training_sessions')
    .select(`*, program:programs(id, name, name_fr, age_group, color, icon)`)
    .eq('status', 'scheduled')
    .eq('is_recurring', true)
    .lte('effective_from', today)
    .or(`effective_until.is.null,effective_until.gte.${today}`)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })
  if (error) throw error
  return data ?? []
}

// ─── SESSIONS — ADMIN ────────────────────────────────────────────────────────

export async function getAllSessions(): Promise<TrainingSession[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('training_sessions')
    .select(`*, program:programs(id, name, name_fr, age_group, color, icon), coach:staff(first_name, last_name, display_name)`)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getSessionById(id: string): Promise<TrainingSession | null> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('training_sessions')
    .select(`*, program:programs(*), coach:staff(first_name, last_name, display_name)`)
    .eq('id', id).single()
  return data
}

export async function createSession(payload: Partial<TrainingSession>): Promise<TrainingSession> {
  const supabase = createClient()
  const { data, error } = await supabase.from('training_sessions').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateSession(id: string, payload: Partial<TrainingSession>): Promise<TrainingSession> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('training_sessions').update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteSession(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('training_sessions').delete().eq('id', id)
  if (error) throw error
}
