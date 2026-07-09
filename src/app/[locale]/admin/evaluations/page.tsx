export const runtime = 'edge';

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllEvaluations } from '@/lib/evaluations'
import { EvaluationCard } from '@/components/evaluations/EvaluationCard'
import { EVALUATION_TYPE_LABELS } from '@/types/evaluations'

export const metadata = { title: 'Évaluations | GSF Admin' }

export default async function AdminEvaluationsPage() {
  const evaluations = await getAllEvaluations().catch(() => [])
  const published = evaluations.filter(e => e.status === 'published').length
  const drafts = evaluations.filter(e => e.status === 'draft').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Évaluations joueurs</h1>
          <p className="text-gray-500 text-sm mt-1">
            {evaluations.length} rapport{evaluations.length > 1 ? 's' : ''} — {published} publié{published > 1 ? 's' : ''} — {drafts} brouillon{drafts > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/settings/evaluation" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
            ⚙️ Gérer les critères
          </Link>
          <Link href="/admin/evaluations/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
            <Plus size={16} />Nouveau rapport
          </Link>
        </div>
      </div>

      {evaluations.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100">
          <p className="text-4xl mb-3">📋</p>
          <p>Aucun rapport d'évaluation créé.</p>
          <Link href="/admin/evaluations/new" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">
            Créer le premier rapport →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {evaluations.map(ev => (
            <EvaluationCard
              key={ev.id}
              evaluation={ev}
              href={`/admin/evaluations/${ev.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
