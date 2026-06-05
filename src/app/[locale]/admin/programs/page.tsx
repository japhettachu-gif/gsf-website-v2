import Link from 'next/link'
import { getAllPrograms } from '@/lib/programs'
import { PROGRAM_LEVEL_LABELS, PROGRAM_STATUS_LABELS, AGE_GROUP_LABELS } from '@/types/programs'
import { Plus } from 'lucide-react'

export const metadata = { title: 'Gestion Programmes | GSF Admin' }

export default async function AdminProgramsPage() {
  const programs = await getAllPrograms().catch(() => [])
  const activeCount = programs.filter(p => p.status === 'active').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programmes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {programs.length} programme{programs.length > 1 ? 's' : ''} — {activeCount} actif{activeCount > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/programs/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
          <Plus size={16} />Nouveau programme
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {programs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>Aucun programme créé.</p>
            <Link href="/admin/programs/new" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">
              Créer le premier programme →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Programme</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Catégorie</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Niveau</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Joueurs</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Site</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {programs.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.icon ?? '⚽'}</span>
                        <div>
                          <p className="font-medium text-gray-900">{p.name_fr}</p>
                          <p className="text-xs text-gray-400">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{AGE_GROUP_LABELS[p.age_group]}</td>
                    <td className="px-4 py-3 text-gray-600">{PROGRAM_LEVEL_LABELS[p.level].fr}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === 'active' ? 'bg-green-100 text-green-700' :
                        p.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {PROGRAM_STATUS_LABELS[p.status].fr}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.current_players}{p.max_players ? `/${p.max_players}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${p.show_on_website ? 'text-green-600' : 'text-gray-400'}`}>
                        {p.show_on_website ? 'Visible' : 'Masqué'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/programs/${p.id}`} className="text-green-600 hover:text-green-800 font-medium text-xs hover:underline">
                        Modifier →
                      </Link>
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
