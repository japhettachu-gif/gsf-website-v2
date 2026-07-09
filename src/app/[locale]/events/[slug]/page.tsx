export const runtime = 'edge';

import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getEventBySlug } from '@/lib/events'
import { EVENT_TYPE_LABELS, EVENT_STATUS_LABELS, EVENT_STATUS_COLORS } from '@/types/events'
import { Calendar, MapPin, Clock, Users, Phone, Mail, ExternalLink } from 'lucide-react'

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale()
  const event = await getEventBySlug(params.slug)
  if (!event) notFound()

  const title = locale === 'fr' ? event.title_fr : event.title
  const description = locale === 'fr' ? event.description_fr : event.description
  const excerpt = locale === 'fr' ? event.excerpt_fr : event.excerpt
  const color = event.color ?? '#16a34a'
  const typeInfo = EVENT_TYPE_LABELS[event.type]
  const statusLabel = EVENT_STATUS_LABELS[event.status]?.[locale as 'en'|'fr']
  const statusColor = EVENT_STATUS_COLORS[event.status]
  const spotsLeft = event.max_participants ? event.max_participants - event.current_participants : null

  const dateStr = new Date(event.start_date).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      {event.cover_url ? (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={event.cover_url} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-extrabold">{title}</h1>
          </div>
        </div>
      ) : (
        <section className="text-white py-16 px-4" style={{ backgroundColor: color }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl mb-4">{typeInfo.emoji}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{title}</h1>
            {excerpt && <p className="text-white/80 text-lg max-w-2xl">{excerpt}</p>}
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
                {locale === 'fr' ? typeInfo.fr : typeInfo.en}
              </span>
              <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: statusColor }}>
                {statusLabel}
              </span>
            </div>

            {/* Description */}
            {description && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-3">
                  {locale === 'fr' ? 'À propos' : 'About'}
                </h2>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{description}</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Info card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Calendar size={16} className="shrink-0 mt-0.5" style={{ color }} />
                <div>
                  <p className="font-medium text-gray-900">{dateStr}</p>
                  {event.end_date && event.end_date !== event.start_date && (
                    <p className="text-gray-500 text-xs">
                      → {new Date(event.end_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              {event.start_time && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="shrink-0" style={{ color }} />
                  <span className="text-gray-700">{event.start_time.slice(0,5)}{event.end_time ? ` – ${event.end_time.slice(0,5)}` : ''}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={16} className="shrink-0 mt-0.5" style={{ color }} />
                  <div>
                    <p className="text-gray-700">{event.location}</p>
                    {event.location_details && <p className="text-gray-400 text-xs">{event.location_details}</p>}
                  </div>
                </div>
              )}
              {event.max_participants && (
                <div className="flex items-center gap-3 text-sm">
                  <Users size={16} className="shrink-0" style={{ color }} />
                  <span className="text-gray-700">
                    {spotsLeft !== null && spotsLeft > 0
                      ? `${spotsLeft} ${locale === 'fr' ? 'places restantes' : 'spots left'}`
                      : locale === 'fr' ? 'Complet' : 'Full'}
                  </span>
                </div>
              )}
            </div>

            {/* Price + CTA */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-2xl font-extrabold mb-3" style={{ color }}>
                {event.is_free
                  ? (locale === 'fr' ? 'Gratuit' : 'Free')
                  : event.price_xaf ? `${event.price_xaf.toLocaleString()} XAF` : '—'}
              </p>
              {event.registration_required && event.registration_url && (
                <a href={event.registration_url} target="_blank" rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl transition hover:opacity-90"
                  style={{ backgroundColor: color }}>
                  {locale === 'fr' ? "S'inscrire" : 'Register'}
                  <ExternalLink size={14} />
                </a>
              )}
              {event.registration_deadline && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {locale === 'fr' ? 'Inscription avant le' : 'Deadline'} {new Date(event.registration_deadline).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long' })}
                </p>
              )}
            </div>

            {/* Contact */}
            {(event.contact_name || event.contact_phone || event.contact_email) && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-2">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Contact</p>
                {event.contact_name && <p className="text-sm font-medium text-gray-800">{event.contact_name}</p>}
                {event.contact_phone && (
                  <a href={`tel:${event.contact_phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600">
                    <Phone size={14} />{event.contact_phone}
                  </a>
                )}
                {event.contact_email && (
                  <a href={`mailto:${event.contact_email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600">
                    <Mail size={14} />{event.contact_email}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
