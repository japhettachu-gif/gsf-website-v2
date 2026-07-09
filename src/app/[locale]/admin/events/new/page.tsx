export const runtime = 'edge';

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { EventForm } from '@/components/events/EventForm'
export const metadata = { title: 'Nouvel Événement | GSF Admin' }
export default function NewEventPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/events" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Événements</Link>
        <span>/</span><span className="text-gray-900 font-medium">Nouvel événement</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Créer un événement</h1>
        <p className="text-gray-500 text-sm mt-1">Publié immédiatement sur le site dès que le statut est activé.</p>
      </div>
      <EventForm />
    </div>
  )
}
