import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { getPlayerProgressionData } from '@/lib/evaluations'
import { PILLAR_LABELS } from '@/types/evaluations'
import { ChevronLeft } from 'lucide-react'

export const metadata = { title: 'Progression | Portail Parent GSF' }

export default async function ProgressionPage({ params }: { params: { child_id: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: parentLink } = await supabase
    .from('parent_profiles')
    .select('*, player:players(id, first_name, last_name)')
    .eq('user_id', user.id)
    .eq('player_id', params.child_id)
    .single()
  if (!parentLink) notFound()

  const player = parentLink.player as any
  const progression = await getPlayerProgressionData(params.child_id).catch(() => [])

  const pillars = ['physical','mental','behaviour','academic','technical','tactical'] as const

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href={`/portal/parent/${params.child_id}`} className="hover:text-gray-900 flex items-center gap-1">
            <ChevronLeft size={14} />Rapports
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Progression</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Progression de {player.first_name} {player.last_name}
        </h1>

        {progression.length < 2 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            <p>Au moins 2 rapports publiés sont nécessaires pour afficher la progression.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pillars.map(pillar => {
              const pillarInfo = PILLAR_LABELS[pillar]
              const dataPoints = progression.map(p => ({
                period: p.period,
                score: p.scores[pillar] ?? null,
              })).filter(p => p.score !== null)

              if (dataPoints.length < 2) return null

              const latest = dataPoints[dataPoints.length - 1].score!
              const previous = dataPoints[dataPoints.length - 2].score!
              const trend = latest > previous ? '↗️' : latest < previous ? '↘️' : '→'
              const trendColor = latest > previous ? '#16a34a' : latest < previous ? '#dc2626' : '#6b7280'

              return (
                <div key={pillar} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-800">
                      {pillarInfo.emoji} {pillarInfo.fr}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-gray-900">{latest.toFixed(1)}</span>
                      <span className="text-lg" style={{ color: trendColor }}>{trend}</span>
                    </div>
                  </div>
                  {/* Simple bar chart */}
                  <div className="flex items-end gap-1.5 h-16">
                    {dataPoints.map((pt, i) => {
                      const height = ((pt.score ?? 0) / 4) * 100
                      const isLatest = i === dataPoints.length - 1
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t transition-all"
                            style={{
                              height: `${height}%`,
                              backgroundColor: isLatest ? '#16a34a' : '#d1fae5',
                              minHeight: '4px'
                            }}
                          />
                          <span className="text-xs text-gray-400">
                            {new Date(pt.period).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {/* Rating scale legend */}
                  <div className="flex justify-between text-xs text-gray-300 mt-1 px-0.5">
                    <span>1</span><span>2</span><span>3</span><span>4</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
