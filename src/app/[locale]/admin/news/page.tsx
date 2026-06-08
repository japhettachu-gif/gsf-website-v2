import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllArticles } from '@/lib/news'
import { ARTICLE_STATUS_LABELS } from '@/types/news'

export const metadata = { title: 'Actualités | GSF Admin' }

export default async function AdminNewsPage() {
  const articles = await getAllArticles().catch(() => [])
  const published = articles.filter(a => a.status === 'published').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actualités & CMS</h1>
          <p className="text-gray-500 text-sm mt-1">{articles.length} article{articles.length > 1 ? 's' : ''} — {published} publié{published > 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/news/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
          <Plus size={16} />Nouvel article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📰</p>
            <p>Aucun article créé.</p>
            <Link href="/admin/news/new" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">Créer le premier →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Article</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Auteur</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Vues</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {articles.map(a => {
                  const statusInfo = ARTICLE_STATUS_LABELS[a.status]
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 line-clamp-1">{a.title_fr}</p>
                        <p className="text-xs text-gray-400">/{a.slug}</p>
                        {a.is_featured && <span className="text-xs text-yellow-600">⭐ À la une</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: statusInfo.color }}>
                          {statusInfo.fr}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{a.author_name ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {a.published_at ? new Date(a.published_at).toLocaleDateString('fr-FR') : new Date(a.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{a.views_count}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/news/${a.id}`} className="text-green-600 hover:text-green-800 font-medium text-xs hover:underline">Modifier →</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
