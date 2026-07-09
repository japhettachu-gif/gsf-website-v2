export const runtime = 'edge';

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { CompetitionForm } from '@/components/competitions/CompetitionForm'
export const metadata = { title: 'Nouvelle Compétition | GSF Admin' }
export default function NewCompetitionPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/competitions" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14} />Compétitions</Link>
        <span>/</span><span className="text-gray-900 font-medium">Nouvelle</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Créer une compétition</h1>
        <p className="text-gray-500 text-sm mt-1">Vous pourrez ensuite ajouter les matchs associés.</p>
      </div>
      <CompetitionForm />
    </div>
  )
}
