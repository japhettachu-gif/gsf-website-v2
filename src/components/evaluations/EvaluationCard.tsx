'use client'

import Link from 'next/link'
import { Calendar, User } from 'lucide-react'
import type { PlayerEvaluation } from '@/types/evaluations'
import { EVALUATION_TYPE_LABELS, EVALUATION_STATUS_LABELS } from '@/types/evaluations'

interface EvaluationCardProps {
  evaluation: PlayerEvaluation
  locale?: string
  href: string
}

export function EvaluationCard({ evaluation, locale = 'fr', href }: EvaluationCardProps) {
  const typeLabel = EVALUATION_TYPE_LABELS[evaluation.type]
  const statusInfo = EVALUATION_STATUS_LABELS[evaluation.status]
  const playerName = evaluation.player
    ? `${evaluation.player.first_name} ${evaluation.player.last_name}`
    : '—'
  const coachName = evaluation.coach
    ? evaluation.coach.display_name || `${evaluation.coach.first_name} ${evaluation.coach.last_name}`
    : '—'

  const periodStr = `${new Date(evaluation.period_start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → ${new Date(evaluation.period_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`

  return (
    <Link href={href} className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            {locale === 'fr' ? typeLabel.fr : typeLabel.en}
          </span>
          <p className="font-bold text-gray-900 text-sm mt-0.5">{playerName}</p>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: statusInfo.color }}>
          {statusInfo.fr}
        </span>
      </div>
      <div className="space-y-1 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><Calendar size={11} />{periodStr}</div>
        <div className="flex items-center gap-1.5"><User size={11} />{coachName}</div>
      </div>
    </Link>
  )
}
