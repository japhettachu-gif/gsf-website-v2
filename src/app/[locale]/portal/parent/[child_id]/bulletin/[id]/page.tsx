export const runtime = 'edge';

import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getEvaluationById, getEvaluationScores } from '@/lib/evaluations'
import { RATING_CONFIG, PILLAR_LABELS, EVALUATION_TYPE_LABELS } from '@/types/evaluations'
import type { EvaluationPillar } from '@/types/evaluations'
import { ChevronLeft, Calendar, User } from 'lucide-react'

export const metadata = { title: 'Bulletin | Portail Parent GSF' }

export default async function BulletinDetailPage({
  params
}: { params: { child_id: string; id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify parent access
  const { data: parentLink } = await supabase
    .from('parent_profiles')
    .select('player_id')
    .eq('user_id', user.id)
    .eq('player_id', params.child_id)
    .single() as unknown as { data: any | null }
  if (!parentLink) notFound()

  const [evaluation, scores] = await Promise.all([
    getEvaluationById(params.id),
    getEvaluationScores(params.id),
  ])

  if (!evaluation || evaluation.status !== 'published' || evaluation.player_id !== params.child_id) notFound()

  const playerName = evaluation.player
    ? `${evaluation.player.first_name} ${evaluation.player.last_name}` : '—'
  const coachName = evaluation.coach
    ? evaluation.coach.display_name || `${evaluation.coach.first_name} ${evaluation.coach.last_name}` : '—'

  const pillars = Array.from(new Set(scores.map(s => s.criteria?.pillar).filter(Boolean))) as EvaluationPillar[]

  const typeLabel = EVALUATION_TYPE_LABELS[evaluation.type]

  // Calculate overall average
  const ratingNums = scores.map(s => ({ developing: 1, satisfactory: 2, good: 3, excellent: 4 }[s.rating] ?? 0))
  const avg = ratingNums.length > 0 ? ratingNums.reduce((a, b) => a + b, 0) / ratingNums.length : 0
  const avgLabel = avg >= 3.5 ? 'Excellent' : avg >= 2.5 ? 'Bien' : avg >= 1.5 ? 'Satisfaisant' : 'En développement'
  const avgColor = avg >= 3.5 ? '#b45309' : avg >= 2.5 ? '#16a34a' : avg >= 1.5 ? '#ca8a04' : '#dc2626'

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href={`/portal/parent/${params.child_id}`} className="hover:text-gray-900 flex items-center gap-1">
            <ChevronLeft size={14} />Rapports
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{typeLabel.fr}</span>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{typeLabel.fr}</p>
              <h1 className="text-xl font-bold text-gray-900">{playerName}</h1>
            </div>
            <div className="text-center bg-gray-50 rounded-xl px-4 py-2">
              <p className="text-2xl font-extrabold" style={{ color: avgColor }}>{avg.toFixed(1)}</p>
              <p className="text-xs font-medium" style={{ color: avgColor }}>{avgLabel}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              {new Date(evaluation.period_start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              {' → '}
              {new Date(evaluation.period_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5">
              <User size={12} />Coach : {coachName}
            </div>
          </div>
        </div>

        {/* Scores by pillar */}
        <div className="space-y-4 mb-6">
          {pillars.map(pillar => {
            const pillarScores = scores.filter(s => s.criteria?.pillar === pillar)
            if (!pillarScores.length) return null
            const pillarInfo = PILLAR_LABELS[pillar]
            return (
              <div key={pillar} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
                  <h2 className="text-sm font-bold text-gray-800">
                    {pillarInfo.emoji} {pillarInfo.fr}
                  </h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {pillarScores.map(score => {
                    const ratingInfo = RATING_CONFIG[score.rating]
                    return (
                      <div key={score.id} className="p-4">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="text-sm font-semibold text-gray-800">
                            {score.criteria?.name_fr ?? '—'}
                          </p>
                          <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: ratingInfo.bg, color: ratingInfo.color }}>
                            {ratingInfo.emoji} {ratingInfo.fr}
                          </span>
                        </div>
                        {score.comment && (
                          <p className="text-xs text-gray-500 italic mt-1">"{score.comment}"</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* General comment */}
        {evaluation.general_comment_fr && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Commentaire général</p>
            <p className="text-sm text-gray-700 leading-relaxed">{evaluation.general_comment_fr}</p>
          </div>
        )}

        {/* Objectives */}
        {evaluation.objectives_next_period && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">
              🎯 Objectifs prochaine période
            </p>
            <p className="text-sm text-green-800 leading-relaxed">{evaluation.objectives_next_period}</p>
          </div>
        )}
      </div>
    </main>
  )
}
