import Link from 'next/link'
import { ChevronLeft, Plus } from 'lucide-react'
import { getAllCriteria } from '@/lib/evaluations'
import { PILLAR_LABELS } from '@/types/evaluations'
import { CriteriaManager } from '@/components/evaluations/CriteriaManager'

export const metadata = { title: 'Critères Évaluation | GSF Admin' }

export default async function EvaluationSettingsPage() {
  const criteria = await getAllCriteria().catch(() => [])
  const pillars = Array.from(new Set(criteria.map(c => c.pillar)))

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/evaluations" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Évaluations</Link>
        <span>/</span><span className="text-gray-900 font-medium">Critères</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Critères d'évaluation</h1>
          <p className="text-gray-500 text-sm mt-1">Configurez les critères sans toucher au code. Les modifications s'appliquent immédiatement.</p>
        </div>
      </div>

      <div className="space-y-4">
        {pillars.map(pillar => {
          const pillarCriteria = criteria.filter(c => c.pillar === pillar)
          return (
            <div key={pillar} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800">
                  {PILLAR_LABELS[pillar].emoji} {PILLAR_LABELS[pillar].fr}
                  <span className="text-gray-400 font-normal ml-2 text-xs">({pillarCriteria.length} critères)</span>
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {pillarCriteria.map(c => (
                  <div key={c.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{c.name_fr}</p>
                      {c.position_specific && (
                        <p className="text-xs text-blue-500 mt-0.5">Spécifique : {c.position_specific.join(', ')}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        💡 Pour ajouter ou modifier des critères, utilisez le SQL Editor de Supabase sur la table <code className="bg-blue-100 px-1 rounded">evaluation_criteria</code>.
      </div>
    </div>
  )
}
