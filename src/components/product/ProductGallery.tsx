'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  videos: string[]
  imagePositions?: string[] | null
}

// ── Miniatura circular de vídeo ───────────────────────────────────
// Usa <video preload="metadata"> para capturar um frame real do vídeo.
// A ring giratória fica DENTRO do wrapper (inset-0) para não criar overflow.
function VideoThumb({ url, onClick }: { url: string; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleLoadedMetadata() {
    const v = videoRef.current
    if (!v) return
    // Busca ~20% da duração como thumbnail (mínimo 0.5s)
    v.currentTime = v.duration ? Math.min(v.duration * 0.2, v.duration - 0.1) : 0.5
  }

  return (
    // h-16 w-16 contém ring + botão sem overflow → sem scrollbar
    <div className="relative h-16 w-16 shrink-0">
      {/* Ring giratória — inset-0, não vaza fora do container */}
      <span
        className="pointer-events-none absolute inset-0 z-10 animate-spin rounded-full"
        style={{
          border: '2px solid transparent',
          borderTopColor: 'var(--color-mj-btn)',
          borderRightColor: 'rgba(0,0,0,0.18)',
        }}
      />
      {/* Botão com margem de 3px para não sobrepor a ring */}
      <button
        type="button"
        aria-label="Vídeo do produto"
        onClick={onClick}
        className="absolute inset-[3px] rounded-full overflow-hidden hover:opacity-85 transition-opacity"
      >
        {/* Frame do vídeo como preview */}
        <video
          ref={videoRef}
          src={url}
          preload="metadata"
          muted
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay semitransparente + ícone play */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play size={12} className="text-white drop-shadow-sm" fill="white" />
        </div>
      </button>
    </div>
  )
}

export function ProductGallery({ images, videos, imagePositions }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [videoModal, setVideoModal] = useState<string | null>(null)
  const touchStartX = useRef<number | null>(null)

  const total = images.length

  const prev = useCallback(
    () => setActiveImage((i) => (i - 1 + total) % total),
    [total],
  )
  const next = useCallback(
    () => setActiveImage((i) => (i + 1) % total),
    [total],
  )

  // Teclado no lightbox de imagens
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

  // Teclado no modal de vídeo
  useEffect(() => {
    if (!videoModal) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVideoModal(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [videoModal])

  // Bloqueia scroll do body quando qualquer overlay está aberto
  useEffect(() => {
    document.body.style.overflow = lightboxOpen || videoModal !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen, videoModal])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 50) return
    if (delta > 0) { prev() } else { next() }
  }

  if (images.length === 0 && videos.length === 0) {
    return <div className="aspect-square w-full bg-mj-page" />
  }

  const activeUrl = images[activeImage] ?? ''
  const activePosition = imagePositions?.[activeImage] ?? 'center'

  return (
    <>
      <div className="flex flex-col items-center gap-3">

        {/* ── Imagem principal ─────────────────────────────── */}
        {images.length > 0 && (
          <div
            className="group relative aspect-square w-full select-none overflow-hidden bg-mj-page"
            style={{ cursor: 'zoom-in' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={activeUrl}
              alt="Imagem do produto"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
              style={{ objectPosition: activePosition }}
              priority
            />

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
        )}

        {/* ── Miniaturas circulares — somente vídeos ───────── */}
        {videos.length > 0 && (
          <div className="flex w-full justify-center gap-3">
            {videos.map((url, i) => (
              <VideoThumb key={i} url={url} onClick={() => setVideoModal(url)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox de imagens ───────────────────────────────── */}
      {lightboxOpen && images.length > 0 && (
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
              {activeImage + 1} / {total}
            </span>
          )}

          {/* Imagem em tela cheia */}
          <div
            className="relative h-[85vh] w-[85vw] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeUrl}
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
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i) }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeImage ? 'w-4 bg-white' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Modal de vídeo ───────────────────────────────────── */}
      {videoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo do produto"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 px-4"
          onClick={() => setVideoModal(null)}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setVideoModal(null)}
            className="absolute right-4 top-4 z-10 p-2 text-white/60 transition-colors hover:text-white"
          >
            <X size={22} />
          </button>

          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              key={videoModal}
              src={videoModal}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[85vh] rounded"
            />
          </div>
        </div>
      )}
    </>
  )
}
