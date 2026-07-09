export const runtime = 'edge';

import Link from 'next/link'
import { getAllStaff } from '@/lib/staff'
import { STAFF_ROLE_LABELS, STAFF_STATUS_LABELS } from '@/types/staff'
import { Plus, Users, Eye, EyeOff } from 'lucide-react'

export const metadata = { title: 'Gestion Staff | GSF Admin' }

export default async function AdminStaffPage() {
  const members = await getAllStaff().catch(() => [])

  const activeCount   = members.filter(m => m.status === 'active').length
  const visibleCount  = members.filter(m => m.show_on_website).length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Encadreurs & Staff</h1>
          <p className="text-gray-500 text-sm mt-1">
            {members.length} membre{members.length > 1 ? 's' : ''} — {activeCount} actif{activeCount > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/staff/new"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition"
        >
          <Plus size={16} />
          Ajouter un membre
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total staff', value: members.length, icon: Users, color: 'green' },
          { label: 'Actifs', value: activeCount, icon: Users, color: 'emerald' },
          { label: 'Sur le site', value: visibleCount, icon: Eye, color: 'blue' },
          { label: 'Masqués', value: members.length - visibleCount, icon: EyeOff, color: 'gray' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun membre du staff pour l'instant.</p>
            <Link href="/admin/staff/new" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">
              Ajouter le premier membre →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Nom</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Rôle</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Site web</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Ordre</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map(member => {
                  const fullName = member.display_name || `${member.first_name} ${member.last_name}`
                  return (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {member.photo_url ? (
                            <img src={member.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                              {member.first_name[0]}{member.last_name[0]}
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {STAFF_ROLE_LABELS[member.role]?.fr ?? member.role}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : member.status === 'on_leave'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {STAFF_STATUS_LABELS[member.status]?.fr}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {member.show_on_website
                          ? <Eye size={14} className="text-green-600" />
                          : <EyeOff size={14} className="text-gray-400" />}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {member.display_order ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/staff/${member.id}`}
                          className="text-green-600 hover:text-green-800 font-medium text-xs hover:underline"
                        >
                          Modifier →
                        </Link>
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
