export const runtime = 'edge';

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getAlumniById } from '@/lib/partners'
import { AlumniForm } from '@/components/alumni/AlumniForm'
export default async function EditAlumniPage({ params }: { params: { id: string } }) {
  const alumni = await getAlumniById(params.id)
  if (!alumni) notFound()
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/alumni" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Alumni</Link>
        <span>/</span><span className="text-gray-900 font-medium">{alumni.name}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{alumni.name}</h1>
      <AlumniForm alumni={alumni} />
    </div>
  )
}
