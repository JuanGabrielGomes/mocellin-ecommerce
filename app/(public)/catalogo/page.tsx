import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { CatalogSearch } from '@/components/ui/CatalogSearch'
import type { ProductType, ProductCategory } from '@/types'

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'brincos',   label: 'Brincos' },
  { value: 'aneis',     label: 'Anéis' },
  { value: 'relogios',  label: 'Relógios' },
  { value: 'colares',   label: 'Colares' },
  { value: 'oculos',    label: 'Óculos' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'pulseiras', label: 'Pulseiras e Braceletes' },
  { value: 'berloques', label: 'Berloques' },
  { value: 'conjuntos', label: 'Conjuntos' },
  { value: 'pingentes', label: 'Pingentes' },
  { value: 'piercing',  label: 'Piercing' },
]

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.value))
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { categoria, busca } = await searchParams
  const cat = CATEGORIES.find((c) => c.value === categoria)
  return {
    title: cat ? `${cat.label} | Mocellin Joias` : 'Catálogo | Mocellin Joias',
    description: busca
      ? `Resultados para "${busca}" na Mocellin Joias.`
      : cat
        ? `Explore nossa coleção de ${cat.label.toLowerCase()}.`
        : 'Explore o catálogo completo de joias e semijoias da Mocellin Joias.',
  }
}

export default async function CatalogoPage({ searchParams }: { searchParams: SearchParams }) {
  const { categoria, busca } = await searchParams

  const activeCategory =
    typeof categoria === 'string' && VALID_CATEGORIES.has(categoria)
      ? (categoria as ProductCategory)
      : null

  const searchTerm = typeof busca === 'string' ? busca.trim() : ''

  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*')
    .in('status', ['disponivel', 'pre_venda'])
    .order('created_at', { ascending: false })

  if (activeCategory) query = query.eq('category', activeCategory)
  if (searchTerm)     query = query.ilike('name', `%${searchTerm}%`)

  const { data: products, error } = await query

  return (
    <main className="pt-20 sm:pt-24">
      {/* Topo */}
      <div className="border-b border-mj-border bg-mj-surface px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-muted">Mocellin Joias</p>
              <h1 className="mt-2 font-julius text-3xl tracking-wider text-mj-text sm:text-4xl">CATÁLOGO</h1>
            </div>
            {/* Campo de busca */}
            <Suspense fallback={<div className="h-9 w-full animate-pulse bg-mj-border/30 sm:w-64" />}>
              <CatalogSearch />
            </Suspense>
          </div>

          {/* Filtros de categoria */}
          <nav aria-label="Filtrar por categoria" className="mt-8 flex flex-wrap gap-2">
            <Link
              href={searchTerm ? `/catalogo?busca=${encodeURIComponent(searchTerm)}` : '/catalogo'}
              className={[
                'px-5 py-2 font-mulish text-[11px] uppercase tracking-[0.15em] transition-colors',
                !activeCategory
                  ? 'bg-mj-btn text-mj-btn-text'
                  : 'border border-mj-border text-mj-text-muted hover:border-mj-btn hover:text-mj-btn',
              ].join(' ')}
            >
              Todos
            </Link>
            {CATEGORIES.map(({ value, label }) => {
              const href = searchTerm
                ? `/catalogo?categoria=${value}&busca=${encodeURIComponent(searchTerm)}`
                : `/catalogo?categoria=${value}`
              return (
                <Link
                  key={value}
                  href={href}
                  className={[
                    'px-5 py-2 font-mulish text-[11px] uppercase tracking-[0.15em] transition-colors',
                    activeCategory === value
                      ? 'bg-mj-btn text-mj-btn-text'
                      : 'border border-mj-border text-mj-text-muted hover:border-mj-btn hover:text-mj-btn',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {error ? (
          <p className="text-center font-mulish text-sm text-red-500">
            Não foi possível carregar o catálogo. Tente novamente mais tarde.
          </p>
        ) : !products || products.length === 0 ? (
          <div className="py-24 text-center">
            {searchTerm ? (
              <>
                <p className="font-mulish text-sm text-mj-text-muted">
                  Nenhum produto encontrado para{' '}
                  <span className="font-semibold text-mj-text">&ldquo;{searchTerm}&rdquo;</span>.
                </p>
                <Link
                  href={activeCategory ? `/catalogo?categoria=${activeCategory}` : '/catalogo'}
                  className="mt-4 inline-block font-mulish text-xs uppercase tracking-[0.15em] text-mj-text-muted underline underline-offset-4"
                >
                  Limpar busca
                </Link>
              </>
            ) : (
              <p className="font-mulish text-sm text-mj-text-muted">Nenhum produto disponível no momento.</p>
            )}
          </div>
        ) : (
          <>
            {searchTerm && (
              <p className="mb-6 font-mulish text-xs text-mj-text-muted">
                {products.length} resultado{products.length !== 1 ? 's' : ''} para{' '}
                <span className="font-semibold text-mj-text">&ldquo;{searchTerm}&rdquo;</span>
              </p>
            )}
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l border-t border-mj-border">
              {(products as ProductType[]).map((product) => (
                <li key={product.id} className="border-r border-b border-mj-border bg-mj-page">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}
