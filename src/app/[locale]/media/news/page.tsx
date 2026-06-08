import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { getPublishedArticles } from '@/lib/news'
import { Calendar, Tag } from 'lucide-react'

export const metadata = { title: 'Actualités | GSF Academy' }

export default async function NewsPage() {
  const locale = await getLocale()
  const articles = await getPublishedArticles().catch(() => [])
  const isFr = locale === 'fr'
  const featured = articles.filter(a => a.is_featured)
  const rest = articles.filter(a => !a.is_featured)

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {isFr ? 'Actualités GSF' : 'GSF News'}
          </h1>
          <p className="text-green-100 text-lg">{isFr ? 'Toutes les nouvelles de l\'académie.' : 'All academy news.'}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14">
        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📰</p>
            <p>{isFr ? 'Aucun article publié.' : 'No articles published.'}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featured.map(article => (
                  <Link key={article.id} href={`/media/news/${article.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
                    {article.cover_url && (
                      <div className="h-48 overflow-hidden">
                        <img src={article.cover_url} alt={article.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs font-bold text-yellow-600 mb-2">⭐ {isFr ? 'À la une' : 'Featured'}</span>
                      <h2 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                        {isFr ? article.title_fr : (article.title_en ?? article.title_fr)}
                      </h2>
                      {article.excerpt_fr && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{isFr ? article.excerpt_fr : (article.excerpt_en ?? article.excerpt_fr)}</p>}
                      <div className="mt-auto flex items-center gap-3 text-xs text-gray-400">
                        {article.published_at && <span className="flex items-center gap-1"><Calendar size={11} />{new Date(article.published_at).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                        {article.author_name && <span>{article.author_name}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(article => (
                  <Link key={article.id} href={`/media/news/${article.slug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col">
                    {article.cover_url && <div className="h-36 overflow-hidden"><img src={article.cover_url} alt={article.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                    <div className="p-4 flex flex-col flex-1">
                      <h2 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">{isFr ? article.title_fr : (article.title_en ?? article.title_fr)}</h2>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {article.tags.slice(0,3).map(tag => <span key={tag} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{tag}</span>)}
                        </div>
                      )}
                      <div className="mt-auto text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {article.published_at && new Date(article.published_at).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
