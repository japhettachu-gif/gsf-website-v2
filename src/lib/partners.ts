import { createClient } from '@/lib/supabase/client'
import type { Partner, Alumni } from '@/types/partners'

export async function getPublicPartners(): Promise<Partner[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('partners').select('*')
    .eq('show_on_website', true).eq('active', true)
    .order('tier').order('sort_order', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data ?? []
}

export async function getAllPartners(): Promise<Partner[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('partners').select('*').order('sort_order', { nullsFirst: false }).order('name')
  if (error) throw error
  return data ?? []
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  const supabase = createClient()
  const { data } = await supabase.from('partners').select('*').eq('id', id).single() as unknown as { data: any | null }
  return data
}

export async function createPartner(payload: Partial<Partner>): Promise<Partner> {
  const supabase = createClient()
  const { data, error } = await supabase.from('partners').insert(payload).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function updatePartner(id: string, payload: Partial<Partner>): Promise<Partner> {
  const supabase = createClient()
  const { data, error } = await supabase.from('partners').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function deletePartner(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('partners').delete().eq('id', id)
  if (error) throw error
}

export async function getPublicAlumni(): Promise<Alumni[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('alumni').select('*')
    .eq('show_on_website', true).eq('active', true)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data ?? []
}

export async function getAllAlumni(): Promise<Alumni[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('alumni').select('*').order('name')
  if (error) throw error
  return data ?? []
}

export async function getAlumniById(id: string): Promise<Alumni | null> {
  const supabase = createClient()
  const { data } = await supabase.from('alumni').select('*').eq('id', id).single() as unknown as { data: any | null }
  return data
}

export async function createAlumni(payload: Partial<Alumni>): Promise<Alumni> {
  const supabase = createClient()
  const { data, error } = await supabase.from('alumni').insert(payload).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function updateAlumni(id: string, payload: Partial<Alumni>): Promise<Alumni> {
  const supabase = createClient()
  const { data, error } = await supabase.from('alumni').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function deleteAlumni(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('alumni').delete().eq('id', id)
  if (error) throw error
}