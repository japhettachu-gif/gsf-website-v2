import { getLocale } from 'next-intl/server'
import { getPublicGallery, getGalleryAlbums } from '@/lib/media'
import { GalleryGrid } from '@/components/media/GalleryGrid'

export const metadata = { title: 'Galerie Photos | GSF Academy' }

export default async function GalleryPage({ searchParams }: { searchParams: { album?: string } }) {
  const locale = await getLocale()
  const [images, albums] = await Promise.all([
    getPublicGallery(searchParams.album).catch(() => []),
    getGalleryAlbums().catch(() => []),
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-green-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {locale === 'fr' ? 'Médias' : 'Media'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {locale === 'fr' ? 'Galerie Photos' : 'Photo Gallery'}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {locale === 'fr' ? 'Les meilleurs moments de la GSF Academy.' : 'The best moments from GSF Academy.'}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        {/* Album filter */}
        {albums.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <a href="/media/gallery" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!searchParams.album ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {locale === 'fr' ? 'Tous' : 'All'}
            </a>
            {albums.map(album => (
              <a key={album} href={`/media/gallery?album=${encodeURIComponent(album)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${searchParams.album === album ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {album}
              </a>
            ))}
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📸</p>
            <p>{locale === 'fr' ? 'Aucune photo disponible.' : 'No photos available.'}</p>
          </div>
        ) : (
          <GalleryGrid images={images} locale={locale} />
        )}
      </section>
    </main>
  )
}
