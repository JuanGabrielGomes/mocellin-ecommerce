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
            ? 'cursor-not-allowed bg-mj-border text-mj-taupe'
            : 'bg-mj-black text-white hover:bg-mj-brown active:scale-[.98]',
        ].join(' ')}
      >
        {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
      </button>

      {!esgotado && (
        <button
          onClick={handleBuyNow}
          className="w-full border border-mj-black py-4 font-mulish text-xs uppercase tracking-[0.15em] text-mj-black transition-all hover:bg-mj-black hover:text-white active:scale-[.98]"
        >
          Comprar agora
        </button>
      )}
    </div>
  )
}
