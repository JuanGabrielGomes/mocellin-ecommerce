'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProductType } from '@/types'
import { useCartStore } from '@/lib/cart/store'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const categoryLabel: Record<ProductType['category'], string> = {
  brincos: 'Brincos', aneis: 'Anéis', relogios: 'Relógios',
  colares: 'Colares', oculos: 'Óculos', masculino: 'Masculino',
  pulseiras: 'Pulseiras e Braceletes', berloques: 'Berloques',
  conjuntos: 'Conjuntos',
}

export function ProductCard({ product }: { product: ProductType }) {
  const addItem = useCartStore((s) => s.addItem)
  const [hovered, setHovered] = useState(false)

  const esgotado = product.status === 'esgotado'
  const preVenda = product.status === 'pre_venda'
  const hasSizes = !!(product.sizes && product.sizes.length > 0)
  const hasDiscount = product.compare_at_price != null && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0
  const hasSecondImage = product.images.length > 1

  return (
    <Link
      href={`/produto/${product.id}`}
      className="group flex h-full flex-col bg-mj-surface"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagem */}
      <div
        className={`relative aspect-square w-full overflow-hidden bg-mj-page transition-transform duration-500 ${
          hovered ? 'scale-105' : 'scale-100'
        }`}
      >
        {product.images[0] ? (
          <>
            {/* Imagem principal */}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 ${
                hovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ objectPosition: product.image_positions?.[0] ?? 'center' }}
            />

            {/* Segunda imagem — aparece no hover (crossfade) */}
            {hasSecondImage && (
              <Image
                src={product.images[1]}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-opacity duration-500 ${
                  hovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ objectPosition: product.image_positions?.[1] ?? 'center' }}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-mj-text-accent/20" />
        )}

        {esgotado && (
          <span className="absolute left-3 top-3 bg-mj-overlay/80 px-2.5 py-1 font-mulish text-[10px] uppercase tracking-wider text-white">
            Esgotado
          </span>
        )}
        {preVenda && !esgotado && (
          <span className="absolute left-3 top-3 bg-amber-500 px-2.5 py-1 font-mulish text-[10px] font-semibold uppercase tracking-wider text-white">
            Pré-venda
          </span>
        )}
        {!esgotado && !preVenda && hasDiscount && (
          <span className="absolute left-3 top-3 bg-mj-btn px-2.5 py-1 font-mulish text-[10px] font-semibold uppercase tracking-wider text-mj-btn-text">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-text-muted">
          {categoryLabel[product.category]}
        </span>
        <h3 className="h-[2.75rem] line-clamp-2 font-julius text-base leading-snug text-mj-text">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <p className="font-mulish text-sm font-medium text-mj-text">
            {brl.format(product.price)}
          </p>
          {hasDiscount && (
            <p className="font-mulish text-xs text-mj-text-muted line-through">
              {brl.format(product.compare_at_price!)}
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        {hasSizes || preVenda ? (
          // Produto com tamanhos ou pré-venda → leva para a PDP
          <span className="block w-full bg-mj-btn py-3 text-center font-mulish text-xs uppercase tracking-[0.15em] text-mj-btn-text transition-all group-hover:bg-mj-btn-hover">
            {preVenda ? 'Ver e reservar' : 'Escolher tamanho'}
          </span>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!esgotado) addItem(product) }}
            disabled={esgotado}
            className={[
              'w-full py-3 font-mulish text-xs uppercase tracking-[0.15em] transition-all',
              esgotado
                ? 'cursor-not-allowed bg-mj-border text-mj-text-muted'
                : 'bg-mj-btn text-mj-btn-text hover:bg-mj-btn-hover active:scale-[.98]',
            ].join(' ')}
          >
            {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
          </button>
        )}
      </div>
    </Link>
  )
}
