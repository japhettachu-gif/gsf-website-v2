import Link from 'next/link'
import { getAllSessions } from '@/lib/programs'
import { SESSION_TYPE_LABELS, SESSION_STATUS_LABELS, DAY_LABELS, SESSION_TYPE_COLORS } from '@/types/programs'
import { Plus, Clock, MapPin } from 'lucide-react'

export const metadata = { title: 'Gestion Séances | GSF Admin' }

export default async function AdminSessionsPage() {
  const sessions = await getAllSessions().catch(() => [])
  const scheduledCount = sessions.filter(s => s.status === 'scheduled').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planning & Séances</h1>
          <p className="text-gray-500 text-sm mt-1">
            {sessions.length} séance{sessions.length > 1 ? 's' : ''} — {scheduledCount} planifiée{scheduledCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/schedule" target="_blank" className="text-sm text-green-600 hover:underline">
            Voir vue publique →
          </Link>
          <Link href="/admin/sessions/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
            <Plus size={16} />Nouvelle séance
          </Link>
        </div>
      </div>

      {/* Group by day */}
      <div className="space-y-6">
        {([1,2,3,4,5,6,0] as const).map(day => {
          const daySessions = sessions.filter(s => s.day_of_week === day)
          if (!daySessions.length) return null
          return (
            <div key={day} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide">
                  {DAY_LABELS[day].fr}
                </h2>
                <span className="text-xs text-gray-400">{daySessions.length} séance{daySessions.length > 1 ? 's' : ''}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {daySessions.map(s => {
                  const typeColor = SESSION_TYPE_COLORS[s.type]
                  const typeLabel = SESSION_TYPE_LABELS[s.type]?.fr
                  const title = s.title_fr || s.program?.name_fr || typeLabel
                  return (
                    <div key={s.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={10} />{s.start_time.slice(0,5)}–{s.end_time.slice(0,5)}
                          </span>
                          {s.location && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={10} />{s.location}
                            </span>
                          )}
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium text-white" style={{ backgroundColor: typeColor }}>
                            {typeLabel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                          s.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {SESSION_STATUS_LABELS[s.status]?.fr}
                        </span>
                        <Link href={`/admin/sessions/${s.id}`} className="text-green-600 hover:text-green-800 text-xs font-medium hover:underline">
                          Modifier →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        {sessions.length === 0 && (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100">
            <p>Aucune séance planifiée.</p>
            <Link href="/admin/sessions/new" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">
              Créer la première séance →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
