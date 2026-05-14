'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ProductType } from '@/types'
import { useCartStore } from '@/lib/cart/store'

interface ProductCardProps {
  product: ProductType
}

const categoryLabel: Record<ProductType['category'], string> = {
  brincos: 'Brincos',
  aneis: 'Anéis',
  relogios: 'Relógios',
  colares: 'Colares',
  oculos: 'Óculos',
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const esgotado = product.status === 'esgotado'

  return (
    <Link
      href={`/produto/${product.id}`}
      className="flex flex-col bg-mocellin-white rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="relative aspect-square w-full bg-mocellin-beige">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-mocellin-beige" />
        )}

        {esgotado && (
          <span className="absolute top-3 left-3 rounded-full bg-mocellin-dark/70 px-2.5 py-1 text-xs font-medium text-white font-dm-sans">
            Esgotado
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 gap-1 p-4">
        <span className="text-xs uppercase tracking-widest text-mocellin-dark/50 font-dm-sans font-medium">
          {categoryLabel[product.category]}
        </span>
        <h3 className="font-cormorant text-xl font-semibold leading-tight text-mocellin-dark">
          {product.name}
        </h3>
        <p className="mt-auto pt-3 text-base font-semibold text-mocellin-dark font-dm-sans">
          {brl.format(product.price)}
        </p>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product) }}
          disabled={esgotado}
          className={[
            'w-full rounded-xl py-3 text-sm font-medium font-dm-sans transition-all',
            esgotado
              ? 'cursor-not-allowed bg-mocellin-gold/40 text-white'
              : 'bg-mocellin-gold text-white hover:bg-mocellin-gold-light active:scale-[.98]',
          ].join(' ')}
        >
          {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </Link>
  )
}
