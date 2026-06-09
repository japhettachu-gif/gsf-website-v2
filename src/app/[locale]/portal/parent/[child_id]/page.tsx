import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getPublishedEvaluationsForPlayer } from '@/lib/evaluations'
import { EvaluationCard } from '@/components/evaluations/EvaluationCard'
import { ChevronLeft, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Rapports | Portail Parent GSF' }

export default async function ChildReportsPage({ params }: { params: { child_id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify parent has access to this child
  const { data: parentLink } = await supabase
    .from('parent_profiles')
    .select('*, player:players(id, first_name, last_name, photo_url, position)')
    .eq('user_id', user.id)
    .eq('player_id', params.child_id)
    .single()

  if (!parentLink) notFound()

  const player = parentLink.player as any
  const evaluations = await getPublishedEvaluationsForPlayer(params.child_id).catch(() => [])

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/portal/parent" className="hover:text-gray-900 flex items-center gap-1">
            <ChevronLeft size={14} />Portail Parent
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{player.first_name} {player.last_name}</span>
        </div>

        {/* Player header */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {player.photo_url ? (
              <img src={player.photo_url} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                {player.first_name[0]}{player.last_name[0]}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{player.first_name} {player.last_name}</h1>
              <p className="text-sm text-gray-500">{player.position}</p>
            </div>
          </div>
          <Link href={`/portal/parent/${params.child_id}/progression`}
            className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-800 border border-green-200 px-3 py-2 rounded-lg transition">
            <TrendingUp size={14} />Progression
          </Link>
        </div>

        {/* Evaluations list */}
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
          Rapports publiés ({evaluations.length})
        </h2>

        {evaluations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            <p>Aucun rapport publié pour l'instant.</p>
            <p className="text-xs mt-1">Les rapports apparaissent ici une fois publiés par le coach.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {evaluations.map(ev => (
              <EvaluationCard
                key={ev.id}
                evaluation={ev}
                locale="fr"
                href={`/portal/parent/${params.child_id}/bulletin/${ev.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
