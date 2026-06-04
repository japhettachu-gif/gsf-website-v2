'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteStaffMember } from '@/lib/staff'

interface Props {
  staffId: string
  staffName: string
}

export function DeleteStaffButton({ staffId, staffName }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteStaffMember(staffId)
      router.push('/admin/staff')
      router.refresh()
    } catch {
      setDeleting(false)
      setConfirming(false)
      alert('Erreur lors de la suppression.')
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
        <span className="text-sm text-red-700">Supprimer {staffName} ?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : 'Confirmer'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-sm text-gray-500 hover:text-gray-700">
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 px-4 py-2 rounded-lg transition"
    >
      <Trash2 size={14} />
      Supprimer
    </button>
  )
}
