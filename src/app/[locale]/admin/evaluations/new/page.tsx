export const runtime = 'edge';

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAllCriteria } from '@/lib/evaluations'
import { EvaluationForm } from '@/components/evaluations/EvaluationForm'

export const metadata = { title: 'Nouveau Rapport | GSF Admin' }

export default async function NewEvaluationPage({ searchParams }: { searchParams: { player_id?: string } }) {
  const supabase = createClient()
  const { data: players } = await supabase
    .from('players').select('id, first_name, last_name, position').eq('status', 'active').order('last_name') as unknown as { data: any[] | null }
  const { data: coaches } = await supabase
    .from('staff').select('id, first_name, last_name, display_name').eq('status', 'active')
    .in('role', ['head_coach','assistant_coach','goalkeeper_coach','fitness_coach']).order('last_name') as unknown as { data: any[] | null }

  const selectedPlayerId = searchParams.player_id ?? players?.[0]?.id ?? ''
  const selectedPlayer = players?.find(p => p.id === selectedPlayerId)
  const criteria = selectedPlayer ? await getAllCriteria() : []
  const filteredCriteria = criteria.filter(c =>
    !c.position_specific || c.position_specific.includes(selectedPlayer?.position as never)
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/evaluations" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Évaluations</Link>
        <span>/</span><span className="text-gray-900 font-medium">Nouveau rapport</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Créer un rapport d'évaluation</h1>
        <p className="text-gray-500 text-sm mt-1">Les critères s'adaptent automatiquement au poste du joueur.</p>
      </div>

      {/* Player selector */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Sélectionner le joueur *</label>
        <form method="get">
          <select name="player_id" defaultValue={selectedPlayerId} onChange={e => { const f = e.target.form; if (f) f.submit() }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {players?.map(p => (
              <option key={p.id} value={p.id}>{p.last_name} {p.first_name} ({p.position})</option>
            ))}
          </select>
        </form>
      </div>

      {selectedPlayer && (
        <EvaluationForm
          playerId={selectedPlayer.id}
          playerName={`${selectedPlayer.first_name} ${selectedPlayer.last_name}`}
          playerPosition={selectedPlayer.position}
          criteria={filteredCriteria}
          coaches={coaches ?? []}
        />
      )}
    </div>
  )
}
