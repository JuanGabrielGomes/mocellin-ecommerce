'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

type MediaItem =
  | { type: 'image'; url: string; position: string }
  | { type: 'video'; url: string }

interface ProductGalleryProps {
  images: string[]
  videos: string[]
  imagePositions?: string[] | null
}

export function ProductGallery({ images, videos, imagePositions }: ProductGalleryProps) {
  const media: MediaItem[] = [
    ...images.map((url, i): MediaItem => ({
      type: 'image',
      url,
      position: imagePositions?.[i] ?? 'center',
    })),
    ...videos.map((url): MediaItem => ({ type: 'video', url })),
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const active = media[activeIndex]
  const total = media.length

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + total) % total),
    [total],
  )
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % total),
    [total],
  )

  // Teclado no lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, prev, next])

  // Bloqueia scroll do body quando lightbox aberto
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 50) return
    delta > 0 ? prev() : next()
  }

  if (total === 0) return <div className="aspect-square w-full bg-mj-page" />

  return (
    <>
      <div className="flex flex-col items-center gap-3">

        {/* ── Imagem / vídeo principal ──────────────────────── */}
        <div
          className="group relative aspect-square w-full select-none overflow-hidden bg-mj-page"
          style={{ cursor: active.type === 'image' ? 'zoom-in' : 'default' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => active.type === 'image' && setLightboxOpen(true)}
        >
          {active.type === 'image' ? (
            <Image
              src={active.url}
              alt="Imagem do produto"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
              style={{ objectPosition: active.position }}
              priority
            />
          ) : (
            <video
              key={active.url}
              src={active.url}
              controls
              className="h-full w-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Setas — desktop, aparecem no hover */}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex h-8 w-8 items-center justify-center bg-mj-surface/80 text-mj-text opacity-0 transition-opacity group-hover:opacity-100 hover:bg-mj-surface"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Próxima foto"
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex h-8 w-8 items-center justify-center bg-mj-surface/80 text-mj-text opacity-0 transition-opacity group-hover:opacity-100 hover:bg-mj-surface"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* ── Miniaturas circulares — mobile e desktop ─────── */}
        {total > 1 && (
          <div className="flex w-full justify-center gap-2.5 overflow-x-auto pb-1">
            {media.map((item, i) =>
              item.type === 'image' ? (
                <button
                  key={i}
                  type="button"
                  aria-label={`Foto ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                  className={[
                    'relative h-14 w-14 shrink-0 rounded-full overflow-hidden border-2 transition-all duration-200',
                    i === activeIndex
                      ? 'border-mj-btn scale-105'
                      : 'border-transparent hover:border-mj-border',
                  ].join(' ')}
                >
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                    style={{ objectPosition: item.position }}
                  />
                </button>
              ) : (
                /* thumb de vídeo com anel giratório */
                <div key={i} className="relative h-14 w-14 shrink-0">
                  <span
                    className="pointer-events-none absolute -inset-[3px] z-10 animate-spin rounded-full"
                    style={{
                      border: '2px solid transparent',
                      borderTopColor: 'var(--color-mj-btn)',
                      borderRightColor: 'rgba(0,0,0,0.18)',
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Vídeo do produto"
                    onClick={() => setActiveIndex(i)}
                    className={[
                      'relative h-full w-full rounded-full overflow-hidden border-2 transition-colors',
                      i === activeIndex ? 'border-mj-btn' : 'border-transparent hover:border-mj-border',
                    ].join(' ')}
                  >
                    <div className="flex h-full w-full items-center justify-center bg-mj-overlay">
                      <Play size={14} className="text-white" fill="white" />
                    </div>
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────── */}
      {lightboxOpen && active.type === 'image' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualizar imagem"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Fechar */}
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 p-2 text-white/60 transition-colors hover:text-white"
          >
            <X size={22} />
          </button>

          {/* Contador */}
          {total > 1 && (
            <span className="absolute left-4 top-5 font-mulish text-xs text-white/40">
              {activeIndex + 1} / {total}
            </span>
          )}

          {/* Imagem em tela cheia */}
          <div
            className="relative h-[85vh] w-[85vw] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.url}
              alt="Imagem do produto"
              fill
              sizes="85vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Setas lightbox */}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-white/60 transition-colors hover:text-white"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                aria-label="Próxima foto"
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/60 transition-colors hover:text-white"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Dots lightbox */}
          {total > 1 && (
            <div className="absolute bottom-5 flex gap-1.5">
              {media.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i) }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
