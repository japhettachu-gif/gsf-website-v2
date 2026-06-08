'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X } from 'lucide-react'
import type { Partner, PartnerTier } from '@/types/partners'
import { TIER_CONFIG } from '@/types/partners'
import { createPartner, updatePartner, deletePartner } from '@/lib/partners'

interface PartnerFormProps { partner?: Partner }

export function PartnerForm({ partner }: PartnerFormProps) {
  const router = useRouter()
  const isEdit = !!partner
  const [form, setForm] = useState<Partial<Partner>>(partner ?? { name: '', tier: 'supporter', active: true, show_on_website: true })
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof Partner>(key: K, value: Partner[K]) { setForm(p => ({ ...p, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      if (isEdit && partner) await updatePartner(partner.id, form)
      else await createPartner(form)
      router.push('/admin/partners'); router.refresh()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Erreur') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!partner) return; setDeleting(true)
    try { await deletePartner(partner.id); router.push('/admin/partners'); router.refresh() }
    catch { setDeleting(false); setConfirmDelete(false) }
  }

  const inp = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const lbl = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2"><X size={16} className="mt-0.5 shrink-0"/>{error}</div>}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Partenaire</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lbl}>Nom *</label><input required value={form.name ?? ''} onChange={e => set('name', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Niveau *</label>
            <select value={form.tier} onChange={e => set('tier', e.target.value as PartnerTier)} className={inp}>
              {(Object.entries(TIER_CONFIG) as [PartnerTier, {fr:string}][]).map(([k,v]) => <option key={k} value={k}>{v.fr}</option>)}
            </select></div>
          <div><label className={lbl}>Logo (URL)</label><input type="url" value={form.logo_url ?? ''} onChange={e => set('logo_url', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Site web</label><input type="url" value={form.website ?? ''} onChange={e => set('website', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Description (FR)</label><textarea rows={2} value={form.description_fr ?? ''} onChange={e => set('description_fr', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Description (EN)</label><textarea rows={2} value={form.description_en ?? ''} onChange={e => set('description_en', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Contact nom</label><input value={form.contact_name ?? ''} onChange={e => set('contact_name', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Contact email</label><input type="email" value={form.contact_email ?? ''} onChange={e => set('contact_email', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Début partenariat</label><input type="date" value={form.partnership_start ?? ''} onChange={e => set('partnership_start', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Ordre affichage</label><input type="number" value={form.sort_order ?? ''} onChange={e => set('sort_order', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={inp} /></div>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.active ?? true} onChange={e => set('active', e.target.checked)} className="accent-green-600" />Actif
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.show_on_website ?? true} onChange={e => set('show_on_website', e.target.checked)} className="accent-green-600" />Afficher sur le site
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        {isEdit && (confirmDelete ? (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <span className="text-sm text-red-700">Supprimer ?</span>
            <button type="button" onClick={handleDelete} disabled={deleting} className="text-sm font-semibold text-red-600">{deleting ? <Loader2 size={14} className="animate-spin"/> : 'Confirmer'}</button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="text-sm text-gray-500">Annuler</button>
          </div>
        ) : <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg">Supprimer</button>)}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Annuler</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}{saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  )
}
