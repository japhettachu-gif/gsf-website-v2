import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { getStaffById } from '@/lib/staff'
import { StaffForm } from '@/components/staff/StaffForm'
import { DeleteStaffButton } from '@/components/staff/DeleteStaffButton'

export const metadata = { title: 'Modifier membre staff | GSF Admin' }

interface Props {
  params: { id: string }
}

export default async function EditStaffPage({ params }: Props) {
  const member = await getStaffById(params.id)
  if (!member) notFound()

  const fullName = member.display_name || `${member.first_name} ${member.last_name}`

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/staff" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <ChevronLeft size={14} />
          Staff
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{fullName}</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Modifier les informations de ce membre du staff.
          </p>
        </div>
        <DeleteStaffButton staffId={member.id} staffName={fullName} />
      </div>

      <StaffForm member={member} locale="fr" />
    </div>
  )
}
