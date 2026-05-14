import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
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
    <main className="pt-20 sm:pt-24">
      {/* Breadcrumb */}
      <div className="border-b border-mj-border bg-mj-white px-5 py-4 sm:px-8">
        <nav className="mx-auto max-w-7xl">
          <ol className="flex items-center gap-2 font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
            <li><Link href="/" className="hover:text-mj-black transition-colors">Início</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/catalogo" className="hover:text-mj-black transition-colors">Catálogo</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/catalogo?categoria=${product.category}`} className="hover:text-mj-black transition-colors">{categoryLabel[product.category as ProductCategory]}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-mj-black truncate max-w-[120px] sm:max-w-none">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* Layout principal */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Galeria */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images ?? []} videos={product.videos ?? []} />
          </div>

          {/* Detalhes */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            <div>
              <span className="font-mulish text-[10px] uppercase tracking-[0.25em] text-mj-taupe">
                {categoryLabel[product.category as ProductCategory]}
              </span>
              <h1 className="mt-2 font-julius text-3xl tracking-wider text-mj-black sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <p className="font-mulish text-2xl font-medium text-mj-black">
              {brl.format(product.price)}
            </p>

            {product.description && (
              <p className="font-mulish text-sm leading-relaxed text-mj-taupe">
                {product.description}
              </p>
            )}

            <ProductActions product={product as ProductType} />

            {product.details && (
              <Accordion title="Detalhes do produto">{product.details}</Accordion>
            )}
          </div>
        </div>
      </div>

      {/* Produtos relacionados */}
      {related.length > 0 && (
        <section className="border-t border-mj-border bg-mj-cream py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10">
              <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-taupe">Seleção</p>
              <h2 className="mt-2 font-julius text-2xl tracking-wider text-mj-black sm:text-3xl">
                VOCÊ TAMBÉM PODE GOSTAR
              </h2>
            </div>
            <ul className="grid grid-cols-2 gap-px bg-mj-border sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.id} className="bg-mj-cream">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}
