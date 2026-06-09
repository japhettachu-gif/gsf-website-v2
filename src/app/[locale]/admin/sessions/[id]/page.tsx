import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getSessionById, getAllPrograms } from '@/lib/programs'
import { createClient } from '@/lib/supabase/server'
import { SessionForm } from '@/components/sessions/SessionForm'
import { DeleteSessionButton } from '@/components/sessions/DeleteSessionButton'
import { SESSION_TYPE_LABELS } from '@/types/programs'

export const metadata = { title: 'Modifier Séance | GSF Admin' }

export default async function EditSessionPage({ params }: { params: { id: string } }) {
  const session = await getSessionById(params.id)
  if (!session) notFound()

  const programs = await getAllPrograms().catch(() => [])
  const supabase = createClient()
  const { data: coaches } = await supabase
    .from('staff')
    .select('id, first_name, last_name, display_name')
    .eq('status', 'active')
    .in('role', ['head_coach','assistant_coach','goalkeeper_coach','fitness_coach'])
    .order('last_name')

  const title = session.title_fr || session.program?.name_fr || SESSION_TYPE_LABELS[session.type]?.fr

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/sessions" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <ChevronLeft size={14} />Séances
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{title}</span>
      </div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">Les modifications sont appliquées immédiatement sur le planning public.</p>
        </div>
        <DeleteSessionButton sessionId={session.id} sessionTitle={title ?? 'cette séance'} />
      </div>
      <SessionForm
        session={session}
        programs={programs.map(p => ({ id: p.id, name_fr: p.name_fr, age_group: p.age_group }))}
        coaches={coaches ?? []}
      />
    </div>
  )
}
