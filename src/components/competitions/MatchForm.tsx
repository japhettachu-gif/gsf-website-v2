'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X } from 'lucide-react'
import type { Match, MatchStatus } from '@/types/competitions'
import { MATCH_STATUS_LABELS } from '@/types/competitions'
import { createMatch, updateMatch } from '@/lib/competitions'

interface MatchFormProps {
  match?: Match
  competitions: { id: string; name_fr: string }[]
}

const EMPTY: Partial<Match> = {
  competition_id: undefined,
  home_team: 'GSF Academy',
  away_team: '',
  is_home_game: true,
  match_date: new Date().toISOString().split('T')[0],
  match_time: '15:00',
  location: '',
  status: 'scheduled',
  home_score: undefined,
  away_score: undefined,
  round: '',
  notes_fr: '',
  gsf_scorers: [],
  gsf_assists: [],
  man_of_match: '',
}

export function MatchForm({ match, competitions }: MatchFormProps) {
  const router = useRouter()
  const isEdit = !!match
  const [form, setForm] = useState<Partial<Match>>(match ?? EMPTY)
  const [scorers, setScorers] = useState((match?.gsf_scorers ?? []).join(', '))
  const [assists, setAssists] = useState((match?.gsf_assists ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof Match>(key: K, value: Match[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function computeResult(hs: number | null | undefined, as_: number | null | undefined, home: boolean) {
    if (hs === null || hs === undefined || as_ === null || as_ === undefined) return null
    const gsf = home ? hs : as_
    const opp = home ? as_ : hs
    if (gsf > opp) return 'win' as const
    if (gsf < opp) return 'loss' as const
    return 'draw' as const
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const result = form.status === 'completed'
        ? computeResult(form.home_score, form.away_score, form.is_home_game ?? true)
        : null
      const payload = {
        ...form,
        result,
        gsf_scorers: scorers.split(',').map(s => s.trim()).filter(Boolean),
        gsf_assists: assists.split(',').map(s => s.trim()).filter(Boolean),
        home_score: form.home_score !== undefined ? Number(form.home_score) : null,
        away_score: form.away_score !== undefined ? Number(form.away_score) : null,
      }
      if (isEdit && match) {
        await updateMatch(match.id, payload)
      } else {
        await createMatch(payload)
      }
      router.push('/admin/matches')
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

      {/* Match info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Équipes & Compétition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Équipe domicile *</label>
            <input required value={form.home_team ?? ''} onChange={e => set('home_team', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Équipe extérieur *</label>
            <input required value={form.away_team ?? ''} onChange={e => set('away_team', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Compétition</label>
            <select value={form.competition_id ?? ''} onChange={e => set('competition_id', e.target.value || null as unknown as string)} className={input}>
              <option value="">— Match hors compétition —</option>
              {competitions.map(c => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>GSF joue à</label>
            <select value={form.is_home_game ? 'home' : 'away'} onChange={e => set('is_home_game', e.target.value === 'home')} className={input}>
              <option value="home">Domicile</option>
              <option value="away">Extérieur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Planning */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Date & Lieu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={label}>Date *</label>
            <input required type="date" value={form.match_date ?? ''} onChange={e => set('match_date', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Heure</label>
            <input type="time" value={form.match_time ?? ''} onChange={e => set('match_time', e.target.value)} className={input} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>Lieu</label>
            <input value={form.location ?? ''} onChange={e => set('location', e.target.value)} className={input} placeholder="Terrain Municipal, Douala..." />
          </div>
          <div>
            <label className={label}>Journée / Tour</label>
            <input value={form.round ?? ''} onChange={e => set('round', e.target.value)} className={input} placeholder="J5, Quart de finale..." />
          </div>
          <div>
            <label className={label}>Statut *</label>
            <select value={form.status} onChange={e => set('status', e.target.value as MatchStatus)} className={input}>
              {(Object.entries(MATCH_STATUS_LABELS) as [MatchStatus, {en:string;fr:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Score (si terminé)</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className={label}>{form.home_team || 'Domicile'}</label>
            <input type="number" min="0" max="99" value={form.home_score ?? ''} onChange={e => set('home_score', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={`${input} text-center text-2xl font-bold`} />
          </div>
          <div className="text-gray-400 font-bold text-2xl mt-5">—</div>
          <div className="flex-1">
            <label className={label}>{form.away_team || 'Extérieur'}</label>
            <input type="number" min="0" max="99" value={form.away_score ?? ''} onChange={e => set('away_score', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={`${input} text-center text-2xl font-bold`} />
          </div>
        </div>
      </div>

      {/* Stats GSF */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Stats GSF</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={label}>Buteurs GSF (séparés par virgule)</label>
            <input value={scorers} onChange={e => setScorers(e.target.value)} className={input} placeholder="Kouam, Mbarga, ..." />
          </div>
          <div>
            <label className={label}>Passeurs décisifs (séparés par virgule)</label>
            <input value={assists} onChange={e => setAssists(e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Homme du match</label>
            <input value={form.man_of_match ?? ''} onChange={e => set('man_of_match', e.target.value)} className={input} />
          </div>
        </div>
      </div>

      {/* Rapport */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Rapport de match (FR)</h2>
        <textarea rows={4} value={form.match_report_fr ?? ''} onChange={e => set('match_report_fr', e.target.value)} className={input} placeholder="Résumé du match..." />
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
