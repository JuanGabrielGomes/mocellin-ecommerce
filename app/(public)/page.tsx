import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getActiveCampaign } from '@/lib/campaign'
import { ProductCard } from '@/components/product/ProductCard'
import { CategoryCarousel } from '@/components/ui/CategoryCarousel'
import type { ProductType } from '@/types'

export const metadata: Metadata = {
  title: 'Mocellin Joias — Joias e Semijoias',
  description: 'Peças com design atemporal para acompanhar seus momentos mais especiais.',
}

const CATEGORIES = [
  {
    value: 'brincos',
    label: 'Brincos',
    image: '/img/brincos.jpeg',
  },
  {
    value: 'aneis',
    label: 'Anéis',
    image: '/img/aneis.jpg',
  },
  {
    value: 'colares',
    label: 'Colares',
    image: '/img/colar.jpeg',
  },
  {
    value: 'relogios',
    label: 'Relógios',
    image: '/img/relogio.jpeg',
  },
  {
    value: 'oculos',
    label: 'Óculos',
    image: '/img/oculos.jpg',
  },
  {
    value: 'masculino',
    label: 'Masculino',
    image: '/img/masculino.jpg',
  },
  {
    value: 'pulseiras',
    label: 'Pulseiras',
    image: '/img/pulseiras2.jpg',
  },
  {
    value: 'berloques',
    label: 'Berloques',
    image: '/img/berloques.jpeg',
  },
  {
    value: 'conjuntos',
    label: 'Conjuntos',
    image: '/img/conjuntos.jpeg',
  },
  {
    value: 'pingentes',
    label: 'Pingentes',
    image: '/img/pingentes.jpeg',
  },
  {
    value: 'piercing',
    label: 'Piercing',
    image: '/img/piercing.jpg',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const [campaign, { data: featured }, { data: preVendaProducts }] = await Promise.all([
    getActiveCampaign(),
    supabase
      .from('products')
      .select('*')
      .eq('status', 'disponivel')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('products')
      .select('*')
      .eq('status', 'pre_venda')
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-end bg-mj-black pb-16 pt-32 sm:pb-24">
        {/* Background image */}
        <Image
          src={campaign?.hero_image ?? "https://images.unsplash.com/photo-1639660680515-7c76c86b559b?w=1600&fit=crop&q=80"}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay gradient — multi-stop to avoid banding */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              color-mix(in srgb, var(--color-mj-overlay)  0%, transparent)   0%,
              color-mix(in srgb, var(--color-mj-overlay) 10%, transparent)  15%,
              color-mix(in srgb, var(--color-mj-overlay) 25%, transparent)  30%,
              color-mix(in srgb, var(--color-mj-overlay) 45%, transparent)  50%,
              color-mix(in srgb, var(--color-mj-overlay) 65%, transparent)  68%,
              color-mix(in srgb, var(--color-mj-overlay) 82%, transparent)  84%,
              color-mix(in srgb, var(--color-mj-overlay) 92%, transparent) 100%)`
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-accent mb-4 sm:mb-5">
            {campaign?.hero_label ?? 'Nova Coleção'}
          </p>
          <h1 className="font-julius text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 8vw, 5rem)' }}>
            {campaign?.hero_title
              ? <span className="italic text-mj-text-accent">{campaign.hero_title}</span>
              : <>Peças que ficam<br /><span className="italic text-mj-text-accent">para sempre.</span></>
            }
          </h1>
          <p className="mt-5 font-mulish text-sm font-light leading-relaxed text-white/70 max-w-xs sm:max-w-sm">
            {campaign?.hero_subtitle ?? 'Joias e semijoias escolhidas com cuidado para acompanhar cada momento especial.'}
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 border border-white px-7 py-3.5 sm:px-8 sm:py-4 font-mulish text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-mj-black"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categorias ───────────────────────────────────────── */}
      <section className="bg-mj-surface py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 sm:mb-12 text-center">
            <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-muted">
              Explorar
            </p>
            <h2 className="mt-2 font-julius text-2xl tracking-wider text-mj-text sm:text-3xl">
              ESCOLHA POR CATEGORIA
            </h2>
          </div>

          <CategoryCarousel categories={CATEGORIES} />
        </div>
      </section>

      {/* ── Seleção especial de campanha (pré-venda) ─────────── */}
      {campaign && preVendaProducts && preVendaProducts.length > 0 && (
        <section className="py-14 sm:py-20" style={{ background: campaign.colors?.sectionBg ?? 'var(--color-mj-surface)' }}>
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 sm:mb-12 flex items-end justify-between">
              <div>
                <p
                  className="font-mulish text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: campaign.colors?.accent ?? 'var(--color-mj-text-muted)' }}
                >
                  {campaign.name}
                </p>
                <h2 className="mt-2 font-julius text-2xl tracking-wider text-mj-text sm:text-3xl">
                  SELEÇÃO ESPECIAL
                </h2>
                <p className="mt-2 font-mulish text-xs text-mj-text-muted">
                  Peças exclusivas · Prazo especial combinado via WhatsApp
                </p>
              </div>
              <Link
                href="/catalogo"
                className="font-mulish text-xs uppercase tracking-[0.15em] text-mj-text-muted underline-offset-4 hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 border-l border-t border-mj-border">
              {(preVendaProducts as ProductType[]).map((product) => (
                <li key={product.id} className="border-r border-b border-mj-border bg-mj-surface">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Produtos em destaque ─────────────────────────────── */}
      {featured && featured.length > 0 && (
        <section className="bg-mj-page py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 sm:mb-12 flex items-end justify-between">
              <div>
                <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-muted">
                  Seleção
                </p>
                <h2 className="mt-2 font-julius text-2xl tracking-wider text-mj-text sm:text-3xl">
                  EM DESTAQUE
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="font-mulish text-xs uppercase tracking-[0.15em] text-mj-text-muted underline-offset-4 hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 border-l border-t border-mj-border">
              {(featured as ProductType[]).map((product) => (
                <li key={product.id} className="border-r border-b border-mj-border bg-mj-page">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Sobre ────────────────────────────────────────────── */}
      <section className="bg-mj-surface">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Foto de Priscila */}
            <div className="relative aspect-[4/5] overflow-hidden bg-mj-cream md:aspect-auto md:min-h-[600px]">
              <Image
                src="/priscila.jpg"
                alt="Priscila Mocellin — fundadora da Mocellin Joias"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Texto */}
            <div className="flex flex-col justify-center bg-mj-black px-8 py-16 sm:px-12 md:px-16">
              <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-accent/60">
                A Mocellin
              </p>
              <h2
                className="mt-4 font-julius text-white leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)' }}
              >
                Cada peça conta<br />uma história.
              </h2>
              <p className="mt-6 font-mulish text-sm font-light leading-relaxed text-white/65 max-w-sm">
                Fundada por Priscila Mocellin, a Mocellin Joias nasceu do desejo de oferecer
                peças que vão além da moda — joias e semijoias que marcam momentos,
                celebram conquistas e acompanham quem as usa por muito tempo.
              </p>
              <p className="mt-4 font-mulish text-sm font-light leading-relaxed text-white/65 max-w-sm">
                Com olhar criterioso e paixão por design atemporal, Priscila seleciona cada
                peça unindo qualidade de materiais, acabamento impecável e um estilo que
                equilibra elegância e modernidade.
              </p>
              <Link
                href="/catalogo"
                className="mt-10 inline-flex w-fit items-center gap-2 border-b border-mj-text-accent pb-1 font-mulish text-xs uppercase tracking-[0.2em] text-mj-text-accent transition-colors hover:text-white hover:border-white"
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
