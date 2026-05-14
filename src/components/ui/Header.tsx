'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import { CartDrawer } from '@/components/cart/CartDrawer'

export function Header({ hasBanner = false }: { hasBanner?: boolean }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const displayCount = mounted ? count : 0

  // On the homepage, the hero is a full-height dark image — use white text until scroll kicks in
  const onDark = pathname === '/' && !scrolled

  return (
    <>
      <header
        style={{ top: hasBanner ? '40px' : '0px' }}
        className={[
          'fixed inset-x-0 z-30 transition-all duration-300',
          scrolled
            ? 'bg-mj-surface/95 backdrop-blur-sm border-b border-mj-border'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <Link
            href="/"
            aria-label="Mocellin Joias — página inicial"
            className={[
              'font-julius text-base tracking-[0.25em] sm:text-lg transition-colors duration-300',
              onDark ? 'text-white' : 'text-mj-text',
            ].join(' ')}
          >
            MOCELLIN JOIAS
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/catalogo"
              className={[
                'font-mulish text-xs uppercase tracking-[0.15em] transition-colors duration-300',
                onDark
                  ? 'text-white/80 hover:text-white'
                  : 'text-mj-text/70 hover:text-mj-text',
              ].join(' ')}
            >
              Catálogo
            </Link>
          </nav>

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label={`Carrinho${displayCount > 0 ? ` — ${displayCount} ${displayCount === 1 ? 'item' : 'itens'}` : ''}`}
            className={[
              'relative p-2 transition-colors duration-300',
              onDark ? 'text-white hover:text-mj-beige' : 'text-mj-text hover:text-mj-btn-hover',
            ].join(' ')}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {displayCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mj-btn font-mulish text-[10px] font-medium leading-none text-mj-btn-text"
              >
                {displayCount > 99 ? '99+' : displayCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
