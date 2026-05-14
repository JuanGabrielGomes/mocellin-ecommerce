import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemType, ProductType } from '@/types'

interface CartStoreType {
  items: CartItemType[]
  addItem: (product: ProductType) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  subtotal: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStoreType>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existing = get().items.find(i => i.product.id === product.id)
        if (existing) {
          set({ items: get().items.map(i =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )})
        } else {
          set({ items: [...get().items, { product, quantity: 1 }] })
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter(i => i.product.id !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({ items: get().items.map(i =>
          i.product.id === productId ? { ...i, quantity } : i
        )})
      },

      clearCart: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    {
      name: 'mocellin-cart',
    }
  )
)
