'use client'

import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, addItem, removeItem, updateQuantity, subtotal } = useCartStore()

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-mj-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        aria-label="Carrinho"
        className={[
          'fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-mj-surface shadow-2xl',
          'transition-transform duration-300 ease-in-out sm:max-w-md',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-mj-border px-6 py-5">
          <h2 className="font-julius text-lg tracking-wider text-mj-text">CARRINHO</h2>
          <button onClick={onClose} aria-label="Fechar carrinho" className="p-1 text-mj-text-muted transition-colors hover:text-mj-text">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Conteúdo */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-mj-text-muted">
            <ShoppingBag size={44} strokeWidth={1} />
            <p className="font-mulish text-sm">Seu carrinho está vazio</p>
            <button onClick={onClose} className="font-mulish text-xs uppercase tracking-[0.15em] underline underline-offset-4">
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-mj-border overflow-y-auto px-6">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="h-20 w-20 shrink-0 bg-mj-cream object-cover" />
                  ) : (
                    <div className="h-20 w-20 shrink-0 bg-mj-beige/30" />
                  )}

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mulish text-sm font-medium leading-snug text-mj-text">{product.name}</p>
                      <button onClick={() => removeItem(product.id)} aria-label={`Remover ${product.name}`} className="shrink-0 p-0.5 text-mj-text-muted transition-colors hover:text-red-500">
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-mj-border px-3 py-1.5">
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label="Diminuir" className="text-mj-text-muted hover:text-mj-text">
                          <Minus size={13} />
                        </button>
                        <span className="w-4 text-center font-mulish text-sm tabular-nums">{quantity}</span>
                        <button onClick={() => addItem(product)} aria-label="Aumentar" className="text-mj-text-muted hover:text-mj-text">
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="font-mulish text-sm font-medium text-mj-text">{brl.format(product.price * quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="space-y-4 border-t border-mj-border px-6 py-6">
              <div className="flex justify-between">
                <span className="font-mulish text-xs uppercase tracking-[0.1em] text-mj-text-muted">Subtotal</span>
                <span className="font-mulish text-sm font-medium text-mj-text">{brl.format(subtotal())}</span>
              </div>
              <p className="font-mulish text-[11px] text-mj-text-muted">Frete calculado no próximo passo.</p>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-mj-btn py-4 text-center font-mulish text-xs uppercase tracking-[0.2em] text-mj-btn-text transition-all hover:bg-mj-btn-hover active:scale-[.98]"
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
