export const runtime = 'edge';

import { getLocale } from 'next-intl/server'
import { getUpcomingEvents } from '@/lib/events'
import { ApplicationForm } from '@/components/applications/ApplicationForm'

export const metadata = {
  title: 'Candidature Boot Camp | GSF Academy',
  description: 'Inscrivez-vous au prochain Boot Camp de la Genius Soccer Foundation.',
}

export default async function JoinBootCampPage() {
  const locale = await getLocale()
  const isFr = locale === 'fr'

  const upcomingBootcamps = await getUpcomingEvents(1).catch(() => [])
  const nextBootcamp = upcomingBootcamps.find(e => e.type === 'bootcamp')

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-5xl mb-4 block">🏕️</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {isFr ? 'Candidature Boot Camp' : 'Boot Camp Application'}
          </h1>
          {nextBootcamp && (
            <p className="text-green-100 text-lg">
              {isFr ? nextBootcamp.title_fr : nextBootcamp.title}
              {nextBootcamp.start_date && ` · ${new Date(nextBootcamp.start_date).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        {nextBootcamp && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {nextBootcamp.start_date && (
              <div>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-0.5">{isFr ? 'Début' : 'Start'}</p>
                <p className="text-sm font-bold text-green-900">{new Date(nextBootcamp.start_date).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short' })}</p>
              </div>
            )}
            {nextBootcamp.end_date && (
              <div>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-0.5">{isFr ? 'Fin' : 'End'}</p>
                <p className="text-sm font-bold text-green-900">{new Date(nextBootcamp.end_date).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short' })}</p>
              </div>
            )}
            {nextBootcamp.location && (
              <div>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-0.5">{isFr ? 'Lieu' : 'Location'}</p>
                <p className="text-sm font-bold text-green-900 truncate">{nextBootcamp.location}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-0.5">{isFr ? 'Tarif' : 'Fee'}</p>
              <p className="text-sm font-bold text-green-900">
                {nextBootcamp.is_free ? (isFr ? 'Gratuit' : 'Free') : nextBootcamp.price_xaf ? `${nextBootcamp.price_xaf.toLocaleString()} XAF` : '—'}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <ApplicationForm type="boot_camp" eventId={nextBootcamp?.id} locale={locale} />
        </div>
      </section>
    </main>
  )
}
