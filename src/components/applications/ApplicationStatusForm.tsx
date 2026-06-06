'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { ApplicationStatus } from '@/types/applications'
import { APPLICATION_STATUS_LABELS } from '@/types/applications'
import { updateApplicationStatus } from '@/lib/applications'

interface Props {
  applicationId: string
  currentStatus: ApplicationStatus
  reviewNotes: string
}

export function ApplicationStatusForm({ applicationId, currentStatus, reviewNotes }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus)
  const [notes, setNotes] = useState(reviewNotes)
  const [reviewer, setReviewer] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!reviewer.trim()) { alert('Indiquez votre nom.'); return }
    setSaving(true)
    try {
      await updateApplicationStatus(applicationId, status, reviewer, notes)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch { alert('Erreur lors de la mise à jour.') }
    finally { setSaving(false) }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Statut</label>
        <select value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)} className={input}>
          {(Object.entries(APPLICATION_STATUS_LABELS) as [ApplicationStatus, {fr:string;en:string;color:string}][]).map(([k,v]) => (
            <option key={k} value={k}>{v.fr}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Votre nom *</label>
        <input value={reviewer} onChange={e => setReviewer(e.target.value)} className={input} placeholder="Ex: Hervé NJAHA" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Notes internes</label>
        <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className={input} placeholder="Observations, raisons..." />
      </div>
      <button onClick={handleSave} disabled={saving}
        className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
        {saved ? '✅ Sauvegardé' : saving ? 'Sauvegarde...' : 'Mettre à jour'}
      </button>
    </div>
  )
}
