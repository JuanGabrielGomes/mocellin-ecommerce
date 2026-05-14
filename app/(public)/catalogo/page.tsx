import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import type { ProductType, ProductCategory } from '@/types'

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'brincos', label: 'Brincos' },
  { value: 'aneis',   label: 'Anéis' },
  { value: 'relogios',label: 'Relógios' },
  { value: 'colares', label: 'Colares' },
  { value: 'oculos',  label: 'Óculos' },
]

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.value))
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { categoria } = await searchParams
  const cat = CATEGORIES.find((c) => c.value === categoria)
  return {
    title: cat ? `${cat.label} | Mocellin Joias` : 'Catálogo | Mocellin Joias',
    description: cat
      ? `Explore nossa coleção de ${cat.label.toLowerCase()}.`
      : 'Explore o catálogo completo de joias e semijoias da Mocellin Joias.',
  }
}

export default async function CatalogoPage({ searchParams }: { searchParams: SearchParams }) {
  const { categoria } = await searchParams
  const activeCategory =
    typeof categoria === 'string' && VALID_CATEGORIES.has(categoria)
      ? (categoria as ProductCategory)
      : null

  const supabase = await createClient()
  let query = supabase.from('products').select('*').eq('status', 'disponivel').order('created_at', { ascending: false })
  if (activeCategory) query = query.eq('category', activeCategory)
  const { data: products, error } = await query

  return (
    <main className="pt-20 sm:pt-24">
      {/* Topo */}
      <div className="border-b border-mj-border bg-mj-white px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-taupe">Mocellin Joias</p>
          <h1 className="mt-2 font-julius text-3xl tracking-wider text-mj-black sm:text-4xl">CATÁLOGO</h1>

          <nav aria-label="Filtrar por categoria" className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/catalogo"
              className={[
                'px-5 py-2 font-mulish text-[11px] uppercase tracking-[0.15em] transition-colors',
                !activeCategory
                  ? 'bg-mj-black text-white'
                  : 'border border-mj-border text-mj-taupe hover:border-mj-black hover:text-mj-black',
              ].join(' ')}
            >
              Todos
            </Link>
            {CATEGORIES.map(({ value, label }) => (
              <Link
                key={value}
                href={`/catalogo?categoria=${value}`}
                className={[
                  'px-5 py-2 font-mulish text-[11px] uppercase tracking-[0.15em] transition-colors',
                  activeCategory === value
                    ? 'bg-mj-black text-white'
                    : 'border border-mj-border text-mj-taupe hover:border-mj-black hover:text-mj-black',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}
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
            <p className="font-mulish text-sm text-mj-taupe">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l border-t border-mj-border">
            {(products as ProductType[]).map((product) => (
              <li key={product.id} className="border-r border-b border-mj-border bg-mj-cream">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
