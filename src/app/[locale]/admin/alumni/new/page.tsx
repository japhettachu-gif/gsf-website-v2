import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AlumniForm } from '@/components/alumni/AlumniForm'
export default function NewAlumniPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/alumni" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Alumni</Link>
        <span>/</span><span className="text-gray-900 font-medium">Nouvel alumni</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Ajouter un alumni</h1>
      <AlumniForm />
    </div>
  )
}
