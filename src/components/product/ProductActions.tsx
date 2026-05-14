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
          'w-full py-4 font-mulish text-xs uppercase tracking-[0.15em] transition-all',
          esgotado
            ? 'cursor-not-allowed bg-mj-border text-mj-text-muted'
            : 'bg-mj-btn text-mj-btn-text hover:bg-mj-btn-hover active:scale-[.98]',
        ].join(' ')}
      >
        {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
      </button>

      {!esgotado && (
        <button
          onClick={handleBuyNow}
          className="w-full border border-mj-btn py-4 font-mulish text-xs uppercase tracking-[0.15em] text-mj-btn transition-all hover:bg-mj-btn hover:text-mj-btn-text active:scale-[.98]"
        >
          Comprar agora
        </button>
      )}
    </div>
  )
}
