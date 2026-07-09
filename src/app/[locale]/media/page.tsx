export const runtime = 'edge';

import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { getPublicVideos, getFeaturedImages } from '@/lib/media'

export const metadata = { title: 'Médias | GSF Academy' }

export default async function MediaPage() {
  const locale = await getLocale()
  const [videos, featuredImages] = await Promise.all([
    getPublicVideos().catch(() => []),
    getFeaturedImages(6).catch(() => []),
  ])
  const isFr = locale === 'fr'

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {isFr ? 'Médias GSF' : 'GSF Media'}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {isFr ? 'Photos, vidéos et temps forts de la Genius Soccer Foundation.' : 'Photos, videos and highlights from Genius Soccer Foundation.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-14">
        {/* Featured photos */}
        {featuredImages.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{isFr ? '📸 Photos à la une' : '📸 Featured Photos'}</h2>
              <Link href="/media/gallery" className="text-sm text-green-600 hover:underline">
                {isFr ? 'Voir toute la galerie →' : 'See full gallery →'}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {featuredImages.map(img => (
                <div key={img.id} className="aspect-square overflow-hidden rounded-xl bg-gray-200">
                  <img src={img.url} alt={img.caption_fr ?? ''} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{isFr ? '🎬 Vidéos' : '🎬 Videos'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <div key={video.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.title_fr} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 text-4xl">▶</div>
                    )}
                    <a href={video.youtube_url} target="_blank" rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">▶</div>
                    </a>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">{isFr ? video.title_fr : (video.title_en ?? video.title_fr)}</p>
                    {video.description_fr && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description_fr}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
