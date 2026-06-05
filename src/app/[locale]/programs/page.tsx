import { getLocale } from 'next-intl/server'
import { getPublicPrograms } from '@/lib/programs'
import { ProgramCard } from '@/components/programs/ProgramCard'

export const metadata = {
  title: 'Nos Programmes | GSF Academy',
  description: 'Découvrez les programmes de formation de la Genius Soccer Foundation.',
}

export default async function ProgramsPage() {
  const locale = await getLocale()
  const programs = await getPublicPrograms().catch(() => [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-white/10 backdrop-blur text-green-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {locale === 'fr' ? 'Formation' : 'Training'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {locale === 'fr' ? 'Nos Programmes' : 'Our Programs'}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Des programmes structurés pour chaque niveau, de l\'initiation à l\'élite.'
              : 'Structured programs for every level, from initiation to elite.'}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{programs.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {locale === 'fr' ? 'Programmes actifs' : 'Active programs'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">
              {programs.reduce((sum, p) => sum + (p.max_players ?? 0), 0)}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {locale === 'fr' ? 'Places disponibles' : 'Total capacity'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">
              {new Set(programs.map(p => p.age_group)).size}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {locale === 'fr' ? 'Catégories d\'âge' : 'Age categories'}
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        {programs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">
              {locale === 'fr' ? 'Aucun programme disponible pour l\'instant.' : 'No programs available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programs.map(program => (
              <ProgramCard key={program.id} program={program} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
