'use client'

import { useState } from 'react'
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
  const hasSizes = product.sizes && product.sizes.length > 0

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const sizeRequired = hasSizes && !selectedSize

  function handleAddToCart() {
    addItem(product, selectedSize ?? undefined)
  }

  function handleBuyNow() {
    addItem(product, selectedSize ?? undefined)
    router.push('/checkout')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Seletor de tamanho */}
      {hasSizes && (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted">
              Tamanho
            </span>
            {selectedSize && (
              <span className="font-mulish text-xs font-medium text-mj-text">
                — {selectedSize}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes!.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                className={[
                  'min-w-[2.75rem] px-3 py-2 font-mulish text-xs transition-colors',
                  selectedSize === size
                    ? 'bg-mj-btn text-mj-btn-text'
                    : 'border border-mj-border text-mj-text-muted hover:border-mj-btn hover:text-mj-btn',
                ].join(' ')}
              >
                {size}
              </button>
            ))}
          </div>
          {sizeRequired && (
            <p className="font-mulish text-[11px] text-mj-text-muted">
              Selecione um tamanho para continuar.
            </p>
          )}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          disabled={esgotado || sizeRequired}
          className={[
            'w-full py-4 font-mulish text-xs uppercase tracking-[0.15em] transition-all',
            esgotado
              ? 'cursor-not-allowed bg-mj-border text-mj-text-muted'
              : sizeRequired
              ? 'cursor-not-allowed bg-mj-border text-mj-text-muted'
              : 'bg-mj-btn text-mj-btn-text hover:bg-mj-btn-hover active:scale-[.98]',
          ].join(' ')}
        >
          {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
        </button>

        {!esgotado && (
          <button
            onClick={handleBuyNow}
            disabled={sizeRequired}
            className={[
              'w-full border py-4 font-mulish text-xs uppercase tracking-[0.15em] transition-all',
              sizeRequired
                ? 'cursor-not-allowed border-mj-border text-mj-text-muted'
                : 'border-mj-btn text-mj-btn hover:bg-mj-btn hover:text-mj-btn-text active:scale-[.98]',
            ].join(' ')}
          >
            Comprar agora
          </button>
        )}
      </div>
    </div>
  )
}
