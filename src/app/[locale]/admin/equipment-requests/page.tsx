import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllRequests } from '@/lib/inventory'
import { REQUEST_STATUS_LABELS } from '@/types/inventory'

export const metadata = { title: 'Demandes Matériel | GSF Admin' }

export default async function RequestsPage() {
  const requests = await getAllRequests().catch(() => [])
  const pending = requests.filter(r => r.status === 'pending').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes de matériel</h1>
          <p className="text-gray-500 text-sm mt-1">
            {requests.length} demande{requests.length > 1 ? 's' : ''} — {pending} en attente
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/inventory" className="text-sm text-green-600 hover:underline">← Inventaire</Link>
          <Link href="/admin/equipment-requests/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
            <Plus size={16} />Nouvelle demande
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>Aucune demande de matériel.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Demandeur</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Article</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Qté</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Objet</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Nécessaire le</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map(r => {
                  const s = REQUEST_STATUS_LABELS[r.status]
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.requested_by}</td>
                      <td className="px-4 py-3 text-gray-600">{r.item_name}</td>
                      <td className="px-4 py-3 text-gray-600">{r.quantity_requested}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-48 truncate">{r.purpose ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {r.needed_by ? new Date(r.needed_by).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: s.color }}>
                          {s.fr}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(r.created_at).toLocaleDateString('fr-FR')}
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
