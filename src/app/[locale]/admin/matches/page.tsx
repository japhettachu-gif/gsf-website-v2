import Link from 'next/link'
import { getAllMatches } from '@/lib/competitions'
import { MATCH_STATUS_LABELS, RESULT_COLORS } from '@/types/competitions'
import { Plus, Calendar } from 'lucide-react'

export const metadata = { title: 'Gestion Matchs | GSF Admin' }

export default async function AdminMatchesPage() {
  const matches = await getAllMatches().catch(() => [])
  const completed = matches.filter(m => m.status === 'completed').length
  const wins = matches.filter(m => m.result === 'win').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matchs</h1>
          <p className="text-gray-500 text-sm mt-1">{matches.length} match{matches.length > 1 ? 's' : ''} — {wins} victoire{wins > 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/matches/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
          <Plus size={16} />Nouveau match
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {matches.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun match enregistré.</p>
            <Link href="/admin/matches/new" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">Ajouter le premier match →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Match</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Résultat</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Compétition</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {matches.map(m => {
                  const resultColor = m.result ? RESULT_COLORS[m.result] : '#9ca3af'
                  const resultLabel = m.result ? { win: 'Victoire', loss: 'Défaite', draw: 'Nul' }[m.result] : '—'
                  return (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{m.home_team} vs {m.away_team}</p>
                        {m.location && <p className="text-xs text-gray-400">{m.location}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {m.match_date ? new Date(m.match_date).toLocaleDateString('fr-FR') : '—'}
                        {m.match_time && <span className="text-gray-400 ml-1">{m.match_time.slice(0,5)}</span>}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {m.status === 'completed' ? `${m.home_score} — ${m.away_score}` : <span className="text-gray-400 font-normal">{MATCH_STATUS_LABELS[m.status]?.fr}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {m.result ? <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: resultColor }}>{resultLabel}</span> : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {(m.competition as { name_fr?: string })?.name_fr ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/matches/${m.id}`} className="text-green-600 hover:text-green-800 font-medium text-xs hover:underline">Modifier →</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
