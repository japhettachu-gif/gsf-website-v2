export const runtime = 'edge';

import Link from 'next/link'
import { getAllApplications, getApplicationStats } from '@/lib/applications'
import { APPLICATION_STATUS_LABELS, APPLICATION_TYPE_LABELS, POSITION_LABELS } from '@/types/applications'

export const metadata = { title: 'Candidatures | GSF Admin' }

export default async function AdminApplicationsPage() {
  const [applications, stats] = await Promise.all([
    getAllApplications().catch(() => []),
    getApplicationStats().catch(() => ({ total:0, academy:0, bootcamp:0, received:0, under_review:0, accepted:0, rejected:0, waitlisted:0 })),
  ])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>
        <p className="text-gray-500 text-sm mt-1">{stats.total} candidature{stats.total > 1 ? 's' : ''} — {stats.received} nouvelle{stats.received > 1 ? 's' : ''}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Reçues', value: stats.received, color: 'bg-gray-100 text-gray-700' },
          { label: 'En examen', value: stats.under_review, color: 'bg-blue-50 text-blue-700' },
          { label: 'Acceptées', value: stats.accepted, color: 'bg-green-50 text-green-700' },
          { label: 'Refusées', value: stats.rejected, color: 'bg-red-50 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 mb-6">
        {[
          { label: 'Toutes', count: stats.total },
          { label: 'Académie', count: stats.academy },
          { label: 'Boot Camp', count: stats.bootcamp },
        ].map(t => (
          <div key={t.label} className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 flex items-center gap-2">
            {t.label}
            <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {applications.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>Aucune candidature reçue pour l'instant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Candidat</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Poste</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Ville</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map(app => {
                  const statusInfo = APPLICATION_STATUS_LABELS[app.status]
                  const age = new Date().getFullYear() - new Date(app.birth_date).getFullYear()
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{app.first_name} {app.last_name}</p>
                        <p className="text-xs text-gray-400">{age} ans · {app.parent_email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          app.type === 'academy' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          {APPLICATION_TYPE_LABELS[app.type].fr}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{POSITION_LABELS[app.position]?.fr}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{app.city}, {app.country}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: statusInfo.color }}>
                          {statusInfo.fr}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(app.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/applications/${app.id}`}
                          className="text-green-600 hover:text-green-800 font-medium text-xs hover:underline">
                          Voir →
                        </Link>
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
