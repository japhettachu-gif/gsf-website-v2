'use client'

import { useState } from 'react'
import { Clock, MapPin, User } from 'lucide-react'
import type { TrainingSession, DayOfWeek } from '@/types/programs'
import { DAY_LABELS, SESSION_TYPE_LABELS, SESSION_TYPE_COLORS } from '@/types/programs'

interface WeeklyScheduleProps {
  sessions: TrainingSession[]
  locale: string
}

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0]

export function WeeklySchedule({ sessions, locale }: WeeklyScheduleProps) {
  const [activeDay, setActiveDay] = useState<DayOfWeek | 'all'>('all')

  const sessionsByDay = DAYS.reduce((acc, day) => {
    acc[day] = sessions.filter(s => s.day_of_week === day)
    return acc
  }, {} as Record<DayOfWeek, TrainingSession[]>)

  const activeDays = DAYS.filter(d => sessionsByDay[d].length > 0)

  const displayedDays = activeDay === 'all' ? activeDays : [activeDay as DayOfWeek]

  return (
    <div>
      {/* Day filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setActiveDay('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeDay === 'all' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {locale === 'fr' ? 'Toute la semaine' : 'Full week'}
        </button>
        {activeDays.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeDay === day ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {DAY_LABELS[day].fr}
          </button>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">{locale === 'fr' ? 'Aucune séance planifiée.' : 'No sessions scheduled.'}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedDays.map(day => {
            const daySessions = sessionsByDay[day]
            if (!daySessions.length) return null
            return (
              <div key={day}>
                {/* Day header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    {DAY_LABELS[day][locale as 'en' | 'fr']}
                  </div>
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">{daySessions.length} séance{daySessions.length > 1 ? 's' : ''}</span>
                </div>

                {/* Sessions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {daySessions.map(session => {
                    const typeColor = SESSION_TYPE_COLORS[session.type]
                    const typeLabel = SESSION_TYPE_LABELS[session.type]?.[locale as 'en' | 'fr']
                    const title = (locale === 'fr' ? session.title_fr : session.title)
                      || session.program?.[locale === 'fr' ? 'name_fr' : 'name']
                      || typeLabel
                    const programColor = session.program?.color ?? typeColor

                    return (
                      <div
                        key={session.id}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="h-1.5" style={{ backgroundColor: programColor }} />
                        <div className="p-4">
                          {/* Type badge */}
                          <span
                            className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white mb-2"
                            style={{ backgroundColor: typeColor }}
                          >
                            {typeLabel}
                          </span>

                          <h4 className="font-bold text-gray-900 text-sm mb-3">{title}</h4>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock size={12} className="shrink-0" />
                              {session.start_time.slice(0, 5)} – {session.end_time.slice(0, 5)}
                            </div>
                            {session.location && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <MapPin size={12} className="shrink-0" />
                                {session.location}
                              </div>
                            )}
                            {session.coach && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <User size={12} className="shrink-0" />
                                {session.coach.display_name || `${session.coach.first_name} ${session.coach.last_name}`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
