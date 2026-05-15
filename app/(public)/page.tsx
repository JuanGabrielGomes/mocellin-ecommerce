import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getActiveCampaign } from '@/lib/campaign'
import { ProductCard } from '@/components/product/ProductCard'
import type { ProductType } from '@/types'

export const metadata: Metadata = {
  title: 'Mocellin Joias — Joias e Semijoias',
  description: 'Peças com design atemporal para acompanhar seus momentos mais especiais.',
}

const CATEGORIES = [
  {
    value: 'brincos',
    label: 'Brincos',
    image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&fit=crop&q=80',
  },
  {
    value: 'aneis',
    label: 'Anéis',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&fit=crop&q=80',
  },
  {
    value: 'colares',
    label: 'Colares',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&fit=crop&q=80',
  },
  {
    value: 'relogios',
    label: 'Relógios',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&fit=crop&q=80',
  },
  {
    value: 'oculos',
    label: 'Óculos',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&fit=crop&q=80',
  },
  {
    value: 'masculino',
    label: 'Masculino',
    image: 'https://images.unsplash.com/photo-1625055671570-e5de97e4897d?w=600&fit=crop&q=80',
  },
  {
    value: 'pulseiras',
    label: 'Pulseiras',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&fit=crop&q=80',
  },
  {
    value: 'berloques',
    label: 'Berloques',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&fit=crop&q=80',
  },
]

export default async function HomePage() {
  const campaign = await getActiveCampaign()
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

          <div className="grid grid-cols-4 gap-3 sm:gap-4 sm:grid-cols-8">
            {CATEGORIES.map(({ value, label, image }) => (
              <Link
                key={value}
                href={`/catalogo?categoria=${value}`}
                className="group flex flex-col items-center gap-2 sm:gap-3"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-mj-cream">
                  <Image
                    src={image}
                    alt={label}
                    fill
                    sizes="(max-width: 640px) 33vw, 17vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay sutil no hover */}
                  <div className="absolute inset-0 bg-mj-black/0 transition-colors duration-300 group-hover:bg-mj-black/10" />
                </div>
                <p className="font-mulish text-[10px] sm:text-xs uppercase tracking-[0.15em] text-mj-text/70 transition-colors group-hover:text-mj-text text-center">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
