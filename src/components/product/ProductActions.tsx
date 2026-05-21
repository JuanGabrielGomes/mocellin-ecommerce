'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import type { ProductType } from '@/types'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇ'.split('')

interface ProductActionsProps {
  product: ProductType
}

export function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  const esgotado   = product.status === 'esgotado'
  const preVenda   = product.status === 'pre_venda'
  const hasSizes   = !!(product.sizes && product.sizes.length > 0)
  const hasLetters = product.letter_option

  const [selectedSize,   setSelectedSize]   = useState<string | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const sizeRequired   = hasSizes   && !selectedSize
  const letterRequired = hasLetters && !selectedLetter
  const disabled       = esgotado || sizeRequired || letterRequired

  function handleAddToCart() {
    addItem(product, selectedSize ?? undefined, selectedLetter ?? undefined)
  }

  function handleBuyNow() {
    addItem(product, selectedSize ?? undefined, selectedLetter ?? undefined)
    router.push('/checkout')
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Aviso de pré-venda */}
      {preVenda && (
        <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3">
          <Clock size={14} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="font-mulish text-xs font-semibold uppercase tracking-[0.1em] text-amber-800">
              Produto em Pré-venda
            </p>
            <p className="mt-1 font-mulish text-xs leading-relaxed text-amber-700">
              O prazo de entrega especial será informado diretamente via WhatsApp após a confirmação do pedido.
            </p>
          </div>
        </div>
      )}

      {/* Seletor de tamanho */}
      {hasSizes && (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted">
              Tamanho
            </span>
            {selectedSize && (
              <span className="font-mulish text-xs font-medium text-mj-text">— {selectedSize}</span>
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

      {/* Seletor de letra */}
      {hasLetters && (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted">
              Escolha a letra
            </span>
            {selectedLetter && (
              <span className="font-mulish text-xs font-medium text-mj-text">— {selectedLetter}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {LETTERS.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                className={[
                  'h-9 w-9 font-mulish text-xs font-medium transition-colors',
                  selectedLetter === letter
                    ? 'bg-mj-btn text-mj-btn-text'
                    : 'border border-mj-border text-mj-text-muted hover:border-mj-btn hover:text-mj-btn',
                ].join(' ')}
              >
                {letter}
              </button>
            ))}
          </div>
          {letterRequired && (
            <p className="font-mulish text-[11px] text-mj-text-muted">
              Escolha uma letra para continuar.
            </p>
          )}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          disabled={disabled}
          className={[
            'w-full py-4 font-mulish text-xs uppercase tracking-[0.15em] transition-all',
            esgotado
              ? 'cursor-not-allowed bg-mj-border text-mj-text-muted'
              : disabled
              ? 'cursor-not-allowed bg-mj-border text-mj-text-muted'
              : 'bg-mj-btn text-mj-btn-text hover:bg-mj-btn-hover active:scale-[.98]',
          ].join(' ')}
        >
          {esgotado ? 'Esgotado' : preVenda ? 'Reservar — Pré-venda' : 'Adicionar ao carrinho'}
        </button>

        {!esgotado && (
          <button
            onClick={handleBuyNow}
            disabled={disabled}
            className={[
              'w-full border py-4 font-mulish text-xs uppercase tracking-[0.15em] transition-all',
              disabled
                ? 'cursor-not-allowed border-mj-border text-mj-text-muted'
                : 'border-mj-btn text-mj-btn hover:bg-mj-btn hover:text-mj-btn-text active:scale-[.98]',
            ].join(' ')}
          >
            {preVenda ? 'Finalizar reserva' : 'Comprar agora'}
          </button>
        )}
      </div>
    </div>
  )
}
