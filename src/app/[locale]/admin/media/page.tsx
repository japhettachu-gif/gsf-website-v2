'use client'
import { useState, useRef } from 'react'
import { Plus, Trash2, Eye, EyeOff, Star, Upload, Loader2 } from 'lucide-react'
import { uploadImage, createImage, updateImage, deleteImage } from '@/lib/media'

export default function AdminMediaPage() {
  const [uploading, setUploading] = useState(false)
  const [album, setAlbum] = useState('general')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true); setError(null)
    try {
      for (const file of files) {
        const url = await uploadImage(file, album)
        await createImage({ url, album, caption_fr: caption || null, show_on_website: true, is_featured: false })
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur upload')
    } finally { setUploading(false) }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Galerie & Médias</h1>

      {/* Upload zone */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Ajouter des photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Album</label>
            <input value={album} onChange={e => setAlbum(e.target.value)} placeholder="general, bootcamp-2026..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Légende (optionnel)</label>
            <input value={caption} onChange={e => setCaption(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${uploading ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50/50'}`}>
          {uploading ? (
            <><Loader2 size={32} className="text-green-500 animate-spin mb-2" /><p className="text-sm text-green-600">Upload en cours...</p></>
          ) : (
            <><Upload size={32} className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-600">Cliquer pour sélectionner des photos</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — plusieurs fichiers acceptés</p></>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-3">✅ Photos uploadées avec succès</p>}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        💡 Pour gérer les photos (supprimer, modifier l'album, mettre en avant), utilisez le <strong>Table Editor</strong> de Supabase sur la table <code className="bg-blue-100 px-1 rounded">gallery_images</code>.
      </div>
    </div>
  )
}
