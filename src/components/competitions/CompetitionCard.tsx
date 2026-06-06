'use client'

import Link from 'next/link'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import type { Competition } from '@/types/competitions'
import { COMPETITION_TYPE_LABELS, COMPETITION_STATUS_LABELS } from '@/types/competitions'

interface CompetitionCardProps {
  competition: Competition
  locale: string
}

export function CompetitionCard({ competition, locale }: CompetitionCardProps) {
  const name = locale === 'fr' ? competition.name_fr : competition.name
  const description = locale === 'fr' ? competition.description_fr : competition.description
  const typeLabel = COMPETITION_TYPE_LABELS[competition.type]?.[locale as 'en' | 'fr']
  const statusLabel = COMPETITION_STATUS_LABELS[competition.status]?.[locale as 'en' | 'fr']
  const color = competition.color ?? '#16a34a'

  const statusColor = {
    upcoming:  'bg-blue-50 text-blue-700',
    ongoing:   'bg-green-50 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-50 text-red-700',
  }[competition.status]

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="h-2" style={{ backgroundColor: color }} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            {competition.is_featured && (
              <span className="inline-block text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full mb-1">
                ⭐ {locale === 'fr' ? 'À la une' : 'Featured'}
              </span>
            )}
            <h3 className="font-bold text-gray-900 text-base leading-tight">{name}</h3>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {/* Type + Season */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded text-white" style={{ backgroundColor: color }}>
            {typeLabel}
          </span>
          {competition.age_group && (
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
              {competition.age_group}
            </span>
          )}
          {competition.season && (
            <span className="text-xs text-gray-400">{competition.season}</span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">{description}</p>
        )}

        {/* Dates */}
        <div className="space-y-1 mb-4">
          {(competition.start_date || competition.end_date) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={12} />
              {competition.start_date && new Date(competition.start_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              {competition.end_date && ` → ${new Date(competition.end_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </div>
          )}
          {competition.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={12} />{competition.location}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/competitions/${competition.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
          style={{ color }}
        >
          {locale === 'fr' ? 'Voir les matchs' : 'View matches'}
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}
