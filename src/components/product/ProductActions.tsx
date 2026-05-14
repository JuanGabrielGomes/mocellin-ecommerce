'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart/store'
import type { ProductType } from '@/types'

interface ProductActionsProps {
  product: ProductType
}

export function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()
  const esgotado = product.status === 'esgotado'

  function handleBuyNow() {
    addItem(product)
    router.push('/checkout')
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => addItem(product)}
        disabled={esgotado}
        className={[
          'w-full rounded-xl py-3.5 font-dm-sans text-sm font-medium transition-all',
          esgotado
            ? 'cursor-not-allowed bg-mocellin-gold/40 text-white'
            : 'bg-mocellin-gold text-white hover:bg-mocellin-gold-light active:scale-[.98]',
        ].join(' ')}
      >
        {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
      </button>

      {!esgotado && (
        <button
          onClick={handleBuyNow}
          className="w-full rounded-xl border border-mocellin-dark py-3.5 font-dm-sans text-sm font-medium text-mocellin-dark transition-all hover:bg-mocellin-dark hover:text-mocellin-white active:scale-[.98]"
        >
          Comprar agora
        </button>
      )}
    </div>
  )
}
