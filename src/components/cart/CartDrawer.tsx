'use client'

import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, addItem, removeItem, updateQuantity, subtotal } = useCartStore()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-mocellin-dark/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Carrinho"
        className={[
          'fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-mocellin-white shadow-xl',
          'transition-transform duration-300 ease-in-out',
          'sm:max-w-md',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-mocellin-beige px-4 py-4">
          <h2 className="font-cormorant text-2xl font-semibold text-mocellin-dark">
            Carrinho
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="rounded-full p-1 text-mocellin-dark/50 transition-colors hover:text-mocellin-dark"
          >
            <X size={22} />
          </button>
        </div>

        {/* Conteúdo */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-mocellin-dark/30">
            <ShoppingBag size={48} strokeWidth={1.25} />
            <p className="font-dm-sans text-sm">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-mocellin-beige overflow-y-auto px-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 py-4">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 shrink-0 rounded-xl bg-mocellin-beige" />
                  )}

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-dm-sans text-sm font-medium leading-snug text-mocellin-dark">
                        {product.name}
                      </p>
                      <button
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remover ${product.name}`}
                        className="shrink-0 rounded p-0.5 text-mocellin-dark/30 transition-colors hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-mocellin-beige px-2 py-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Diminuir quantidade"
                          className="text-mocellin-dark/50 transition-colors hover:text-mocellin-dark"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center font-dm-sans text-sm tabular-nums text-mocellin-dark">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addItem(product)}
                          aria-label="Aumentar quantidade"
                          className="text-mocellin-dark/50 transition-colors hover:text-mocellin-dark"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <p className="font-dm-sans text-sm font-semibold text-mocellin-dark">
                        {brl.format(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="space-y-4 border-t border-mocellin-beige px-4 py-5">
              <div className="flex justify-between">
                <span className="font-dm-sans text-sm text-mocellin-dark/50">Subtotal</span>
                <span className="font-dm-sans text-sm font-semibold text-mocellin-dark">
                  {brl.format(subtotal())}
                </span>
              </div>
              <p className="font-dm-sans text-xs text-mocellin-dark/40">
                Frete e forma de pagamento calculados no próximo passo.
              </p>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full rounded-xl bg-mocellin-gold py-3 text-center font-dm-sans text-sm font-medium text-white transition-all hover:bg-mocellin-gold-light active:scale-[.98]"
              >
                Finalizar pedido
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
