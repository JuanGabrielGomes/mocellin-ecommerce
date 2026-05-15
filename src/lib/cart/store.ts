import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemType, ProductType } from '@/types'

interface CartStoreType {
  items: CartItemType[]
  addItem: (product: ProductType, size?: string) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string) => void
  clearCart: () => void
  subtotal: () => number
  itemCount: () => number
}

function sameItem(item: CartItemType, productId: string, size?: string) {
  return item.product.id === productId && item.size === size
}

export const useCartStore = create<CartStoreType>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size) => {
        const existing = get().items.find(i => sameItem(i, product.id, size))
        if (existing) {
          set({
            items: get().items.map(i =>
              sameItem(i, product.id, size) ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          })
        } else {
          set({ items: [...get().items, { product, quantity: 1, size }] })
        }
      },

      removeItem: (productId, size) =>
        set({ items: get().items.filter(i => !sameItem(i, productId, size)) }),

      updateQuantity: (productId, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }
        set({
          items: get().items.map(i =>
            sameItem(i, productId, size) ? { ...i, quantity } : i,
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: 'mocellin-cart' },
  ),
)
