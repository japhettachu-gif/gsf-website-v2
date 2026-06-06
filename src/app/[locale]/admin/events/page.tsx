import Link from 'next/link'
import { getAllEvents } from '@/lib/events'
import { EVENT_TYPE_LABELS, EVENT_STATUS_LABELS, EVENT_STATUS_COLORS } from '@/types/events'
import { Plus, Calendar } from 'lucide-react'

export const metadata = { title: 'Gestion Événements | GSF Admin' }

export default async function AdminEventsPage() {
  const events = await getAllEvents().catch(() => [])
  const upcoming = events.filter(e => new Date(e.start_date) >= new Date()).length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Événements & Boot Camps</h1>
          <p className="text-gray-500 text-sm mt-1">{events.length} événement{events.length > 1 ? 's' : ''} — {upcoming} à venir</p>
        </div>
        <Link href="/admin/events/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
          <Plus size={16} />Nouvel événement
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun événement créé.</p>
            <Link href="/admin/events/new" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">Créer le premier →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Événement</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Places</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map(e => {
                  const statusColor = EVENT_STATUS_COLORS[e.status]
                  const typeInfo = EVENT_TYPE_LABELS[e.type]
                  return (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{e.icon || typeInfo.emoji}</span>
                          <div>
                            <p className="font-medium text-gray-900">{e.title_fr}</p>
                            {e.is_featured && <span className="text-xs text-yellow-600">⭐ À la une</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{typeInfo.fr}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(e.start_date).toLocaleDateString('fr-FR')}
                        {e.end_date && e.end_date !== e.start_date && ` → ${new Date(e.end_date).toLocaleDateString('fr-FR')}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: statusColor }}>
                          {EVENT_STATUS_LABELS[e.status]?.fr}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {e.max_participants ? `${e.current_participants}/${e.max_participants}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/events/${e.id}`} className="text-green-600 hover:text-green-800 font-medium text-xs hover:underline">Modifier →</Link>
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
