'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

type MediaItem = { type: 'image'; url: string } | { type: 'video'; url: string }

interface ProductGalleryProps {
  images: string[]
  videos: string[]
}

export function ProductGallery({ images, videos }: ProductGalleryProps) {
  const media: MediaItem[] = [
    ...images.map((url): MediaItem => ({ type: 'image', url })),
    ...videos.map((url): MediaItem => ({ type: 'video', url })),
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const active = media[activeIndex]

  if (media.length === 0) {
    return <div className="aspect-square w-full bg-mj-cream" />
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Principal */}
      <div className="relative aspect-square w-full overflow-hidden bg-mj-cream">
        {active.type === 'image' ? (
          <Image
            src={active.url}
            alt="Imagem do produto"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        ) : (
          <video
            key={active.url}
            src={active.url}
            controls
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Miniaturas */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver ${item.type === 'image' ? 'foto' : 'vídeo'} ${i + 1}`}
              className={[
                'relative h-16 w-16 shrink-0 overflow-hidden border-2 transition-colors',
                activeIndex === i
                  ? 'border-mj-black'
                  : 'border-transparent hover:border-mj-border',
              ].join(' ')}
            >
              {item.type === 'image' ? (
                <Image src={item.url} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-mj-black">
                  <Play size={18} className="text-white" fill="white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
