'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X } from 'lucide-react'
import type { Competition, CompetitionType, CompetitionStatus } from '@/types/competitions'
import { COMPETITION_TYPE_LABELS, COMPETITION_STATUS_LABELS } from '@/types/competitions'
import { createCompetition, updateCompetition, deleteCompetition } from '@/lib/competitions'

interface CompetitionFormProps { competition?: Competition }

const COLORS = ['#16a34a','#0284c7','#ca8a04','#dc2626','#9333ea','#ea580c','#ec4899','#0891b2']

const EMPTY: Partial<Competition> = {
  name: '', name_fr: '', slug: '', description: '', description_fr: '',
  type: 'tournament', status: 'upcoming', color: '#16a34a',
  show_on_website: true, is_featured: false,
}

function slugify(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
}

export function CompetitionForm({ competition }: CompetitionFormProps) {
  const router = useRouter()
  const isEdit = !!competition
  const [form, setForm] = useState<Partial<Competition>>(competition ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function set<K extends keyof Competition>(key: K, value: Competition[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      if (isEdit && competition) await updateCompetition(competition.id, form)
      else await createCompetition(form)
      router.push('/admin/competitions'); router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!competition) return
    setDeleting(true)
    try {
      await deleteCompetition(competition.id)
      router.push('/admin/competitions'); router.refresh()
    } catch { setDeleting(false); setConfirmDelete(false) }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const label = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2"><X size={16} className="mt-0.5 shrink-0"/>{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Identité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={label}>Nom (EN) *</label>
            <input required value={form.name ?? ''} onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }} className={input} /></div>
          <div><label className={label}>Nom (FR) *</label>
            <input required value={form.name_fr ?? ''} onChange={e => set('name_fr', e.target.value)} className={input} /></div>
          <div><label className={label}>Slug URL *</label>
            <input required value={form.slug ?? ''} onChange={e => set('slug', slugify(e.target.value))} className={input} /></div>
          <div><label className={label}>Saison</label>
            <input value={form.season ?? ''} onChange={e => set('season', e.target.value)} className={input} placeholder="2025-2026" /></div>
          <div><label className={label}>Description (FR)</label>
            <textarea rows={3} value={form.description_fr ?? ''} onChange={e => set('description_fr', e.target.value)} className={input} /></div>
          <div><label className={label}>Description (EN)</label>
            <textarea rows={3} value={form.description ?? ''} onChange={e => set('description', e.target.value)} className={input} /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Classification</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className={label}>Type *</label>
            <select value={form.type} onChange={e => set('type', e.target.value as CompetitionType)} className={input}>
              {(Object.entries(COMPETITION_TYPE_LABELS) as [CompetitionType,{en:string;fr:string}][]).map(([k,v]) => <option key={k} value={k}>{v.fr}</option>)}
            </select></div>
          <div><label className={label}>Statut *</label>
            <select value={form.status} onChange={e => set('status', e.target.value as CompetitionStatus)} className={input}>
              {(Object.entries(COMPETITION_STATUS_LABELS) as [CompetitionStatus,{en:string;fr:string}][]).map(([k,v]) => <option key={k} value={k}>{v.fr}</option>)}
            </select></div>
          <div><label className={label}>Catégorie d'âge</label>
            <input value={form.age_group ?? ''} onChange={e => set('age_group', e.target.value)} className={input} placeholder="U16, Elite..." /></div>
          <div><label className={label}>Organisateur</label>
            <input value={form.organizer ?? ''} onChange={e => set('organizer', e.target.value)} className={input} /></div>
          <div><label className={label}>Date début</label>
            <input type="date" value={form.start_date ?? ''} onChange={e => set('start_date', e.target.value)} className={input} /></div>
          <div><label className={label}>Date fin</label>
            <input type="date" value={form.end_date ?? ''} onChange={e => set('end_date', e.target.value)} className={input} /></div>
          <div className="md:col-span-2"><label className={label}>Lieu</label>
            <input value={form.location ?? ''} onChange={e => set('location', e.target.value)} className={input} /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Couleur & Visibilité</h2>
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

      <div className="flex items-center justify-between pt-2">
        {isEdit && (
          confirmDelete ? (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              <span className="text-sm text-red-700">Supprimer ?</span>
              <button type="button" onClick={handleDelete} disabled={deleting} className="text-sm font-semibold text-red-600 hover:text-red-800">{deleting ? <Loader2 size={14} className="animate-spin" /> : 'Confirmer'}</button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="text-sm text-gray-500">Annuler</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-4 py-2 rounded-lg transition">Supprimer</button>
          )
        )}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Annuler</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  )
}
