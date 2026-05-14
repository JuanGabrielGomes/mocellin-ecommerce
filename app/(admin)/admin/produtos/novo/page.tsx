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
        <h1 className="font-cormorant text-3xl font-semibold text-mocellin-dark">Novo produto</h1>
        <p className="mt-1 font-dm-sans text-sm text-mocellin-dark/50">
          Preencha os dados e clique em Criar produto.
        </p>
      </div>
      <ProductForm allProducts={allProducts} />
    </div>
  )
}
