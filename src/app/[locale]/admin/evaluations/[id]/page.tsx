import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getEvaluationById, getEvaluationScores, getCriteriaForPosition, getAllCriteria } from '@/lib/evaluations'
import { createServerClient } from '@/lib/supabase/server'
import { EvaluationForm } from '@/components/evaluations/EvaluationForm'
import { RATING_CONFIG, PILLAR_LABELS } from '@/types/evaluations'

export const metadata = { title: 'Rapport Évaluation | GSF Admin' }

export default async function EvaluationDetailPage({ params }: { params: { id: string } }) {
  const [evaluation, scores] = await Promise.all([
    getEvaluationById(params.id),
    getEvaluationScores(params.id),
  ])
  if (!evaluation) notFound()

  const supabase = createServerClient()
  const { data: coaches } = await supabase
    .from('staff').select('id, first_name, last_name, display_name').eq('status', 'active')
    .in('role', ['head_coach','assistant_coach','goalkeeper_coach','fitness_coach'])

  const position = (evaluation.player?.position ?? 'MID') as 'GK'|'DEF'|'MID'|'FWD'
  const criteria = await getCriteriaForPosition(position)
  const playerName = evaluation.player
    ? `${evaluation.player.first_name} ${evaluation.player.last_name}` : '—'

  const isPublished = evaluation.status === 'published'

  if (isPublished) {
    // Read-only view for published evaluations
    const pillars = Array.from(new Set(criteria.map(c => c.pillar)))
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/evaluations" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Évaluations</Link>
          <span>/</span><span className="text-gray-900 font-medium">{playerName}</span>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{playerName}</h1>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">✅ Publié</span>
        </div>
        <div className="space-y-4">
          {pillars.map(pillar => {
            const pillarCriteria = criteria.filter(c => c.pillar === pillar)
            return (
              <div key={pillar} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 border-b px-5 py-3">
                  <h2 className="text-sm font-bold text-gray-800">{PILLAR_LABELS[pillar].emoji} {PILLAR_LABELS[pillar].fr}</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {pillarCriteria.map(c => {
                    const score = scores.find(s => s.criteria_id === c.id)
                    if (!score) return null
                    const ratingInfo = RATING_CONFIG[score.rating]
                    return (
                      <div key={c.id} className="p-4 flex items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{c.name_fr}</p>
                          {score.comment && <p className="text-xs text-gray-500 mt-1 italic">"{score.comment}"</p>}
                        </div>
                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: ratingInfo.bg, color: ratingInfo.color }}>
                          {ratingInfo.emoji} {ratingInfo.fr}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          {evaluation.general_comment_fr && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-xs font-bold text-gray-600 uppercase mb-2">Commentaire général</p>
              <p className="text-sm text-gray-700">{evaluation.general_comment_fr}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/evaluations" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Évaluations</Link>
        <span>/</span><span className="text-gray-900 font-medium">{playerName}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{playerName}</h1>
      <EvaluationForm
        playerId={evaluation.player_id}
        playerName={playerName}
        playerPosition={position}
        criteria={criteria}
        coaches={coaches ?? []}
        existingEvaluation={evaluation}
        existingScores={scores.map(s => ({ criteria_id: s.criteria_id, rating: s.rating, comment: s.comment }))}
      />
    </div>
  )
}
