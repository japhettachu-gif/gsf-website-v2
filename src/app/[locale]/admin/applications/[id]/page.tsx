import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Mail, Phone, Calendar, MapPin, User } from 'lucide-react'
import { getApplicationById } from '@/lib/applications'
import { APPLICATION_STATUS_LABELS, POSITION_LABELS, APPLICATION_TYPE_LABELS } from '@/types/applications'
import { ApplicationStatusForm } from '@/components/applications/ApplicationStatusForm'

export const metadata = { title: 'Candidature | GSF Admin' }

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const app = await getApplicationById(params.id)
  if (!app) notFound()

  const statusInfo = APPLICATION_STATUS_LABELS[app.status]
  const age = new Date().getFullYear() - new Date(app.birth_date).getFullYear()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/applications" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Candidatures</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{app.first_name} {app.last_name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{app.first_name} {app.last_name}</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: statusInfo.color }}>
              {statusInfo.fr}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            {APPLICATION_TYPE_LABELS[app.type].fr} · {POSITION_LABELS[app.position]?.fr} · {age} ans
          </p>
        </div>
        <p className="text-xs text-gray-400">Reçue le {new Date(app.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Player */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2"><User size={14}/>Joueur</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Nom complet', `${app.first_name} ${app.last_name}`],
                ['Date de naissance', new Date(app.birth_date).toLocaleDateString('fr-FR')],
                ['Âge', `${age} ans`],
                ['Poste', POSITION_LABELS[app.position]?.fr],
                ['Pied fort', app.strong_foot ?? '—'],
                ['Ville', app.city],
                ['Pays', app.country],
                ['Nationalité', app.nationality ?? '—'],
                ['Taille', app.height_cm ? `${app.height_cm} cm` : '—'],
                ['Poids', app.weight_kg ? `${app.weight_kg} kg` : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400">{k}</p>
                  <p className="font-medium text-gray-800">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Expérience</h2>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div><p className="text-xs text-gray-400">Club actuel</p><p className="font-medium text-gray-800">{app.current_club ?? '—'}</p></div>
              <div><p className="text-xs text-gray-400">Années de pratique</p><p className="font-medium text-gray-800">{app.years_playing ? `${app.years_playing} ans` : '—'}</p></div>
            </div>
            {app.experience && <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{app.experience}</p>}
          </div>

          {/* Motivation */}
          {app.message && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Lettre de motivation</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{app.message}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact parent */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Contact parent</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{app.parent_name}</p>
              {app.parent_relationship && <p className="text-xs text-gray-400 capitalize">{app.parent_relationship}</p>}
              <a href={`mailto:${app.parent_email}`} className="flex items-center gap-2 text-green-600 hover:underline">
                <Mail size={13} />{app.parent_email}
              </a>
              <a href={`tel:${app.parent_phone}`} className="flex items-center gap-2 text-green-600 hover:underline">
                <Phone size={13} />{app.parent_phone}
              </a>
            </div>
          </div>

          {/* Status management */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Traitement</h2>
            <ApplicationStatusForm applicationId={app.id} currentStatus={app.status} reviewNotes={app.review_notes ?? ''} />
          </div>

          {/* Review info */}
          {app.reviewed_by && (
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
              <p>Traité par : <span className="font-medium text-gray-700">{app.reviewed_by}</span></p>
              {app.reviewed_at && <p>Le {new Date(app.reviewed_at).toLocaleDateString('fr-FR')}</p>}
              {app.review_notes && <p className="mt-2 text-gray-600 italic">"{app.review_notes}"</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
