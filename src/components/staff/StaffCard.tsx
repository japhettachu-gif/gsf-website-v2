'use client'

import Image from 'next/image'
import { Mail, Phone, Linkedin, Instagram } from 'lucide-react'
import type { StaffMember } from '@/types/staff'
import { STAFF_ROLE_LABELS } from '@/types/staff'

interface StaffCardProps {
  member: StaffMember
  locale: string
}

export function StaffCard({ member, locale }: StaffCardProps) {
  const fullName = member.display_name || `${member.first_name} ${member.last_name}`
  const roleLabel = STAFF_ROLE_LABELS[member.role]?.[locale as 'en' | 'fr'] ?? member.role
  const bio = locale === 'fr' ? (member.bio_fr || member.bio) : (member.bio || member.bio_fr)

  const initials = `${member.first_name[0]}${member.last_name[0]}`.toUpperCase()

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Photo */}
      <div className="relative h-64 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={fullName}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-green-600 opacity-40">{initials}</span>
          </div>
        )}
        {/* Role badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{fullName}</h3>

        {member.nationality && (
          <p className="text-xs text-gray-400 mb-3">🌍 {member.nationality}</p>
        )}

        {bio && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{bio}</p>
        )}

        {/* Specialties */}
        {member.specialties && member.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {member.specialties.slice(0, 3).map((s, i) => (
              <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Experience */}
        {member.years_experience && (
          <p className="text-xs text-gray-500 mb-4">
            {member.years_experience} {locale === 'fr' ? "ans d'expérience" : 'years of experience'}
          </p>
        )}

        {/* Social links */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          {member.email && (
            <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-green-600 transition-colors">
              <Mail size={16} />
            </a>
          )}
          {member.phone && (
            <a href={`tel:${member.phone}`} className="text-gray-400 hover:text-green-600 transition-colors">
              <Phone size={16} />
            </a>
          )}
          {member.linkedin_url && (
            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
              <Linkedin size={16} />
            </a>
          )}
          {member.instagram_url && (
            <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
              <Instagram size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
