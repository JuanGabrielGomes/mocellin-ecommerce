'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  value: string
  label: string
  image: string
}

interface Props {
  categories: Category[]
  intervalMs?: number
}

export function CategoryCarousel({ categories, intervalMs = 2800 }: Props) {
  const [index, setIndex]     = useState(0)
  const [animated, setAnimated] = useState(true)
  const [visible, setVisible] = useState(4)
  const paused = useRef(false)

  /* ── responsive: 3 no mobile, 4 no desktop ── */
  useEffect(() => {
    const update = () => {
      const v = window.innerWidth < 640 ? 3 : 4
      setVisible(v)
      setIndex(0)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  /* ── track estendido para loop infinito ── */
  const extended = [...categories, ...categories.slice(0, visible)]
  const pct = 100 / visible   // largura de cada item em %

  /* ── auto-advance ── */
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setIndex(prev => prev + 1)
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  /* ── quando chega nos clones, snap silencioso de volta ao início ── */
  useEffect(() => {
    if (index < categories.length) return
    const snap = setTimeout(() => {
      setAnimated(false)
      setIndex(0)
    }, 600)
    return () => clearTimeout(snap)
  }, [index, categories.length])

  /* ── religa a animação após o snap ── */
  useEffect(() => {
    if (animated) return
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true))
    })
    return () => cancelAnimationFrame(raf1)
  }, [animated])

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(-${index * pct}%)`,
          transition: animated ? 'transform 600ms ease-in-out' : 'none',
        }}
      >
        {extended.map((cat, i) => (
          <Link
            key={`${cat.value}-${i}`}
            href={`/catalogo?categoria=${cat.value}`}
            className="group shrink-0 flex flex-col items-center gap-2 sm:gap-3 px-2 sm:px-3"
            style={{ width: `${pct}%` }}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-mj-cream">
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-mj-black/0 transition-colors duration-300 group-hover:bg-mj-black/10" />
            </div>
            <p className="font-mulish text-[10px] sm:text-xs uppercase tracking-[0.15em] text-mj-text/70 transition-colors group-hover:text-mj-text text-center">
              {cat.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
