'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X } from 'lucide-react'
import type { InventoryItem, ItemCategory, ItemCondition, ItemStatus } from '@/types/inventory'
import { CATEGORY_LABELS, CONDITION_LABELS, STATUS_LABELS } from '@/types/inventory'
import { createItem, updateItem, deleteItem } from '@/lib/inventory'

interface ItemFormProps { item?: InventoryItem }

const EMPTY: Partial<InventoryItem> = {
  name: '', name_fr: '', description: '',
  category: 'other', status: 'available', condition: 'good',
  quantity_total: 1, quantity_available: 1, quantity_in_use: 0,
  unit_price_xaf: undefined, location: '', assigned_to: '',
  notes: '', is_consumable: false,
}

export function ItemForm({ item }: ItemFormProps) {
  const router = useRouter()
  const isEdit = !!item
  const [form, setForm] = useState<Partial<InventoryItem>>(item ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function set<K extends keyof InventoryItem>(key: K, value: InventoryItem[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      if (isEdit && item) await updateItem(item.id, form)
      else await createItem(form)
      router.push('/admin/inventory'); router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!item) return
    setDeleting(true)
    try { await deleteItem(item.id); router.push('/admin/inventory'); router.refresh() }
    catch { setDeleting(false); setConfirmDelete(false) }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const label = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2"><X size={16} className="mt-0.5 shrink-0"/>{error}</div>}

      {/* Identité */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Identité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={label}>Nom (FR) *</label>
            <input required value={form.name_fr ?? ''} onChange={e => set('name_fr', e.target.value)} className={input} /></div>
          <div><label className={label}>Nom (EN) *</label>
            <input required value={form.name ?? ''} onChange={e => set('name', e.target.value)} className={input} /></div>
          <div><label className={label}>Catégorie *</label>
            <select value={form.category} onChange={e => set('category', e.target.value as ItemCategory)} className={input}>
              {(Object.entries(CATEGORY_LABELS) as [ItemCategory, {fr:string;emoji:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.emoji} {v.fr}</option>
              ))}
            </select></div>
          <div><label className={label}>Numéro de série</label>
            <input value={form.serial_number ?? ''} onChange={e => set('serial_number', e.target.value)} className={input} /></div>
          <div className="md:col-span-2"><label className={label}>Description</label>
            <textarea rows={2} value={form.description ?? ''} onChange={e => set('description', e.target.value)} className={input} /></div>
        </div>
      </div>

      {/* Stock */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Stock & État</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className={label}>Qté totale *</label>
            <input required type="number" min="0" value={form.quantity_total ?? 1} onChange={e => set('quantity_total', parseInt(e.target.value))} className={input} /></div>
          <div><label className={label}>Qté disponible *</label>
            <input required type="number" min="0" value={form.quantity_available ?? 1} onChange={e => set('quantity_available', parseInt(e.target.value))} className={input} /></div>
          <div><label className={label}>En utilisation</label>
            <input type="number" min="0" value={form.quantity_in_use ?? 0} onChange={e => set('quantity_in_use', parseInt(e.target.value))} className={input} /></div>
          <div><label className={label}>Seuil réapprovisionnement</label>
            <input type="number" min="0" value={form.reorder_threshold ?? ''} onChange={e => set('reorder_threshold', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} /></div>
          <div><label className={label}>État *</label>
            <select value={form.condition} onChange={e => set('condition', e.target.value as ItemCondition)} className={input}>
              {(Object.entries(CONDITION_LABELS) as [ItemCondition, {fr:string;color:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select></div>
          <div><label className={label}>Statut *</label>
            <select value={form.status} onChange={e => set('status', e.target.value as ItemStatus)} className={input}>
              {(Object.entries(STATUS_LABELS) as [ItemStatus, {fr:string;color:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select></div>
          <div><label className={label}>Prix unitaire (XAF)</label>
            <input type="number" min="0" value={form.unit_price_xaf ?? ''} onChange={e => set('unit_price_xaf', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={input} /></div>
          <div><label className={label}>Date achat</label>
            <input type="date" value={form.purchase_date ?? ''} onChange={e => set('purchase_date', e.target.value)} className={input} /></div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.is_consumable ?? false} onChange={e => set('is_consumable', e.target.checked)} className="accent-green-600" />
            Article consommable (non récupérable après usage)
          </label>
        </div>
      </div>

      {/* Localisation */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Localisation & Affectation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={label}>Lieu de stockage</label>
            <input value={form.location ?? ''} onChange={e => set('location', e.target.value)} className={input} placeholder="Salle A, Terrain 2..." /></div>
          <div><label className={label}>Affecté à</label>
            <input value={form.assigned_to ?? ''} onChange={e => set('assigned_to', e.target.value)} className={input} placeholder="U12, U16, Staff..." /></div>
          <div><label className={label}>Fournisseur</label>
            <input value={form.supplier ?? ''} onChange={e => set('supplier', e.target.value)} className={input} /></div>
          <div className="md:col-span-3"><label className={label}>Notes</label>
            <textarea rows={2} value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} className={input} /></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        {isEdit && (confirmDelete ? (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <span className="text-sm text-red-700">Supprimer cet article ?</span>
            <button type="button" onClick={handleDelete} disabled={deleting} className="text-sm font-semibold text-red-600">
              {deleting ? <Loader2 size={14} className="animate-spin"/> : 'Confirmer'}
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="text-sm text-gray-500">Annuler</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-4 py-2 rounded-lg transition">
            Supprimer
          </button>
        ))}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Annuler</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  )
}
