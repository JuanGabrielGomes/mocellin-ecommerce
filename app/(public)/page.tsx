import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import type { ProductType } from '@/types'

export const metadata: Metadata = {
  title: 'Mocellin Joias — Joias e Semijoias',
  description: 'Peças com design atemporal para acompanhar seus momentos mais especiais.',
}

const CATEGORIES = [
  { value: 'brincos', label: 'Brincos' },
  { value: 'aneis',   label: 'Anéis' },
  { value: 'colares', label: 'Colares' },
  { value: 'relogios',label: 'Relógios' },
  { value: 'oculos',  label: 'Óculos' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'disponivel')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-end bg-mj-black pb-20 pt-32">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-mj-black/20 via-mj-black/40 to-mj-black/80" />

        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-beige mb-5">
            Nova Coleção
          </p>
          <h1 className="font-julius text-white leading-tight" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
            Peças que ficam<br />
            <span className="italic text-mj-beige">para sempre.</span>
          </h1>
          <p className="mt-6 font-mulish text-sm font-light leading-relaxed text-white/70 max-w-sm">
            Joias e semijoias escolhidas com cuidado para acompanhar cada momento especial.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-none border border-white px-8 py-4 font-mulish text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-mj-black"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categorias ───────────────────────────────────────── */}
      <section className="bg-mj-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 text-center">
            <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-taupe">
              Explorar
            </p>
            <h2 className="mt-2 font-julius text-2xl tracking-wider text-mj-black sm:text-3xl">
              ESCOLHA POR CATEGORIA
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {CATEGORIES.map(({ value, label }) => (
              <Link
                key={value}
                href={`/catalogo?categoria=${value}`}
                className="group flex flex-col items-center gap-3"
              >
                <div className="aspect-square w-full overflow-hidden bg-mj-cream transition-all duration-300 group-hover:bg-mj-beige/30">
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-julius text-4xl text-mj-taupe transition-colors group-hover:text-mj-brown">
                      {label[0]}
                    </span>
                  </div>
                </div>
                <p className="font-mulish text-xs uppercase tracking-[0.15em] text-mj-black/70 transition-colors group-hover:text-mj-black">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produtos em destaque ─────────────────────────────── */}
      {featured && featured.length > 0 && (
        <section className="bg-mj-cream py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-taupe">
                  Seleção
                </p>
                <h2 className="mt-2 font-julius text-2xl tracking-wider text-mj-black sm:text-3xl">
                  EM DESTAQUE
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="font-mulish text-xs uppercase tracking-[0.15em] text-mj-taupe underline-offset-4 hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(featured as ProductType[]).map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Editorial ────────────────────────────────────────── */}
      <section className="bg-mj-teal">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Foto placeholder */}
            <div className="aspect-[4/5] bg-mj-black/20 md:aspect-auto" />

            {/* Copy */}
            <div className="flex flex-col justify-center px-8 py-16 md:px-16">
              <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-beige/60">
                A Mocellin
              </p>
              <h2
                className="mt-4 font-julius text-white leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                Cada peça conta<br />uma história.
              </h2>
              <p className="mt-6 font-mulish text-sm font-light leading-relaxed text-white/60 max-w-sm">
                Joias e semijoias escolhidas com cuidado para acompanhar
                presentes, rituais e pequenos marcos do cotidiano.
              </p>
              <Link
                href="/catalogo"
                className="mt-10 inline-flex w-fit items-center gap-2 border-b border-mj-beige pb-1 font-mulish text-xs uppercase tracking-[0.2em] text-mj-beige transition-colors hover:text-white hover:border-white"
              >
                Conhecer seleção
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
