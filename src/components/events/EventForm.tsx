'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X } from 'lucide-react'
import type { Event, EventType, EventStatus, EventAudience } from '@/types/events'
import { EVENT_TYPE_LABELS, EVENT_STATUS_LABELS, EVENT_AUDIENCE_LABELS } from '@/types/events'
import { createEvent, updateEvent, deleteEvent } from '@/lib/events'

interface EventFormProps { event?: Event }

const COLORS = ['#16a34a','#0284c7','#ca8a04','#dc2626','#9333ea','#ea580c','#ec4899','#0891b2']

function slugify(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
}

const EMPTY: Partial<Event> = {
  title: '', title_fr: '', slug: '', excerpt: '', excerpt_fr: '',
  description: '', description_fr: '',
  type: 'bootcamp', status: 'draft', audience: 'all',
  start_date: '', end_date: '', start_time: '', end_time: '',
  timezone: 'Africa/Douala', location: '', location_details: '',
  is_online: false, registration_required: false,
  registration_url: '', registration_deadline: '',
  max_participants: undefined, price_xaf: undefined, is_free: true,
  color: '#16a34a', icon: '',
  show_on_website: true, is_featured: false,
  contact_name: '', contact_phone: '', contact_email: '',
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const isEdit = !!event
  const [form, setForm] = useState<Partial<Event>>(event ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function set<K extends keyof Event>(key: K, value: Event[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      if (isEdit && event) await updateEvent(event.id, form)
      else await createEvent(form)
      router.push('/admin/events'); router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!event) return
    setDeleting(true)
    try { await deleteEvent(event.id); router.push('/admin/events'); router.refresh() }
    catch { setDeleting(false); setConfirmDelete(false) }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const label = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2"><X size={16} className="mt-0.5 shrink-0"/>{error}</div>}

      {/* Identité */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Identité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={label}>Titre (FR) *</label>
            <input required value={form.title_fr ?? ''} onChange={e => { set('title_fr', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }} className={input} /></div>
          <div><label className={label}>Titre (EN) *</label>
            <input required value={form.title ?? ''} onChange={e => set('title', e.target.value)} className={input} /></div>
          <div><label className={label}>Slug URL *</label>
            <input required value={form.slug ?? ''} onChange={e => set('slug', slugify(e.target.value))} className={input} /></div>
          <div><label className={label}>Icône (emoji)</label>
            <input value={form.icon ?? ''} onChange={e => set('icon', e.target.value)} className={input} placeholder="🏕️" /></div>
          <div><label className={label}>Accroche (FR)</label>
            <textarea rows={2} value={form.excerpt_fr ?? ''} onChange={e => set('excerpt_fr', e.target.value)} className={input} /></div>
          <div><label className={label}>Accroche (EN)</label>
            <textarea rows={2} value={form.excerpt ?? ''} onChange={e => set('excerpt', e.target.value)} className={input} /></div>
          <div><label className={label}>Description complète (FR)</label>
            <textarea rows={4} value={form.description_fr ?? ''} onChange={e => set('description_fr', e.target.value)} className={input} /></div>
          <div><label className={label}>Description complète (EN)</label>
            <textarea rows={4} value={form.description ?? ''} onChange={e => set('description', e.target.value)} className={input} /></div>
        </div>
      </div>

      {/* Classification */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Classification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={label}>Type *</label>
            <select value={form.type} onChange={e => set('type', e.target.value as EventType)} className={input}>
              {(Object.entries(EVENT_TYPE_LABELS) as [EventType, {en:string;fr:string;emoji:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.emoji} {v.fr}</option>
              ))}
            </select></div>
          <div><label className={label}>Statut *</label>
            <select value={form.status} onChange={e => set('status', e.target.value as EventStatus)} className={input}>
              {(Object.entries(EVENT_STATUS_LABELS) as [EventStatus, {en:string;fr:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select></div>
          <div><label className={label}>Public cible *</label>
            <select value={form.audience} onChange={e => set('audience', e.target.value as EventAudience)} className={input}>
              {(Object.entries(EVENT_AUDIENCE_LABELS) as [EventAudience, {en:string;fr:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select></div>
        </div>
      </div>

      {/* Dates & Lieu */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Dates & Lieu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className={label}>Date début *</label>
            <input required type="date" value={form.start_date ?? ''} onChange={e => set('start_date', e.target.value)} className={input} /></div>
          <div><label className={label}>Date fin</label>
            <input type="date" value={form.end_date ?? ''} onChange={e => set('end_date', e.target.value)} className={input} /></div>
          <div><label className={label}>Heure début</label>
            <input type="time" value={form.start_time ?? ''} onChange={e => set('start_time', e.target.value)} className={input} /></div>
          <div><label className={label}>Heure fin</label>
            <input type="time" value={form.end_time ?? ''} onChange={e => set('end_time', e.target.value)} className={input} /></div>
          <div className="md:col-span-2"><label className={label}>Lieu</label>
            <input value={form.location ?? ''} onChange={e => set('location', e.target.value)} className={input} placeholder="Terrain Municipal, Douala..." /></div>
          <div className="md:col-span-2"><label className={label}>Détails lieu</label>
            <input value={form.location_details ?? ''} onChange={e => set('location_details', e.target.value)} className={input} placeholder="Accès, parking, indications..." /></div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.is_online ?? false} onChange={e => set('is_online', e.target.checked)} className="accent-green-600" />
            Événement en ligne
          </label>
        </div>
      </div>

      {/* Inscriptions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Inscriptions & Tarifs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className={label}>Places max</label>
            <input type="number" min="1" value={form.max_participants ?? ''} onChange={e => set('max_participants', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} /></div>
          <div><label className={label}>Date limite inscription</label>
            <input type="date" value={form.registration_deadline ?? ''} onChange={e => set('registration_deadline', e.target.value)} className={input} /></div>
          <div><label className={label}>Prix (XAF)</label>
            <input type="number" min="0" value={form.price_xaf ?? ''} onChange={e => set('price_xaf', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} /></div>
          <div className="md:col-span-2"><label className={label}>Lien inscription externe</label>
            <input type="url" value={form.registration_url ?? ''} onChange={e => set('registration_url', e.target.value)} className={input} placeholder="https://..." /></div>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.is_free ?? true} onChange={e => set('is_free', e.target.checked)} className="accent-green-600" />
            Événement gratuit
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.registration_required ?? false} onChange={e => set('registration_required', e.target.checked)} className="accent-green-600" />
            Inscription obligatoire
          </label>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={label}>Nom contact</label>
            <input value={form.contact_name ?? ''} onChange={e => set('contact_name', e.target.value)} className={input} /></div>
          <div><label className={label}>Téléphone</label>
            <input value={form.contact_phone ?? ''} onChange={e => set('contact_phone', e.target.value)} className={input} /></div>
          <div><label className={label}>Email</label>
            <input type="email" value={form.contact_email ?? ''} onChange={e => set('contact_email', e.target.value)} className={input} /></div>
        </div>
      </div>

      {/* Couleur & Visibilité */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Couleur & Affichage</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {COLORS.map(c => <button key={c} type="button" onClick={() => set('color', c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />)}
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.show_on_website ?? true} onChange={e => set('show_on_website', e.target.checked)} className="accent-green-600" />
            Afficher sur le site
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.is_featured ?? false} onChange={e => set('is_featured', e.target.checked)} className="accent-yellow-500" />
            ⭐ À la une
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        {isEdit && (confirmDelete ? (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <span className="text-sm text-red-700">Supprimer cet événement ?</span>
            <button type="button" onClick={handleDelete} disabled={deleting} className="text-sm font-semibold text-red-600">{deleting ? <Loader2 size={14} className="animate-spin"/> : 'Confirmer'}</button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="text-sm text-gray-500">Annuler</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-4 py-2 rounded-lg transition">Supprimer</button>
        ))}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Annuler</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  )
}
