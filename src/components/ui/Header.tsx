'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import { CartDrawer } from '@/components/cart/CartDrawer'

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount)

  useEffect(() => setMounted(true), [])

  const count = mounted ? itemCount() : 0

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 bg-mocellin-white border-b border-mocellin-beige">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Mocellin Joias — página inicial"
            className="font-cormorant text-xl font-semibold tracking-widest text-mocellin-dark sm:text-2xl"
          >
            MOCELLIN JOIAS
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label={`Carrinho${count > 0 ? ` — ${count} ${count === 1 ? 'item' : 'itens'}` : ''}`}
            className="relative rounded-full p-2 text-mocellin-dark transition-colors hover:text-mocellin-gold"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />

            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mocellin-gold font-dm-sans text-[10px] font-medium leading-none text-white"
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
