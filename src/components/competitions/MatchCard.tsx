'use client'

import { Calendar, MapPin, Trophy } from 'lucide-react'
import type { Match } from '@/types/competitions'
import { MATCH_STATUS_LABELS, RESULT_COLORS } from '@/types/competitions'

interface MatchCardProps {
  match: Match
  locale: string
}

export function MatchCard({ match, locale }: MatchCardProps) {
  const isCompleted = match.status === 'completed'
  const resultColor = match.result ? RESULT_COLORS[match.result] : '#6b7280'
  const statusLabel = MATCH_STATUS_LABELS[match.status]?.[locale as 'en' | 'fr']

  const dateStr = match.match_date
    ? new Date(match.match_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
      })
    : '—'

  const resultLabel = match.result
    ? { win: locale === 'fr' ? 'Victoire' : 'Win', loss: locale === 'fr' ? 'Défaite' : 'Loss', draw: locale === 'fr' ? 'Nul' : 'Draw' }[match.result]
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Result bar */}
      {isCompleted && match.result && (
        <div className="h-1.5" style={{ backgroundColor: resultColor }} />
      )}

      <div className="p-4">
        {/* Status + Result badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            match.status === 'live' ? 'bg-red-100 text-red-700 animate-pulse' :
            match.status === 'completed' ? 'bg-gray-100 text-gray-600' :
            'bg-blue-50 text-blue-700'
          }`}>
            {match.status === 'live' ? '🔴 LIVE' : statusLabel}
          </span>
          {resultLabel && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: resultColor }}>
              {resultLabel}
            </span>
          )}
          {match.round && (
            <span className="text-xs text-gray-400">{match.round}</span>
          )}
        </div>

        {/* Score board */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex-1 text-center">
            <p className={`font-bold text-sm leading-tight ${match.is_home_game ? 'text-green-700' : 'text-gray-800'}`}>
              {match.home_team}
            </p>
            {match.is_home_game && (
              <span className="text-xs text-green-600 font-medium">GSF</span>
            )}
          </div>

          <div className="flex items-center gap-2 px-3">
            {isCompleted ? (
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold text-gray-900">{match.home_score}</span>
                <span className="text-gray-400 font-bold">—</span>
                <span className="text-2xl font-extrabold text-gray-900">{match.away_score}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-300">VS</span>
            )}
          </div>

          <div className="flex-1 text-center">
            <p className={`font-bold text-sm leading-tight ${!match.is_home_game ? 'text-green-700' : 'text-gray-800'}`}>
              {match.away_team}
            </p>
            {!match.is_home_game && (
              <span className="text-xs text-green-600 font-medium">GSF</span>
            )}
          </div>
        </div>

        {/* Scorers */}
        {match.gsf_scorers && match.gsf_scorers.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="text-sm">⚽</span>
            <span className="text-xs text-gray-600">{match.gsf_scorers.join(', ')}</span>
          </div>
        )}

        {/* MOTM */}
        {match.man_of_match && (
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy size={12} className="text-yellow-500" />
            <span className="text-xs text-gray-600">{match.man_of_match}</span>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-50 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={11} />{dateStr}
            {match.match_time && ` · ${match.match_time.slice(0, 5)}`}
          </span>
          {match.location && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={11} />{match.location}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
