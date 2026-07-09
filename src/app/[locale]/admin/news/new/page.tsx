export const runtime = 'edge';

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ArticleForm } from '@/components/news/ArticleForm'
export const metadata = { title: 'Nouvel Article | GSF Admin' }
export default function NewArticlePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/news" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Actualités</Link>
        <span>/</span><span className="text-gray-900 font-medium">Nouvel article</span>
      </div>
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Rédiger un article</h1>
        <p className="text-gray-500 text-sm mt-1">Rédigez en FR et EN. Publiez quand l'article est prêt.</p></div>
      <ArticleForm />
    </div>
  )
}
