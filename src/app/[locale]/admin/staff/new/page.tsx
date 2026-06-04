import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { StaffForm } from '@/components/staff/StaffForm'

export const metadata = { title: 'Nouveau membre staff | GSF Admin' }

export default function NewStaffPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/staff" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <ChevronLeft size={14} />
          Staff
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Nouveau membre</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un membre du staff</h1>
        <p className="text-gray-500 text-sm mt-1">
          Renseignez les informations du nouvel encadreur ou membre administratif.
        </p>
      </div>

      <StaffForm locale="fr" />
    </div>
  )
}
