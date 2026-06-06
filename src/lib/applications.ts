import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Application, ApplicationStatus } from '@/types/applications'

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

export async function submitApplication(payload: Partial<Application>): Promise<Application> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .insert({ ...payload, status: 'received' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

export async function getAllApplications(type?: Application['type']): Promise<Application[]> {
  const supabase = createServerClient()
  let query = supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })
  if (type) query = query.eq('type', type)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const supabase = createServerClient()
  const { data } = await supabase.from('applications').select('*').eq('id', id).single()
  return data
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  reviewedBy: string,
  notes?: string
): Promise<Application> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .update({
      status,
      reviewed_by: reviewedBy,
      review_notes: notes ?? null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getApplicationStats() {
  const supabase = createServerClient()
  const { data } = await supabase.from('applications').select('type, status')
  const apps = data ?? []
  return {
    total:       apps.length,
    academy:     apps.filter(a => a.type === 'academy').length,
    bootcamp:    apps.filter(a => a.type === 'boot_camp').length,
    received:    apps.filter(a => a.status === 'received').length,
    under_review:apps.filter(a => a.status === 'under_review').length,
    accepted:    apps.filter(a => a.status === 'accepted').length,
    rejected:    apps.filter(a => a.status === 'rejected').length,
    waitlisted:  apps.filter(a => a.status === 'waitlisted').length,
  }
}
