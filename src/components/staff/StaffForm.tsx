'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Upload, X } from 'lucide-react'
import type { StaffMember, StaffFormData } from '@/types/staff'
import { STAFF_ROLE_LABELS, STAFF_STATUS_LABELS } from '@/types/staff'
import { createStaffMember, updateStaffMember, uploadStaffPhoto } from '@/lib/staff'

interface StaffFormProps {
  member?: StaffMember
  locale?: string
}

const EMPTY_FORM: StaffFormData = {
  first_name: '',
  last_name: '',
  display_name: '',
  role: 'other',
  status: 'active',
  bio: '',
  bio_fr: '',
  email: '',
  phone: '',
  whatsapp: '',
  nationality: '',
  date_of_birth: '',
  years_experience: '',
  certifications: '',
  specialties: '',
  linkedin_url: '',
  instagram_url: '',
  show_on_website: true,
  display_order: '',
}

export function StaffForm({ member, locale = 'fr' }: StaffFormProps) {
  const router = useRouter()
  const isEdit = !!member

  const [form, setForm] = useState<StaffFormData>(() => {
    if (!member) return EMPTY_FORM
    return {
      first_name:      member.first_name,
      last_name:       member.last_name,
      display_name:    member.display_name ?? '',
      role:            member.role,
      status:          member.status,
      bio:             member.bio ?? '',
      bio_fr:          member.bio_fr ?? '',
      email:           member.email ?? '',
      phone:           member.phone ?? '',
      whatsapp:        member.whatsapp ?? '',
      nationality:     member.nationality ?? '',
      date_of_birth:   member.date_of_birth ?? '',
      years_experience: member.years_experience?.toString() ?? '',
      certifications:  member.certifications?.join(', ') ?? '',
      specialties:     member.specialties?.join(', ') ?? '',
      linkedin_url:    member.linkedin_url ?? '',
      instagram_url:   member.instagram_url ?? '',
      show_on_website: member.show_on_website,
      display_order:   member.display_order?.toString() ?? '',
    }
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(member?.photo_url ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof StaffFormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      let savedMember: StaffMember

      if (isEdit && member) {
        savedMember = await updateStaffMember(member.id, form)
      } else {
        savedMember = await createStaffMember(form)
      }

      if (photoFile) {
        const url = await uploadStaffPhoto(photoFile, savedMember.id)
        await updateStaffMember(savedMember.id, { ...form, show_on_website: form.show_on_website })
        // Update photo url separately
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        await (supabase.from('staff') as any).update({ photo_url: url }).eq('id', savedMember.id)
      }

      router.push('/admin/staff')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-start gap-2">
          <X size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Photo */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Photo</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Upload size={28} />
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition">
              <Upload size={14} />
              {locale === 'fr' ? 'Choisir une photo' : 'Choose photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 5 MB</p>
          </div>
        </div>
      </div>

      {/* Identity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          {locale === 'fr' ? 'Identité' : 'Identity'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Prénom *</label>
            <input required value={form.first_name} onChange={e => set('first_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nom *</label>
            <input required value={form.last_name} onChange={e => set('last_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{locale === 'fr' ? 'Nom affiché' : 'Display name'}</label>
            <input value={form.display_name} onChange={e => set('display_name', e.target.value)} className={inputClass} placeholder="Ex: Coach Hervé" />
          </div>
          <div>
            <label className={labelClass}>{locale === 'fr' ? 'Nationalité' : 'Nationality'}</label>
            <input value={form.nationality} onChange={e => set('nationality', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{locale === 'fr' ? 'Date de naissance' : 'Date of birth'}</label>
            <input type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Role & Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          {locale === 'fr' ? 'Rôle & Statut' : 'Role & Status'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Rôle *</label>
            <select required value={form.role} onChange={e => set('role', e.target.value)} className={inputClass}>
              {(Object.keys(STAFF_ROLE_LABELS) as Array<keyof typeof STAFF_ROLE_LABELS>).map(role => (
                <option key={role} value={role}>
                  {STAFF_ROLE_LABELS[role][locale as 'en' | 'fr']}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Statut *</label>
            <select required value={form.status} onChange={e => set('status', e.target.value)} className={inputClass}>
              {(Object.keys(STAFF_STATUS_LABELS) as Array<keyof typeof STAFF_STATUS_LABELS>).map(s => (
                <option key={s} value={s}>
                  {STAFF_STATUS_LABELS[s][locale as 'en' | 'fr']}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{locale === 'fr' ? 'Expérience (ans)' : 'Experience (years)'}</label>
            <input type="number" min="0" max="50" value={form.years_experience} onChange={e => set('years_experience', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Bio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bio (EN)</label>
            <textarea rows={4} value={form.bio} onChange={e => set('bio', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bio (FR)</label>
            <textarea rows={4} value={form.bio_fr} onChange={e => set('bio_fr', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Professional */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          {locale === 'fr' ? 'Profil Professionnel' : 'Professional Profile'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{locale === 'fr' ? 'Certifications (séparées par virgule)' : 'Certifications (comma separated)'}</label>
            <input value={form.certifications} onChange={e => set('certifications', e.target.value)} className={inputClass} placeholder="UEFA B, CAF B, ..." />
          </div>
          <div>
            <label className={labelClass}>{locale === 'fr' ? 'Spécialités (séparées par virgule)' : 'Specialties (comma separated)'}</label>
            <input value={form.specialties} onChange={e => set('specialties', e.target.value)} className={inputClass} placeholder="Technique, Tactique, ..." />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Téléphone</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} placeholder="+237 6XX XXX XXX" />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input type="url" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input type="url" value={form.instagram_url} onChange={e => set('instagram_url', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          {locale === 'fr' ? 'Visibilité site web' : 'Website Visibility'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.show_on_website}
                onChange={e => set('show_on_website', e.target.checked)}
              />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
            </div>
            <span className="text-sm text-gray-700">
              {locale === 'fr' ? 'Afficher sur le site public' : 'Show on public website'}
            </span>
          </label>
          <div>
            <label className={labelClass}>{locale === 'fr' ? 'Ordre d\'affichage' : 'Display order'}</label>
            <input type="number" min="1" value={form.display_order} onChange={e => set('display_order', e.target.value)} className={inputClass} placeholder="1, 2, 3..." />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          {locale === 'fr' ? 'Annuler' : 'Cancel'}
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving
            ? (locale === 'fr' ? 'Enregistrement...' : 'Saving...')
            : (locale === 'fr' ? 'Enregistrer' : 'Save')}
        </button>
      </div>
    </form>
  )
}
