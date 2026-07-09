export const runtime = 'edge';

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getPartnerById } from '@/lib/partners'
import { PartnerForm } from '@/components/partners/PartnerForm'
export default async function EditPartnerPage({ params }: { params: { id: string } }) {
  const partner = await getPartnerById(params.id)
  if (!partner) notFound()
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/partners" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Partenaires</Link>
        <span>/</span><span className="text-gray-900 font-medium">{partner.name}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{partner.name}</h1>
      <PartnerForm partner={partner} />
    </div>
  )
}
