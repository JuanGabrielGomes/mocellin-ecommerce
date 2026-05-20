import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import type { RelatedOption } from '@/components/admin/ProductForm'

export const metadata = { title: 'Novo produto — Admin Mocellin' }

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name')
    .order('name')

  const allProducts: RelatedOption[] = data ?? []

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-julius text-2xl tracking-wider text-mj-text">NOVO PRODUTO</h1>
        <p className="mt-1 font-mulish text-sm text-mj-text-muted">
          Preencha os dados e clique em Criar produto.
        </p>
      </div>
      <ProductForm allProducts={allProducts} />
    </div>
  )
}
