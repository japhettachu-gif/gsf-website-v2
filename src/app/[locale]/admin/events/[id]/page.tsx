export const runtime = 'edge';

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getEventById } from '@/lib/events'
import { EventForm } from '@/components/events/EventForm'
export const metadata = { title: 'Modifier Événement | GSF Admin' }
export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id)
  if (!event) notFound()
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/events" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Événements</Link>
        <span>/</span><span className="text-gray-900 font-medium">{event.title_fr}</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{event.title_fr}</h1>
        <p className="text-gray-500 text-sm mt-1">Modifications appliquées immédiatement sur le site.</p>
      </div>
      <EventForm event={event} />
    </div>
  )
}
