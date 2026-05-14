// Espelha exatamente o schema do Supabase
export type ProductCategory = 'brincos' | 'aneis' | 'relogios' | 'colares' | 'oculos'
export type ProductStatus = 'disponivel' | 'esgotado'

export interface ProductType {
  id: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  status: ProductStatus
  featured: boolean
  images: string[]
  videos: string[] | null
  details: string | null
  related_ids: string[] | null
  created_at: string
  updated_at: string
}

// O que fica no carrinho — produto resolvido + quantidade
export interface CartItemType {
  product: ProductType
  quantity: number
}

// Dados do comprador coletados no checkout
export interface CheckoutFormType {
  name: string
  phone: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  delivery: 'envio' | 'retirada'
  payment: 'pix' | 'cartao' | 'dinheiro'
}

// Payload final que gera a mensagem do WhatsApp
export interface OrderPayloadType {
  items: CartItemType[]
  form: CheckoutFormType
  subtotal: number
  shipping: number | null   // null = retirada no local
  shippingName: string      // ex: "SEDEX", "PAC", "Retirada no local"
  total: number
}
