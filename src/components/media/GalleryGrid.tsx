'use client'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryImage } from '@/types/media'

interface GalleryGridProps { images: GalleryImage[]; locale: string }

export function GalleryGrid({ images, locale }: GalleryGridProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  function prev() { setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : null) }
  function next() { setLightbox(i => i !== null ? (i + 1) % images.length : null) }

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {images.map((img, i) => (
          <div key={img.id} className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl bg-gray-200 hover:opacity-95 transition-opacity"
            onClick={() => setLightbox(i)}>
            <img src={img.thumbnail_url ?? img.url} alt={img.caption_fr ?? ''} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={e => { e.stopPropagation(); setLightbox(null) }} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X size={28} />
          </button>
          <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-4 text-white/70 hover:text-white">
            <ChevronLeft size={36} />
          </button>
          <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-4 text-white/70 hover:text-white">
            <ChevronRight size={36} />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl max-h-[90vh] text-center">
            <img src={images[lightbox].url} alt={images[lightbox].caption_fr ?? ''} className="max-h-[80vh] max-w-full object-contain rounded-lg" />
            {images[lightbox].caption_fr && (
              <p className="text-white/70 text-sm mt-3">{locale === 'fr' ? images[lightbox].caption_fr : images[lightbox].caption_en ?? images[lightbox].caption_fr}</p>
            )}
            <p className="text-white/40 text-xs mt-1">{lightbox + 1} / {images.length}</p>
          </div>
        </div>
      )}
    </>
  )
}
