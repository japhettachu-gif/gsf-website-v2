import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getCompetitionBySlug, getPublicMatchesByCompetition } from '@/lib/competitions'
import { MatchCard } from '@/components/competitions/MatchCard'
import { COMPETITION_TYPE_LABELS, COMPETITION_STATUS_LABELS } from '@/types/competitions'
import { Calendar, MapPin } from 'lucide-react'

export default async function CompetitionDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale()
  const competition = await getCompetitionBySlug(params.slug)
  if (!competition) notFound()

  const matches = await getPublicMatchesByCompetition(competition.id).catch(() => [])
  const name = locale === 'fr' ? competition.name_fr : competition.name
  const description = locale === 'fr' ? competition.description_fr : competition.description
  const color = competition.color ?? '#16a34a'

  const played   = matches.filter(m => m.status === 'completed')
  const wins     = played.filter(m => m.result === 'win').length
  const draws    = played.filter(m => m.result === 'draw').length
  const losses   = played.filter(m => m.result === 'loss').length
  const goalsFor = played.reduce((s, m) => {
    const gsf = m.is_home_game ? (m.home_score ?? 0) : (m.away_score ?? 0)
    return s + gsf
  }, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="text-white py-16 px-4" style={{ backgroundColor: color }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {COMPETITION_TYPE_LABELS[competition.type]?.[locale as 'en'|'fr']}
            </span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {COMPETITION_STATUS_LABELS[competition.status]?.[locale as 'en'|'fr']}
            </span>
            {competition.season && <span className="text-white/70 text-sm">{competition.season}</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{name}</h1>
          {description && <p className="text-white/80 text-lg max-w-2xl">{description}</p>}
          <div className="flex flex-wrap gap-4 mt-4">
            {competition.location && (
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <MapPin size={14} />{competition.location}
              </span>
            )}
            {competition.start_date && (
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <Calendar size={14} />
                {new Date(competition.start_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      {played.length > 0 && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: locale === 'fr' ? 'Joués' : 'Played', value: played.length },
              { label: locale === 'fr' ? 'Victoires' : 'Wins', value: wins, color: '#16a34a' },
              { label: locale === 'fr' ? 'Nuls' : 'Draws', value: draws, color: '#ca8a04' },
              { label: locale === 'fr' ? 'Défaites' : 'Losses', value: losses, color: '#dc2626' },
              { label: locale === 'fr' ? 'Buts marqués' : 'Goals', value: goalsFor },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold" style={{ color: s.color ?? '#111827' }}>{s.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Matches */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {locale === 'fr' ? 'Tous les matchs' : 'All matches'}
          <span className="text-gray-400 font-normal text-sm ml-2">({matches.length})</span>
        </h2>
        {matches.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>{locale === 'fr' ? 'Aucun match enregistré.' : 'No matches recorded.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.map(match => <MatchCard key={match.id} match={match} locale={locale} />)}
          </div>
        )}
      </section>
    </main>
  )
}
