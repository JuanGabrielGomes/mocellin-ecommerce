'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ProductType } from '@/types'
import { useCartStore } from '@/lib/cart/store'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const categoryLabel: Record<ProductType['category'], string> = {
  brincos: 'Brincos', aneis: 'Anéis', relogios: 'Relógios',
  colares: 'Colares', oculos: 'Óculos',
}

export function ProductCard({ product }: { product: ProductType }) {
  const addItem = useCartStore((s) => s.addItem)
  const esgotado = product.status === 'esgotado'

  return (
    <Link href={`/produto/${product.id}`} className="group flex flex-col bg-mj-white">
      {/* Imagem */}
      <div className="relative aspect-square w-full overflow-hidden bg-mj-cream">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-mj-beige/30" />
        )}
        {esgotado && (
          <span className="absolute top-3 left-3 bg-mj-black/80 px-2.5 py-1 font-mulish text-[10px] uppercase tracking-wider text-white">
            Esgotado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-1 p-4">
        <span className="font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-taupe">
          {categoryLabel[product.category]}
        </span>
        <h3 className="font-julius text-base leading-snug text-mj-black">
          {product.name}
        </h3>
        <p className="mt-auto pt-3 font-mulish text-sm font-medium text-mj-black">
          {brl.format(product.price)}
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!esgotado) addItem(product) }}
          disabled={esgotado}
          className={[
            'w-full py-3 font-mulish text-xs uppercase tracking-[0.15em] transition-all',
            esgotado
              ? 'cursor-not-allowed bg-mj-border text-mj-taupe'
              : 'bg-mj-black text-white hover:bg-mj-brown active:scale-[.98]',
          ].join(' ')}
        >
          {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </Link>
  )
}
