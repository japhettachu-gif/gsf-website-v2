export const runtime = 'edge';

import Link from 'next/link'
import { getAllCompetitions } from '@/lib/competitions'
import { COMPETITION_TYPE_LABELS, COMPETITION_STATUS_LABELS } from '@/types/competitions'
import { Plus, Trophy } from 'lucide-react'

export const metadata = { title: 'Gestion Compétitions | GSF Admin' }

export default async function AdminCompetitionsPage() {
  const competitions = await getAllCompetitions().catch(() => [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compétitions</h1>
          <p className="text-gray-500 text-sm mt-1">{competitions.length} compétition{competitions.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/matches" className="text-sm text-green-600 hover:underline">Gérer les matchs →</Link>
          <Link href="/admin/competitions/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
            <Plus size={16} />Nouvelle compétition
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {competitions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Trophy size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucune compétition créée.</p>
            <Link href="/admin/competitions/new" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">Créer la première →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Compétition</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Saison</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Site</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {competitions.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color ?? '#16a34a' }} />
                        <div>
                          <p className="font-medium text-gray-900">{c.name_fr}</p>
                          {c.is_featured && <span className="text-xs text-yellow-600">⭐ À la une</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{COMPETITION_TYPE_LABELS[c.type]?.fr}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                        c.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        c.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-700'
                      }`}>{COMPETITION_STATUS_LABELS[c.status]?.fr}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.season ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${c.show_on_website ? 'text-green-600' : 'text-gray-400'}`}>
                        {c.show_on_website ? 'Visible' : 'Masqué'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/competitions/${c.id}`} className="text-green-600 hover:text-green-800 font-medium text-xs hover:underline">Modifier →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
