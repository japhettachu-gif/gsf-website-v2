'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Send } from 'lucide-react'
import type { EvaluationCriteria, EvaluationRating, EvaluationType } from '@/types/evaluations'
import { PILLAR_LABELS, EVALUATION_TYPE_LABELS, RATING_CONFIG } from '@/types/evaluations'
import { createEvaluation, updateEvaluation, saveEvaluationScores, publishEvaluation } from '@/lib/evaluations'
import { RatingSelector } from './RatingSelector'

interface EvaluationFormProps {
  playerId: string
  playerName: string
  playerPosition: string
  criteria: EvaluationCriteria[]
  coaches: { id: string; first_name: string; last_name: string; display_name: string | null }[]
  existingEvaluation?: { id: string; type: EvaluationType; period_start: string; period_end: string; coach_id: string | null; general_comment_fr: string | null; objectives_next_period: string | null; status: string }
  existingScores?: { criteria_id: string; rating: EvaluationRating; comment: string }[]
}

export function EvaluationForm({
  playerId, playerName, playerPosition, criteria, coaches,
  existingEvaluation, existingScores = []
}: EvaluationFormProps) {
  const router = useRouter()
  const isEdit = !!existingEvaluation

  const [type, setType] = useState<EvaluationType>(existingEvaluation?.type ?? 'weekly')
  const [periodStart, setPeriodStart] = useState(existingEvaluation?.period_start ?? '')
  const [periodEnd, setPeriodEnd] = useState(existingEvaluation?.period_end ?? '')
  const [coachId, setCoachId] = useState(existingEvaluation?.coach_id ?? '')
  const [generalComment, setGeneralComment] = useState(existingEvaluation?.general_comment_fr ?? '')
  const [objectives, setObjectives] = useState(existingEvaluation?.objectives_next_period ?? '')

  const [scores, setScores] = useState<Record<string, { rating: EvaluationRating | null; comment: string }>>(() => {
    const init: Record<string, { rating: EvaluationRating | null; comment: string }> = {}
    criteria.forEach(c => {
      const existing = existingScores.find(s => s.criteria_id === c.id)
      init[c.id] = { rating: existing?.rating ?? null, comment: existing?.comment ?? '' }
    })
    return init
  })

  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pillars = Array.from(new Set(criteria.map(c => c.pillar)))

  async function handleSave(publish = false) {
    const missingRatings = criteria.filter(c => !scores[c.id]?.rating)
    if (publish && missingRatings.length > 0) {
      setError(`${missingRatings.length} critère(s) sans note. Complétez tous les critères avant de publier.`)
      return
    }

    if (publish) setPublishing(true); else setSaving(true)
    setError(null)

    try {
      let evalId = existingEvaluation?.id

      const payload = {
        player_id: playerId,
        coach_id: coachId || null,
        type,
        period_start: periodStart,
        period_end: periodEnd,
        general_comment_fr: generalComment || null,
        objectives_next_period: objectives || null,
        status: publish ? 'published' as const : 'draft' as const,
        ...(publish ? { published_at: new Date().toISOString() } : {}),
      }

      if (isEdit && evalId) {
        await updateEvaluation(evalId, payload)
      } else {
        const created = await createEvaluation(payload)
        evalId = created.id
      }

      const scoresToSave = criteria
        .filter(c => scores[c.id]?.rating)
        .map(c => ({
          criteria_id: c.id,
          rating: scores[c.id].rating!,
          comment: scores[c.id].comment || '',
        }))

      await saveEvaluationScores(evalId!, scoresToSave)

      router.push('/admin/evaluations')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const label = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Header info */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Rapport pour {playerName} ({playerPosition})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={label}>Type *</label>
            <select value={type} onChange={e => setType(e.target.value as EvaluationType)} className={input}>
              {(Object.entries(EVALUATION_TYPE_LABELS) as [EvaluationType, {fr:string;en:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Coach *</label>
            <select value={coachId} onChange={e => setCoachId(e.target.value)} className={input}>
              <option value="">— Sélectionner —</option>
              {coaches.map(c => (
                <option key={c.id} value={c.id}>
                  {c.display_name || `${c.first_name} ${c.last_name}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Début période *</label>
            <input required type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Fin période *</label>
            <input required type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className={input} />
          </div>
        </div>
      </div>

      {/* Criteria by pillar */}
      {pillars.map(pillar => {
        const pillarCriteria = criteria.filter(c => c.pillar === pillar)
        const pillarInfo = PILLAR_LABELS[pillar]
        const filled = pillarCriteria.filter(c => scores[c.id]?.rating).length
        return (
          <div key={pillar} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span>{pillarInfo.emoji}</span>{pillarInfo.fr}
              </h2>
              <span className="text-xs text-gray-400">{filled}/{pillarCriteria.length} notés</span>
            </div>
            <div className="divide-y divide-gray-50">
              {pillarCriteria.map(criterion => (
                <div key={criterion.id} className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{criterion.name_fr}</p>
                      {criterion.position_specific && (
                        <span className="text-xs text-blue-500">{criterion.position_specific.join(', ')}</span>
                      )}
                    </div>
                    <RatingSelector
                      value={scores[criterion.id]?.rating ?? null}
                      onChange={rating => setScores(prev => ({
                        ...prev,
                        [criterion.id]: { ...prev[criterion.id], rating }
                      }))}
                    />
                  </div>
                  {scores[criterion.id]?.rating && (
                    <textarea
                      rows={2}
                      placeholder="Commentaire du coach (obligatoire à la publication)..."
                      value={scores[criterion.id]?.comment ?? ''}
                      onChange={e => setScores(prev => ({
                        ...prev,
                        [criterion.id]: { ...prev[criterion.id], comment: e.target.value }
                      }))}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* General comment + objectives */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Commentaire général & Objectifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Commentaire général (FR)</label>
            <textarea rows={4} value={generalComment} onChange={e => setGeneralComment(e.target.value)} className={input}
              placeholder="Bilan général de la période..." />
          </div>
          <div>
            <label className={label}>Objectifs prochaine période</label>
            <textarea rows={4} value={objectives} onChange={e => setObjectives(e.target.value)} className={input}
              placeholder="Points de travail prioritaires..." />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          Annuler
        </button>
        <button type="button" onClick={() => handleSave(false)} disabled={saving || publishing}
          className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Sauvegarde...' : 'Sauvegarder brouillon'}
        </button>
        <button type="button" onClick={() => handleSave(true)} disabled={saving || publishing}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
          {publishing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {publishing ? 'Publication...' : 'Publier au parent'}
        </button>
      </div>
    </div>
  )
}
