export const runtime = 'edge';

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getAllPrograms } from '@/lib/programs'
import { createClient } from '@/lib/supabase/server'
import { SessionForm } from '@/components/sessions/SessionForm'

export const metadata = { title: 'Nouvelle Séance | GSF Admin' }

export default async function NewSessionPage() {
  const programs = await getAllPrograms().catch(() => [])
  const supabase = createClient()
  const { data: coaches } = await supabase
    .from('staff')
    .select('id, first_name, last_name, display_name')
    .eq('status', 'active')
    .in('role', ['head_coach','assistant_coach','goalkeeper_coach','fitness_coach'])
    .order('last_name')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/sessions" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <ChevronLeft size={14} />Séances
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Nouvelle séance</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Planifier une séance</h1>
        <p className="text-gray-500 text-sm mt-1">La séance apparaîtra immédiatement dans le planning public.</p>
      </div>
      <SessionForm
        programs={programs.map(p => ({ id: p.id, name_fr: p.name_fr, age_group: p.age_group }))}
        coaches={coaches ?? []}
      />
    </div>
  )
}
