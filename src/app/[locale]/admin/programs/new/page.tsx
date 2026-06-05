import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProgramForm } from '@/components/programs/ProgramForm'

export const metadata = { title: 'Nouveau Programme | GSF Admin' }

export default function NewProgramPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/programs" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <ChevronLeft size={14} />Programmes
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Nouveau</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Créer un programme</h1>
        <p className="text-gray-500 text-sm mt-1">Le programme sera immédiatement disponible pour la planification des séances.</p>
      </div>
      <ProgramForm />
    </div>
  )
}
