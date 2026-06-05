'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X, Plus, Trash2 } from 'lucide-react'
import type { Program, AgeGroup, ProgramLevel, ProgramStatus } from '@/types/programs'
import { AGE_GROUP_LABELS, PROGRAM_LEVEL_LABELS, PROGRAM_STATUS_LABELS } from '@/types/programs'
import { createProgram, updateProgram } from '@/lib/programs'

interface ProgramFormProps { program?: Program }

const COLORS = ['#16a34a','#0284c7','#ca8a04','#dc2626','#9333ea','#ea580c','#ec4899','#0891b2']

const EMPTY: Partial<Program> = {
  name: '', name_fr: '', slug: '', description: '', description_fr: '',
  age_group: 'all', level: 'development', status: 'active',
  max_players: undefined, sessions_per_week: undefined,
  session_duration_minutes: 90, price_xaf: undefined,
  icon: '⚽', color: '#16a34a', show_on_website: true,
  display_order: undefined, objectives: [], objectives_fr: [],
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter()
  const isEdit = !!program
  const [form, setForm] = useState<Partial<Program>>(program ?? EMPTY)
  const [objEN, setObjEN] = useState((program?.objectives ?? []).join('\n'))
  const [objFR, setObjFR] = useState((program?.objectives_fr ?? []).join('\n'))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof Program>(key: K, value: Program[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function slugify(text: string) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        objectives: objEN.split('\n').map(s => s.trim()).filter(Boolean),
        objectives_fr: objFR.split('\n').map(s => s.trim()).filter(Boolean),
      }
      if (isEdit && program) {
        await updateProgram(program.id, payload)
      } else {
        await createProgram(payload)
      }
      router.push('/admin/programs')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally { setSaving(false) }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const label = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2">
          <X size={16} className="mt-0.5 shrink-0" />{error}
        </div>
      )}

      {/* Identité */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Identité du programme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Nom (EN) *</label>
            <input required value={form.name ?? ''} onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }} className={input} />
          </div>
          <div>
            <label className={label}>Nom (FR) *</label>
            <input required value={form.name_fr ?? ''} onChange={e => set('name_fr', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Slug URL *</label>
            <input required value={form.slug ?? ''} onChange={e => set('slug', slugify(e.target.value))} className={input} placeholder="u12-development" />
          </div>
          <div>
            <label className={label}>Icône (emoji)</label>
            <input value={form.icon ?? ''} onChange={e => set('icon', e.target.value)} className={input} placeholder="⚽" />
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Classification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={label}>Groupe d'âge *</label>
            <select value={form.age_group} onChange={e => set('age_group', e.target.value as AgeGroup)} className={input}>
              {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Niveau *</label>
            <select value={form.level} onChange={e => set('level', e.target.value as ProgramLevel)} className={input}>
              {(Object.entries(PROGRAM_LEVEL_LABELS) as [ProgramLevel, {en:string;fr:string}][]).map(([k, v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Statut *</label>
            <select value={form.status} onChange={e => set('status', e.target.value as ProgramStatus)} className={input}>
              {(Object.entries(PROGRAM_STATUS_LABELS) as [ProgramStatus, {en:string;fr:string}][]).map(([k, v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Description</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Description (EN)</label>
            <textarea rows={3} value={form.description ?? ''} onChange={e => set('description', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Description (FR)</label>
            <textarea rows={3} value={form.description_fr ?? ''} onChange={e => set('description_fr', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Objectifs (EN) — un par ligne</label>
            <textarea rows={4} value={objEN} onChange={e => setObjEN(e.target.value)} className={input} placeholder={"Ball mastery\nPassing & receiving"} />
          </div>
          <div>
            <label className={label}>Objectifs (FR) — un par ligne</label>
            <textarea rows={4} value={objFR} onChange={e => setObjFR(e.target.value)} className={input} placeholder={"Maîtrise du ballon\nPasse et contrôle"} />
          </div>
        </div>
      </div>

      {/* Détails opérationnels */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Détails opérationnels</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={label}>Places max</label>
            <input type="number" min="1" value={form.max_players ?? ''} onChange={e => set('max_players', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} />
          </div>
          <div>
            <label className={label}>Séances/semaine</label>
            <input type="number" min="1" max="7" value={form.sessions_per_week ?? ''} onChange={e => set('sessions_per_week', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} />
          </div>
          <div>
            <label className={label}>Durée séance (min)</label>
            <input type="number" min="30" value={form.session_duration_minutes ?? ''} onChange={e => set('session_duration_minutes', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} />
          </div>
          <div>
            <label className={label}>Prix (XAF)</label>
            <input type="number" min="0" value={form.price_xaf ?? ''} onChange={e => set('price_xaf', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} />
          </div>
        </div>
      </div>

      {/* Couleur & Visibilité */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Couleur & Affichage</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => set('color', c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.show_on_website ?? true} onChange={e => set('show_on_website', e.target.checked)} className="accent-green-600" />
            Afficher sur le site public
          </label>
          <div className="w-32">
            <label className={label}>Ordre</label>
            <input type="number" min="1" value={form.display_order ?? ''} onChange={e => set('display_order', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          Annuler
        </button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
