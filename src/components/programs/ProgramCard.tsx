'use client'

import Link from 'next/link'
import { Users, Clock, Calendar, ChevronRight } from 'lucide-react'
import type { Program } from '@/types/programs'
import { PROGRAM_LEVEL_LABELS, AGE_GROUP_LABELS } from '@/types/programs'

interface ProgramCardProps {
  program: Program
  locale: string
}

export function ProgramCard({ program, locale }: ProgramCardProps) {
  const name = locale === 'fr' ? program.name_fr : program.name
  const description = locale === 'fr' ? program.description_fr : program.description
  const level = PROGRAM_LEVEL_LABELS[program.level]?.[locale as 'en' | 'fr']
  const objectives = locale === 'fr' ? program.objectives_fr : program.objectives
  const spotsLeft = program.max_players ? program.max_players - program.current_players : null
  const color = program.color ?? '#16a34a'

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Color header */}
      <div className="h-2" style={{ backgroundColor: color }} />

      <div className="p-6 flex flex-col flex-1">
        {/* Icon + Age badge */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{program.icon ?? '⚽'}</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
            {AGE_GROUP_LABELS[program.age_group]}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color }}>
          {level}
        </p>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{description}</p>
        )}

        {/* Objectives */}
        {objectives && objectives.length > 0 && (
          <ul className="space-y-1 mb-4">
            {objectives.slice(0, 3).map((obj, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {obj}
              </li>
            ))}
          </ul>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-5 mt-auto pt-4 border-t border-gray-100">
          {program.sessions_per_week && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={12} />
              {program.sessions_per_week}x/{locale === 'fr' ? 'sem' : 'wk'}
            </div>
          )}
          {program.session_duration_minutes && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={12} />
              {program.session_duration_minutes} min
            </div>
          )}
          {program.max_players && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Users size={12} />
              {spotsLeft !== null && spotsLeft > 0
                ? `${spotsLeft} ${locale === 'fr' ? 'places restantes' : 'spots left'}`
                : locale === 'fr' ? 'Complet' : 'Full'}
            </div>
          )}
          {program.price_xaf && (
            <div className="text-xs font-semibold" style={{ color }}>
              {program.price_xaf.toLocaleString()} XAF
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/programs/${program.slug}`}
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-all group-hover:gap-3"
          style={{ backgroundColor: color }}
        >
          {locale === 'fr' ? 'Voir le programme' : 'View program'}
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}
