import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductActions } from '@/components/product/ProductActions'
import { ProductCard } from '@/components/product/ProductCard'
import { Accordion } from '@/components/ui/Accordion'
import type { ProductType, ProductCategory } from '@/types'

const categoryLabel: Record<ProductCategory, string> = {
  brincos: 'Brincos',
  aneis: 'Anéis',
  relogios: 'Relógios',
  colares: 'Colares',
  oculos: 'Óculos',
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Produto | Mocellin Joias' }

  return {
    title: `${data.name} | Mocellin Joias`,
    description: data.description ?? undefined,
  }
}

export default async function ProdutoPage({ params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const related: ProductType[] =
    product.related_ids?.length
      ? ((await supabase
          .from('products')
          .select('*')
          .in('id', product.related_ids)
          .eq('status', 'disponivel')).data ?? [])
      : []

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Layout principal */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        {/* Galeria */}
        <div className="w-full lg:w-1/2">
          <ProductGallery images={product.images ?? []} videos={product.videos ?? []} />
        </div>

        {/* Detalhes */}
        <div className="flex w-full flex-col gap-5 lg:w-1/2">
          <div>
            <span className="font-dm-sans text-xs uppercase tracking-widest text-mocellin-dark/50">
              {categoryLabel[product.category as ProductCategory]}
            </span>
            <h1 className="mt-1 font-cormorant text-3xl font-semibold leading-tight text-mocellin-dark md:text-4xl">
              {product.name}
            </h1>
          </div>

          <p className="font-dm-sans text-2xl font-semibold text-mocellin-dark">
            {brl.format(product.price)}
          </p>

          {product.description && (
            <p className="font-dm-sans text-sm leading-relaxed text-mocellin-dark/70">
              {product.description}
            </p>
          )}

          <ProductActions product={product as ProductType} />

          {product.details && (
            <Accordion title="Detalhes do produto">{product.details}</Accordion>
          )}
        </div>
      </div>

      {/* Produtos relacionados */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-cormorant text-2xl font-semibold text-mocellin-dark sm:text-3xl">
            Você também pode gostar
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
