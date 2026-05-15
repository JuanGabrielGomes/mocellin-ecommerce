'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ProductType } from '@/types'
import { useCartStore } from '@/lib/cart/store'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const categoryLabel: Record<ProductType['category'], string> = {
  brincos: 'Brincos', aneis: 'Anéis', relogios: 'Relógios',
  colares: 'Colares', oculos: 'Óculos', masculino: 'Masculino',
  pulseiras: 'Pulseiras e Braceletes', berloques: 'Berloques',
}

export function ProductCard({ product }: { product: ProductType }) {
  const addItem = useCartStore((s) => s.addItem)
  const esgotado = product.status === 'esgotado'
  const hasDiscount = product.compare_at_price != null && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0

  return (
    <Link href={`/produto/${product.id}`} className="group flex h-full flex-col bg-mj-surface">
      {/* Imagem */}
      <div className="relative aspect-square w-full overflow-hidden bg-mj-page">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: product.image_positions?.[0] ?? 'center' }}
          />
        ) : (
          <div className="absolute inset-0 bg-mj-text-accent/20" />
        )}
        {esgotado && (
          <span className="absolute top-3 left-3 bg-mj-overlay/80 px-2.5 py-1 font-mulish text-[10px] uppercase tracking-wider text-white">
            Esgotado
          </span>
        )}
        {!esgotado && hasDiscount && (
          <span className="absolute top-3 left-3 bg-mj-btn px-2.5 py-1 font-mulish text-[10px] font-semibold uppercase tracking-wider text-mj-btn-text">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-1 p-4">
        <span className="font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-text-muted">
          {categoryLabel[product.category]}
        </span>
        <h3 className="h-[2.75rem] line-clamp-2 font-julius text-base leading-snug text-mj-text">
          {product.name}
        </h3>
        <div className="mt-auto pt-3 flex items-baseline gap-2">
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
      </div>
    </Link>
  )
}
