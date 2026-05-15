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
  masculino: 'Masculino',
  pulseiras: 'Pulseiras e Braceletes',
  berloques: 'Berloques',
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
      <div className="border-b border-mj-border bg-mj-surface px-5 py-4 sm:px-8">
        <nav className="mx-auto max-w-7xl">
          <ol className="flex items-center gap-2 font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted">
            <li><Link href="/" className="hover:text-mj-text transition-colors">Início</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/catalogo" className="hover:text-mj-text transition-colors">Catálogo</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/catalogo?categoria=${product.category}`} className="hover:text-mj-text transition-colors">{categoryLabel[product.category as ProductCategory]}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-mj-text truncate max-w-[120px] sm:max-w-none">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* Layout principal */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Galeria */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery
              images={product.images ?? []}
              videos={product.videos ?? []}
              imagePositions={product.image_positions}
            />
          </div>

          {/* Detalhes */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            <div>
              <span className="font-mulish text-[10px] uppercase tracking-[0.25em] text-mj-text-muted">
                {categoryLabel[product.category as ProductCategory]}
              </span>
              <h1 className="mt-2 font-julius text-3xl tracking-wider text-mj-text sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="font-mulish text-2xl font-medium text-mj-text">
                {brl.format(product.price)}
              </p>
              {product.compare_at_price != null && product.compare_at_price > product.price && (
                <>
                  <p className="font-mulish text-base text-mj-text-muted line-through">
                    {brl.format(product.compare_at_price)}
                  </p>
                  <span className="bg-mj-btn px-2 py-0.5 font-mulish text-[10px] font-semibold uppercase tracking-wider text-mj-btn-text">
                    -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            {product.code && (
              <p className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted">
                Ref. {product.code}
              </p>
            )}

            {product.description && (
              <p className="font-mulish text-sm leading-relaxed text-mj-text-muted">
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
        <section className="border-t border-mj-border bg-mj-page py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10">
              <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-muted">Seleção</p>
              <h2 className="mt-2 font-julius text-2xl tracking-wider text-mj-text sm:text-3xl">
                VOCÊ TAMBÉM PODE GOSTAR
              </h2>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l border-t border-mj-border">
              {related.map((p) => (
                <li key={p.id} className="border-r border-b border-mj-border bg-mj-page">
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
