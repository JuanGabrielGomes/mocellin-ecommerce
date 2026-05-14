import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import type { RelatedOption } from '@/components/admin/ProductForm'
import type { ProductType } from '@/types'

export const metadata = { title: 'Editar produto — Admin Mocellin' }

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: allData }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single<ProductType>(),
    supabase.from('products').select('id, name').order('name'),
  ])

  if (!product) notFound()

  const allProducts: RelatedOption[] = (allData ?? []).filter((p) => p.id !== id)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-cormorant text-3xl font-semibold text-mocellin-dark">
          Editar produto
        </h1>
        <p className="mt-1 font-dm-sans text-sm text-mocellin-dark/50 line-clamp-1">
          {product.name}
        </p>
      </div>
      <ProductForm product={product} allProducts={allProducts} />
    </div>
  )
}
