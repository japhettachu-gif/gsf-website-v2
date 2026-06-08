'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Send, X } from 'lucide-react'
import type { NewsArticle, ArticleStatus } from '@/types/news'
import { createArticle, updateArticle, publishArticle, deleteArticle, slugify } from '@/lib/news'

interface ArticleFormProps { article?: NewsArticle }

const EMPTY: Partial<NewsArticle> = {
  title_fr: '', title_en: '', slug: '',
  excerpt_fr: '', excerpt_en: '',
  body_fr: '', body_en: '',
  cover_url: '', author_name: '',
  status: 'draft', is_featured: false, tags: [],
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const isEdit = !!article
  const [form, setForm] = useState<Partial<NewsArticle>>(article ?? EMPTY)
  const [tags, setTags] = useState((article?.tags ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof NewsArticle>(key: K, value: NewsArticle[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave(publish = false) {
    if (publish) setPublishing(true); else setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        ...(publish ? { status: 'published' as ArticleStatus, published_at: new Date().toISOString() } : {}),
      }
      if (isEdit && article) {
        await updateArticle(article.id, payload)
        if (publish) await publishArticle(article.id)
      } else {
        await createArticle(payload)
      }
      router.push('/admin/news')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally { setSaving(false); setPublishing(false) }
  }

  async function handleDelete() {
    if (!article) return
    setDeleting(true)
    try { await deleteArticle(article.id); router.push('/admin/news'); router.refresh() }
    catch { setDeleting(false); setConfirmDelete(false) }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  const lbl = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2"><X size={16} className="mt-0.5 shrink-0"/>{error}</div>}

      {/* Identité */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Identité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lbl}>Titre (FR) *</label>
            <input required value={form.title_fr ?? ''} onChange={e => { set('title_fr', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }} className={input} /></div>
          <div><label className={lbl}>Titre (EN)</label>
            <input value={form.title_en ?? ''} onChange={e => set('title_en', e.target.value)} className={input} /></div>
          <div><label className={lbl}>Slug URL *</label>
            <input required value={form.slug ?? ''} onChange={e => set('slug', slugify(e.target.value))} className={input} /></div>
          <div><label className={lbl}>Auteur</label>
            <input value={form.author_name ?? ''} onChange={e => set('author_name', e.target.value)} className={input} /></div>
          <div><label className={lbl}>Accroche (FR)</label>
            <textarea rows={2} value={form.excerpt_fr ?? ''} onChange={e => set('excerpt_fr', e.target.value)} className={input} /></div>
          <div><label className={lbl}>Accroche (EN)</label>
            <textarea rows={2} value={form.excerpt_en ?? ''} onChange={e => set('excerpt_en', e.target.value)} className={input} /></div>
          <div><label className={lbl}>Image de couverture (URL)</label>
            <input type="url" value={form.cover_url ?? ''} onChange={e => set('cover_url', e.target.value)} className={input} /></div>
          <div><label className={lbl}>Tags (séparés par virgule)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className={input} placeholder="actualité, boot-camp, résultats..." /></div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.is_featured ?? false} onChange={e => set('is_featured', e.target.checked)} className="accent-yellow-500" />
            ⭐ Article à la une
          </label>
        </div>
      </div>

      {/* Corps FR */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Contenu (FR)</h2>
        <textarea rows={12} value={form.body_fr ?? ''} onChange={e => set('body_fr', e.target.value)}
          className={input} placeholder="Rédigez votre article en français..." />
      </div>

      {/* Corps EN */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Contenu (EN)</h2>
        <textarea rows={12} value={form.body_en ?? ''} onChange={e => set('body_en', e.target.value)}
          className={input} placeholder="Write your article in English..." />
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
          <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-4 py-2 rounded-lg transition">Supprimer</button>
        ))}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Annuler</button>
          <button type="button" onClick={() => handleSave(false)} disabled={saving || publishing}
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>}
            {saving ? 'Sauvegarde...' : 'Brouillon'}
          </button>
          <button type="button" onClick={() => handleSave(true)} disabled={saving || publishing}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
            {publishing ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>}
            {publishing ? 'Publication...' : 'Publier'}
          </button>
        </div>
      </div>
    </div>
  )
}
