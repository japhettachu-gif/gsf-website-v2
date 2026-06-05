'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X } from 'lucide-react'
import type { TrainingSession, SessionType, SessionStatus, DayOfWeek } from '@/types/programs'
import { SESSION_TYPE_LABELS, SESSION_STATUS_LABELS, DAY_LABELS } from '@/types/programs'
import { createSession, updateSession } from '@/lib/programs'

interface SessionFormProps {
  session?: TrainingSession
  programs: { id: string; name_fr: string; age_group: string }[]
  coaches: { id: string; first_name: string; last_name: string; display_name: string | null }[]
}

const EMPTY: Partial<TrainingSession> = {
  program_id: undefined,
  day_of_week: 1,
  start_time: '16:00',
  end_time: '17:30',
  effective_from: new Date().toISOString().split('T')[0],
  effective_until: undefined,
  title: '',
  title_fr: '',
  type: 'training',
  status: 'scheduled',
  location: '',
  notes: '',
  notes_fr: '',
  coach_id: undefined,
  is_recurring: true,
}

export function SessionForm({ session, programs, coaches }: SessionFormProps) {
  const router = useRouter()
  const isEdit = !!session
  const [form, setForm] = useState<Partial<TrainingSession>>(session ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof TrainingSession>(key: K, value: TrainingSession[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (isEdit && session) {
        await updateSession(session.id, form)
      } else {
        await createSession(form)
      }
      router.push('/admin/sessions')
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

      {/* Planification */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Planification</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={label}>Jour *</label>
            <select required value={form.day_of_week} onChange={e => set('day_of_week', parseInt(e.target.value) as DayOfWeek)} className={input}>
              {([1,2,3,4,5,6,0] as DayOfWeek[]).map(d => (
                <option key={d} value={d}>{DAY_LABELS[d].fr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Heure début *</label>
            <input required type="time" value={form.start_time ?? '16:00'} onChange={e => set('start_time', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Heure fin *</label>
            <input required type="time" value={form.end_time ?? '17:30'} onChange={e => set('end_time', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Lieu</label>
            <input value={form.location ?? ''} onChange={e => set('location', e.target.value)} className={input} placeholder="Terrain A, Salle..." />
          </div>
          <div>
            <label className={label}>Date début *</label>
            <input required type="date" value={form.effective_from ?? ''} onChange={e => set('effective_from', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Date fin (optionnel)</label>
            <input type="date" value={form.effective_until ?? ''} onChange={e => set('effective_until', e.target.value || undefined as unknown as string)} className={input} />
          </div>
          <div>
            <label className={label}>Type *</label>
            <select value={form.type} onChange={e => set('type', e.target.value as SessionType)} className={input}>
              {(Object.entries(SESSION_TYPE_LABELS) as [SessionType, {en:string;fr:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Statut *</label>
            <select value={form.status} onChange={e => set('status', e.target.value as SessionStatus)} className={input}>
              {(Object.entries(SESSION_STATUS_LABELS) as [SessionStatus, {en:string;fr:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Affectations */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Affectations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Programme associé</label>
            <select value={form.program_id ?? ''} onChange={e => set('program_id', e.target.value || null as unknown as string)} className={input}>
              <option value="">— Aucun programme —</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name_fr} ({p.age_group})</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Coach responsable</label>
            <select value={form.coach_id ?? ''} onChange={e => set('coach_id', e.target.value || null as unknown as string)} className={input}>
              <option value="">— Aucun coach assigné —</option>
              {coaches.map(c => (
                <option key={c.id} value={c.id}>
                  {c.display_name || `${c.first_name} ${c.last_name}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Titre & Notes */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Titre & Notes (optionnel)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Titre (EN)</label>
            <input value={form.title ?? ''} onChange={e => set('title', e.target.value)} className={input} placeholder="Advanced finishing drill" />
          </div>
          <div>
            <label className={label}>Titre (FR)</label>
            <input value={form.title_fr ?? ''} onChange={e => set('title_fr', e.target.value)} className={input} placeholder="Exercice de finition avancé" />
          </div>
          <div>
            <label className={label}>Notes (EN)</label>
            <textarea rows={3} value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Notes (FR)</label>
            <textarea rows={3} value={form.notes_fr ?? ''} onChange={e => set('notes_fr', e.target.value)} className={input} />
          </div>
        </div>
      </div>

      {/* Récurrence */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_recurring ?? true} onChange={e => set('is_recurring', e.target.checked)} className="accent-green-600 w-4 h-4" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Séance récurrente</p>
            <p className="text-xs text-gray-500">La séance se répète chaque semaine au même horaire</p>
          </div>
        </label>
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
