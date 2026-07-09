export const runtime = 'edge';

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getArticleById } from '@/lib/news'
import { ArticleForm } from '@/components/news/ArticleForm'
export const metadata = { title: 'Modifier Article | GSF Admin' }
export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id)
  if (!article) notFound()
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/news" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Actualités</Link>
        <span>/</span><span className="text-gray-900 font-medium line-clamp-1">{article.title_fr}</span>
      </div>
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{article.title_fr}</h1></div>
      <ArticleForm article={article} />
    </div>
  )
}
