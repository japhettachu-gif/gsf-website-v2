'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X } from 'lucide-react'
import type { Alumni } from '@/types/partners'
import { createAlumni, updateAlumni, deleteAlumni } from '@/lib/partners'

interface AlumniFormProps { alumni?: Alumni }

export function AlumniForm({ alumni }: AlumniFormProps) {
  const router = useRouter()
  const isEdit = !!alumni
  const [form, setForm] = useState<Partial<Alumni>>(alumni ?? { name: '', active: true, show_on_website: true, is_featured: false })
  const [achievements, setAchievements] = useState((alumni?.achievements ?? []).join('\n'))
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof Alumni>(key: K, value: Alumni[K]) { setForm(p => ({ ...p, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      const payload = { ...form, achievements: achievements.split('\n').map(s => s.trim()).filter(Boolean) }
      if (isEdit && alumni) await updateAlumni(alumni.id, payload)
      else await createAlumni(payload)
      router.push('/admin/alumni'); router.refresh()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Erreur') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!alumni) return; setDeleting(true)
    try { await deleteAlumni(alumni.id); router.push('/admin/alumni'); router.refresh() }
    catch { setDeleting(false); setConfirmDelete(false) }
  }

  const inp = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const lbl = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2"><X size={16} className="mt-0.5 shrink-0"/>{error}</div>}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Identité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lbl}>Nom complet *</label><input required value={form.name ?? ''} onChange={e => set('name', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Poste</label><input value={form.position ?? ''} onChange={e => set('position', e.target.value)} className={inp} placeholder="Attaquant, Gardien..." /></div>
          <div><label className={lbl}>Photo (URL)</label><input type="url" value={form.photo_url ?? ''} onChange={e => set('photo_url', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Années à la GSF</label><input value={form.years_at_gsf ?? ''} onChange={e => set('years_at_gsf', e.target.value)} className={inp} placeholder="2018-2022" /></div>
          <div><label className={lbl}>Club actuel</label><input value={form.current_club ?? ''} onChange={e => set('current_club', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Pays actuel</label><input value={form.current_country ?? ''} onChange={e => set('current_country', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Instagram</label><input type="url" value={form.instagram_url ?? ''} onChange={e => set('instagram_url', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Ordre affichage</label><input type="number" value={form.sort_order ?? ''} onChange={e => set('sort_order', e.target.value ? parseInt(e.target.value) : undefined as unknown as number)} className={inp} /></div>
          <div><label className={lbl}>Histoire (FR)</label><textarea rows={3} value={form.story_fr ?? ''} onChange={e => set('story_fr', e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Histoire (EN)</label><textarea rows={3} value={form.story_en ?? ''} onChange={e => set('story_en', e.target.value)} className={inp} /></div>
          <div className="md:col-span-2"><label className={lbl}>Accomplissements (un par ligne)</label><textarea rows={3} value={achievements} onChange={e => setAchievements(e.target.value)} className={inp} placeholder={"Champion Cameroun U17 2021\nMeilleur buteur tournoi GSF 2020"} /></div>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.show_on_website ?? true} onChange={e => set('show_on_website', e.target.checked)} className="accent-green-600" />Afficher sur le site
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.is_featured ?? false} onChange={e => set('is_featured', e.target.checked)} className="accent-yellow-500" />⭐ Parcours remarquable
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
