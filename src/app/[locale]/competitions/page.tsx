import { getLocale } from 'next-intl/server'
import { getPublicCompetitions, getRecentResults, getUpcomingMatches } from '@/lib/competitions'
import { CompetitionCard } from '@/components/competitions/CompetitionCard'
import { MatchCard } from '@/components/competitions/MatchCard'

export const metadata = {
  title: 'Compétitions & Résultats | GSF Academy',
  description: 'Suivez les compétitions et résultats de la Genius Soccer Foundation.',
}

export default async function CompetitionsPage() {
  const locale = await getLocale()
  const [competitions, recentResults, upcoming] = await Promise.all([
    getPublicCompetitions().catch(() => []),
    getRecentResults(6).catch(() => []),
    getUpcomingMatches(4).catch(() => []),
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-white/10 backdrop-blur text-green-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {locale === 'fr' ? 'Sur le terrain' : 'On the pitch'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {locale === 'fr' ? 'Compétitions & Résultats' : 'Competitions & Results'}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Suivez les performances de nos équipes en compétition.'
              : 'Follow our teams performances in competition.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-14">

        {/* Upcoming matches */}
        {upcoming.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full inline-block" />
              {locale === 'fr' ? 'Prochains matchs' : 'Upcoming matches'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcoming.map(match => <MatchCard key={match.id} match={match} locale={locale} />)}
            </div>
          </section>
        )}

        {/* Recent results */}
        {recentResults.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full inline-block" />
              {locale === 'fr' ? 'Derniers résultats' : 'Recent results'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentResults.map(match => <MatchCard key={match.id} match={match} locale={locale} />)}
            </div>
          </section>
        )}

        {/* Competitions */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-yellow-500 rounded-full inline-block" />
            {locale === 'fr' ? 'Nos compétitions' : 'Our competitions'}
          </h2>
          {competitions.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p>{locale === 'fr' ? 'Aucune compétition disponible.' : 'No competitions available.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitions.map(c => <CompetitionCard key={c.id} competition={c} locale={locale} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
