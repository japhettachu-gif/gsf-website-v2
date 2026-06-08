import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { getArticleBySlug } from '@/lib/news'
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const locale = await getLocale()
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const isFr = locale === 'fr'
  const title = isFr ? article.title_fr : (article.title_en ?? article.title_fr)
  const body = isFr ? article.body_fr : (article.body_en ?? article.body_fr)

  return (
    <main className="min-h-screen bg-gray-50">
      {article.cover_url && (
        <div className="h-64 md:h-96 overflow-hidden">
          <img src={article.cover_url} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/media/news" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ChevronLeft size={14} />{isFr ? 'Actualités' : 'News'}
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          {article.published_at && (
            <span className="flex items-center gap-1.5"><Calendar size={14} />
              {new Date(article.published_at).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
          {article.author_name && <span className="flex items-center gap-1.5"><User size={14} />{article.author_name}</span>}
          {article.tags && article.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
              <Tag size={10} />{tag}
            </span>
          ))}
        </div>
        {body ? (
          <div className="prose prose-green max-w-none text-gray-700 leading-relaxed whitespace-pre-line">{body}</div>
        ) : (
          <p className="text-gray-400 italic">{isFr ? 'Contenu non disponible.' : 'Content not available.'}</p>
        )}
      </div>
    </main>
  )
}
