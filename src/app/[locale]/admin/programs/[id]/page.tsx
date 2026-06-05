import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getProgramById } from '@/lib/programs'
import { ProgramForm } from '@/components/programs/ProgramForm'

export const metadata = { title: 'Modifier Programme | GSF Admin' }

export default async function EditProgramPage({ params }: { params: { id: string } }) {
  const program = await getProgramById(params.id)
  if (!program) notFound()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/programs" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <ChevronLeft size={14} />Programmes
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{program.name_fr}</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{program.name_fr}</h1>
        <p className="text-gray-500 text-sm mt-1">Toute modification est appliquée immédiatement sur le site.</p>
      </div>
      <ProgramForm program={program} />
    </div>
  )
}
