export const runtime = 'edge';

import { getLocale } from 'next-intl/server'
import { getPublicEvents } from '@/lib/events'
import { EventCard } from '@/components/events/EventCard'
import { EVENT_TYPE_LABELS } from '@/types/events'
import type { EventType } from '@/types/events'

export const metadata = {
  title: 'Événements & Boot Camps | GSF Academy',
  description: 'Découvrez les événements, boot camps et stages de la Genius Soccer Foundation.',
}

export default async function EventsPage() {
  const locale = await getLocale()
  const events = await getPublicEvents().catch(() => [])

  const upcoming = events.filter(e => new Date(e.start_date) >= new Date())
  const past = events.filter(e => new Date(e.start_date) < new Date())

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-white/10 backdrop-blur text-green-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {locale === 'fr' ? 'Agenda GSF' : 'GSF Agenda'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {locale === 'fr' ? 'Événements & Boot Camps' : 'Events & Boot Camps'}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Stages intensifs, tournois, journées portes ouvertes et bien plus encore.'
              : 'Intensive camps, tournaments, open days and much more.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-14">

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full inline-block" />
              {locale === 'fr' ? 'À venir' : 'Upcoming'}
              <span className="text-gray-400 font-normal text-sm">({upcoming.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map(event => <EventCard key={event.id} event={event} locale={locale} />)}
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gray-300 rounded-full inline-block" />
              {locale === 'fr' ? 'Événements passés' : 'Past events'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map(event => <EventCard key={event.id} event={event} locale={locale} />)}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-lg">{locale === 'fr' ? 'Aucun événement pour le moment.' : 'No events at the moment.'}</p>
          </div>
        )}
      </div>
    </main>
  )
}
