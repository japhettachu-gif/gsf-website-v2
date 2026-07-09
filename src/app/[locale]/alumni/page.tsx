export const runtime = 'edge';

import { getLocale } from 'next-intl/server'
import { getPublicAlumni } from '@/lib/partners'
import { MapPin, Trophy } from 'lucide-react'

export const metadata = { title: 'Alumni | GSF Academy' }

export default async function AlumniPage() {
  const locale = await getLocale()
  const alumni = await getPublicAlumni().catch(() => [])
  const isFr = locale === 'fr'

  const featured = alumni.filter(a => a.is_featured)
  const rest = alumni.filter(a => !a.is_featured)

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{isFr ? 'Nos Alumni' : 'Our Alumni'}</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {isFr ? 'Les anciens joueurs de la GSF Academy qui brillent aujourd\'hui.' : 'Former GSF Academy players who shine today.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-10">
        {alumni.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🏆</p>
            <p>{isFr ? 'Aucun alumni pour l\'instant.' : 'No alumni yet.'}</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded-full" />⭐ {isFr ? 'Parcours remarquables' : 'Notable alumni'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map(al => (
                    <div key={al.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-5 shadow-sm hover:shadow-md transition-shadow">
                      {al.photo_url ? (
                        <img src={al.photo_url} alt={al.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl shrink-0">
                          {al.name[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{al.name}</h3>
                        {al.position && <p className="text-xs text-gray-500 mb-1">{al.position}</p>}
                        {al.current_club && (
                          <p className="text-sm font-medium text-green-700 flex items-center gap-1 mb-1">
                            <Trophy size={12} />{al.current_club}
                            {al.current_country && ` · ${al.current_country}`}
                          </p>
                        )}
                        {al.years_at_gsf && <p className="text-xs text-gray-400 mb-2">GSF : {al.years_at_gsf}</p>}
                        {(isFr ? al.story_fr : al.story_en) && (
                          <p className="text-xs text-gray-600 line-clamp-2">{isFr ? al.story_fr : al.story_en}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {rest.length > 0 && (
              <section>
                {featured.length > 0 && <h2 className="text-xl font-bold text-gray-900 mb-6">{isFr ? 'Tous les alumni' : 'All alumni'}</h2>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map(al => (
                    <div key={al.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      {al.photo_url ? (
                        <img src={al.photo_url} alt={al.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">{al.name[0]}</div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{al.name}</p>
                        {al.current_club && <p className="text-xs text-green-600 font-medium truncate">{al.current_club}</p>}
                        {al.years_at_gsf && <p className="text-xs text-gray-400">GSF : {al.years_at_gsf}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}
