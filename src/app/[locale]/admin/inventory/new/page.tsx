export const runtime = 'edge';

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ItemForm } from '@/components/inventory/ItemForm'
export const metadata = { title: 'Nouvel Article | GSF Admin' }
export default function NewItemPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/inventory" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Inventaire</Link>
        <span>/</span><span className="text-gray-900 font-medium">Nouvel article</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un article</h1>
        <p className="text-gray-500 text-sm mt-1">L'article sera immédiatement disponible dans l'inventaire.</p>
      </div>
      <ItemForm />
    </div>
  )
}
