import { getTranslations, getLocale } from 'next-intl/server'
import { getPublicStaff } from '@/lib/staff'
import { StaffGrid } from '@/components/staff/StaffGrid'

export async function generateMetadata() {
  return {
    title: 'Notre Staff | GSF Academy',
    description: "L'équipe d'encadreurs de la Genius Soccer Foundation",
  }
}

export default async function StaffPage() {
  const locale = await getLocale()
  const members = await getPublicStaff().catch(() => [])

  const t = {
    allRoles: locale === 'fr' ? 'Tous les rôles' : 'All roles',
    noStaff:  locale === 'fr' ? 'Aucun encadreur trouvé.' : 'No staff found.',
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-white/10 backdrop-blur text-green-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {locale === 'fr' ? 'Notre Équipe' : 'Our Team'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {locale === 'fr' ? 'Encadreurs & Staff' : 'Coaches & Staff'}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {locale === 'fr'
              ? "Des professionnels passionnés au service du développement de nos jeunes talents."
              : "Passionate professionals dedicated to developing our young talents."}
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{members.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {locale === 'fr' ? 'Membres staff' : 'Staff members'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">
              {Math.max(0, ...members.map(m => m.years_experience ?? 0))}+
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {locale === 'fr' ? "Ans d'expérience max" : 'Max years experience'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">
              {new Set(members.map(m => m.role)).size}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {locale === 'fr' ? 'Domaines couverts' : 'Areas covered'}
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <StaffGrid members={members} locale={locale} translations={t} />
      </section>
    </main>
  )
}
