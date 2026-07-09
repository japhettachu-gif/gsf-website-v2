export const runtime = 'edge';

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getItemById } from '@/lib/inventory'
import { ItemForm } from '@/components/inventory/ItemForm'
export const metadata = { title: 'Modifier Article | GSF Admin' }
export default async function EditItemPage({ params }: { params: { id: string } }) {
  const item = await getItemById(params.id)
  if (!item) notFound()
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/inventory" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Inventaire</Link>
        <span>/</span><span className="text-gray-900 font-medium">{item.name_fr}</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{item.name_fr}</h1>
        <p className="text-gray-500 text-sm mt-1">Modifications appliquées immédiatement.</p>
      </div>
      <ItemForm item={item} />
    </div>
  )
}
