import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import type { ProductType, ProductCategory } from '@/types'

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'brincos', label: 'Brincos' },
  { value: 'aneis', label: 'Anéis' },
  { value: 'relogios', label: 'Relógios' },
  { value: 'colares', label: 'Colares' },
  { value: 'oculos', label: 'Óculos' },
]

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.value))

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const { categoria } = await searchParams
  const cat = CATEGORIES.find((c) => c.value === categoria)

  return {
    title: cat ? `${cat.label} | Mocellin Joias` : 'Catálogo | Mocellin Joias',
    description: cat
      ? `Explore nossa coleção de ${cat.label.toLowerCase()} com design atemporal.`
      : 'Explore o catálogo completo de joias exclusivas da Mocellin Joias.',
  }
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { categoria } = await searchParams
  const activeCategory =
    typeof categoria === 'string' && VALID_CATEGORIES.has(categoria)
      ? (categoria as ProductCategory)
      : null

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'disponivel')
    .order('created_at', { ascending: false })

  if (activeCategory) {
    query = query.eq('category', activeCategory)
  }

  const { data: products, error } = await query

  if (error) {
    return (
      <main className="px-4 py-16 text-center">
        <p className="text-sm text-red-500">
          Não foi possível carregar o catálogo. Tente novamente mais tarde.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-cormorant text-4xl font-semibold text-mocellin-dark sm:text-5xl">
        Catálogo
      </h1>

      <nav aria-label="Filtrar por categoria" className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/catalogo"
          className={[
            'rounded-full border px-4 py-1.5 text-sm font-medium font-dm-sans transition-colors',
            !activeCategory
              ? 'border-mocellin-gold bg-mocellin-gold text-white'
              : 'border-mocellin-beige bg-mocellin-beige text-mocellin-dark hover:border-mocellin-gold hover:text-mocellin-gold',
          ].join(' ')}
        >
          Todos
        </Link>

        {CATEGORIES.map(({ value, label }) => (
          <Link
            key={value}
            href={`/catalogo?categoria=${value}`}
            className={[
              'rounded-full border px-4 py-1.5 text-sm font-medium font-dm-sans transition-colors',
              activeCategory === value
                ? 'border-mocellin-gold bg-mocellin-gold text-white'
                : 'border-mocellin-beige bg-mocellin-beige text-mocellin-dark hover:border-mocellin-gold hover:text-mocellin-gold',
            ].join(' ')}
          >
            {label}
          </Link>
        ))}
      </nav>

      {!products || products.length === 0 ? (
        <p className="mt-16 text-center text-sm text-mocellin-dark/50 font-dm-sans">
          Nenhum produto disponível no momento.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {(products as ProductType[]).map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
