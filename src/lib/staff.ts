import { createClient } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/client'
import type { StaffMember, StaffFormData } from '@/types/staff'

// ─── PUBLIC (client-side) ───────────────────────────────────────────────────

export async function getPublicStaff(): Promise<StaffMember[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('show_on_website', true)
    .eq('status', 'active')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('last_name', { ascending: true })

  if (error) throw error
  return data ?? []
}

// ─── ADMIN (server-side) ────────────────────────────────────────────────────

export async function getAllStaff(): Promise<StaffMember[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('last_name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getStaffById(id: string): Promise<StaffMember | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createStaffMember(formData: StaffFormData): Promise<StaffMember> {
  const supabase = createClient()
  const payload = buildPayload(formData)

  const { data, error } = await supabase
    .from('staff')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStaffMember(id: string, formData: StaffFormData): Promise<StaffMember> {
  const supabase = createClient()
  const payload = buildPayload(formData)

  const { data, error } = await supabase
    .from('staff')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteStaffMember(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('staff').delete().eq('id', id)
  if (error) throw error
}

export async function uploadStaffPhoto(file: File, staffId: string): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `staff/${staffId}/photo.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('gsf-media')
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('gsf-media').getPublicUrl(path)
  return data.publicUrl
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function buildPayload(f: StaffFormData) {
  return {
    first_name:       f.first_name.trim(),
    last_name:        f.last_name.trim(),
    display_name:     f.display_name.trim() || null,
    role:             f.role,
    status:           f.status,
    bio:              f.bio.trim() || null,
    bio_fr:           f.bio_fr.trim() || null,
    email:            f.email.trim() || null,
    phone:            f.phone.trim() || null,
    whatsapp:         f.whatsapp.trim() || null,
    nationality:      f.nationality.trim() || null,
    date_of_birth:    f.date_of_birth || null,
    years_experience: f.years_experience ? parseInt(f.years_experience) : null,
    certifications:   f.certifications ? f.certifications.split(',').map(s => s.trim()).filter(Boolean) : null,
    specialties:      f.specialties ? f.specialties.split(',').map(s => s.trim()).filter(Boolean) : null,
    linkedin_url:     f.linkedin_url.trim() || null,
    instagram_url:    f.instagram_url.trim() || null,
    show_on_website:  f.show_on_website,
    display_order:    f.display_order ? parseInt(f.display_order) : null,
  }
}
