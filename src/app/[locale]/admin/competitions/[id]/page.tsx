export const runtime = 'edge';

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getCompetitionById } from '@/lib/competitions'
import { CompetitionForm } from '@/components/competitions/CompetitionForm'
export const metadata = { title: 'Modifier Compétition | GSF Admin' }
export default async function EditCompetitionPage({ params }: { params: { id: string } }) {
  const competition = await getCompetitionById(params.id)
  if (!competition) notFound()
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/competitions" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14} />Compétitions</Link>
        <span>/</span><span className="text-gray-900 font-medium">{competition.name_fr}</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{competition.name_fr}</h1>
        <p className="text-gray-500 text-sm mt-1">Modifications appliquées immédiatement.</p>
      </div>
      <CompetitionForm competition={competition} />
    </div>
  )
}
