'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react'
import type { Event } from '@/types/events'
import { EVENT_TYPE_LABELS, EVENT_STATUS_LABELS, EVENT_STATUS_COLORS } from '@/types/events'

interface EventCardProps {
  event: Event
  locale: string
}

export function EventCard({ event, locale }: EventCardProps) {
  const title = locale === 'fr' ? event.title_fr : event.title
  const excerpt = locale === 'fr' ? event.excerpt_fr : event.excerpt
  const color = event.color ?? '#16a34a'
  const typeInfo = EVENT_TYPE_LABELS[event.type]
  const statusLabel = EVENT_STATUS_LABELS[event.status]?.[locale as 'en' | 'fr']
  const statusColor = EVENT_STATUS_COLORS[event.status]

  const spotsLeft = event.max_participants
    ? event.max_participants - event.current_participants
    : null

  const dateStr = new Date(event.start_date).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  const endDateStr = event.end_date && event.end_date !== event.start_date
    ? new Date(event.end_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long' })
    : null

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Cover or color header */}
      {event.cover_url ? (
        <div className="h-44 overflow-hidden">
          <img src={event.cover_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center text-5xl" style={{ backgroundColor: color + '20' }}>
          {typeInfo.emoji}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
            {locale === 'fr' ? typeInfo.fr : typeInfo.en}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: statusColor }}>
            {statusLabel}
          </span>
          {event.is_featured && (
            <span className="text-xs font-bold text-yellow-600">⭐</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-2">{title}</h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">{excerpt}</p>
        )}

        {/* Details */}
        <div className="space-y-1.5 mb-4 mt-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} className="shrink-0" />
            <span>{dateStr}{endDateStr ? ` → ${endDateStr}` : ''}</span>
          </div>
          {event.start_time && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} className="shrink-0" />
              <span>{event.start_time.slice(0, 5)}{event.end_time ? ` – ${event.end_time.slice(0, 5)}` : ''}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.max_participants && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={12} className="shrink-0" />
              <span>
                {spotsLeft !== null && spotsLeft > 0
                  ? `${spotsLeft} ${locale === 'fr' ? 'places restantes' : 'spots left'}`
                  : locale === 'fr' ? 'Complet' : 'Full'}
              </span>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-bold" style={{ color }}>
            {event.is_free
              ? (locale === 'fr' ? 'Gratuit' : 'Free')
              : event.price_xaf
              ? `${event.price_xaf.toLocaleString()} XAF`
              : ''}
          </span>
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
            style={{ color }}
          >
            {locale === 'fr' ? 'Voir' : 'View'}
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
