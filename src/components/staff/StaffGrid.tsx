'use client'

import { useState } from 'react'
import { StaffCard } from './StaffCard'
import type { StaffMember, StaffRole } from '@/types/staff'
import { STAFF_ROLE_LABELS } from '@/types/staff'

interface StaffGridProps {
  members: StaffMember[]
  locale: string
  translations: {
    allRoles: string
    noStaff: string
  }
}

export function StaffGrid({ members, locale, translations }: StaffGridProps) {
  const [activeRole, setActiveRole] = useState<StaffRole | 'all'>('all')

  // Build unique roles present in data
  const roles = Array.from(new Set(members.map(m => m.role)))

  const filtered = activeRole === 'all'
    ? members
    : members.filter(m => m.role === activeRole)

  return (
    <div>
      {/* Role filter tabs */}
      {roles.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveRole('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeRole === 'all'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {translations.allRoles}
          </button>
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeRole === role
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {STAFF_ROLE_LABELS[role]?.[locale as 'en' | 'fr'] ?? role}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">{translations.noStaff}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(member => (
            <StaffCard key={member.id} member={member} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
