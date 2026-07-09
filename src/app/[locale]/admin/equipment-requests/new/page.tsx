'use client'

export const runtime = 'edge';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2, Save, X } from 'lucide-react'
import { createRequest } from '@/lib/inventory'

export default function NewRequestPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    requested_by: '',
    item_name: '',
    quantity_requested: 1,
    purpose: '',
    needed_by: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      await createRequest({ ...form, status: 'pending' })
      router.push('/admin/equipment-requests'); router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally { setSaving(false) }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const label = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/equipment-requests" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14}/>Demandes</Link>
        <span>/</span><span className="text-gray-900 font-medium">Nouvelle demande</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Demander du matériel</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2"><X size={16} className="mt-0.5"/>{error}</div>}
        <div><label className={label}>Votre nom *</label>
          <input required value={form.requested_by} onChange={e => setForm(p => ({ ...p, requested_by: e.target.value }))} className={input} /></div>
        <div><label className={label}>Article demandé *</label>
          <input required value={form.item_name} onChange={e => setForm(p => ({ ...p, item_name: e.target.value }))} className={input} placeholder="Ballons T5, Chasubles..." /></div>
        <div><label className={label}>Quantité *</label>
          <input required type="number" min="1" value={form.quantity_requested} onChange={e => setForm(p => ({ ...p, quantity_requested: parseInt(e.target.value) }))} className={input} /></div>
        <div><label className={label}>Objet / Raison</label>
          <textarea rows={3} value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))} className={input} placeholder="Pour l'entraînement U16 du..." /></div>
        <div><label className={label}>Nécessaire avant le</label>
          <input type="date" value={form.needed_by} onChange={e => setForm(p => ({ ...p, needed_by: e.target.value }))} className={input} /></div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Annuler</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
            {saving ? 'Envoi...' : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  )
}
