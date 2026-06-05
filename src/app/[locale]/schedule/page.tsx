import { getLocale } from 'next-intl/server'
import { getPublicSchedule } from '@/lib/programs'
import { WeeklySchedule } from '@/components/sessions/WeeklySchedule'

export const metadata = {
  title: 'Planning Entraînements | GSF Academy',
  description: 'Consultez le planning hebdomadaire des entraînements de la GSF Academy.',
}

export default async function SchedulePage() {
  const locale = await getLocale()
  const sessions = await getPublicSchedule().catch(() => [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-white/10 backdrop-blur text-green-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {locale === 'fr' ? 'Organisation' : 'Schedule'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {locale === 'fr' ? 'Planning Hebdomadaire' : 'Weekly Schedule'}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Retrouvez tous les entraînements et séances de la semaine en un coup d\'œil.'
              : 'Find all training sessions and weekly activities at a glance.'}
          </p>
        </div>
      </section>

      {/* Info banner */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-green-700">
          <span>🔄</span>
          <span>
            {locale === 'fr'
              ? 'Le planning est mis à jour en temps réel par le staff de l\'académie.'
              : 'Schedule is updated in real time by the academy staff.'}
          </span>
        </div>
      </div>

      {/* Schedule */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <WeeklySchedule sessions={sessions} locale={locale} />
      </section>
    </main>
  )
}
