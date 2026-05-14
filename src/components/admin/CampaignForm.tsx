'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CampaignType } from '@/types'
import { CheckCircle2, Loader2, Upload, X } from 'lucide-react'

const inputClass =
  'w-full border border-mj-border bg-mj-cream px-4 py-3 font-mulish text-sm text-mj-black placeholder:text-mj-taupe/50 focus:border-mj-black focus:outline-none transition-colors'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 font-mulish text-[10px] text-mj-taupe/60">{hint}</p>}
    </div>
  )
}

// Regra dos presets dark mode:
// mj-black  → texto principal (CLARO em dark, ESCURO em light)
// mj-white  → superfície de card
// mj-cream  → fundo da página (o mais escuro em dark, o mais claro em light)
// mj-beige  → destaque/accent visível
// mj-brown  → cor de ação (botões, CTAs)
// mj-taupe  → texto secundário/muted
// mj-border → bordas

const PRESETS = [
  {
    label: 'Dia dos Namorados',
    banner_bg: '#6B0F1A',
    banner_text_color: '#FFB3C6',
    hero_label: 'Dia dos Namorados',
    hero_title: 'Para quem você ama.',
    hero_subtitle: 'Joias que guardam o momento mais especial — escolhidas com o coração.',
    colors: {
      'mj-black':  '#F5E0E8',   // texto → rosa-branco (legível no escuro)
      'mj-white':  '#1A0010',   // card bg → bordo escuro
      'mj-cream':  '#0D0008',   // page bg → quase preto
      'mj-beige':  '#FF4466',   // accent → vermelho vivo
      'mj-brown':  '#E0003A',   // botões → carmesim
      'mj-taupe':  '#C090A0',   // texto secundário → rosa médio
      'mj-border': '#3D0018',   // bordas → vinho escuro
    },
  },
  {
    label: 'Black Friday',
    banner_bg: '#050505',
    banner_text_color: '#FFD700',
    hero_label: 'Black Friday',
    hero_title: 'Preços que não voltam.',
    hero_subtitle: 'Peças exclusivas com descontos especiais por tempo limitado.',
    colors: {
      'mj-black':  '#F5F5F0',   // texto → quase branco
      'mj-white':  '#141414',   // card bg → cinza escuro
      'mj-cream':  '#0A0A0A',   // page bg → quase preto
      'mj-beige':  '#FFD700',   // accent → ouro
      'mj-brown':  '#C9922A',   // botões → ouro escuro
      'mj-taupe':  '#888888',   // texto secundário → cinza médio
      'mj-border': '#2A2A2A',   // bordas → escuro
    },
  },
  {
    label: 'Natal',
    banner_bg: '#1B4332',
    banner_text_color: '#FFE8A3',
    hero_label: 'Coleção Natal',
    hero_title: 'O presente perfeito.',
    hero_subtitle: 'Joias e semijoias para tornar cada encontro inesquecível.',
    colors: {
      'mj-black':  '#F5F0E0',   // texto → creme quente
      'mj-white':  '#0D2018',   // card bg → verde escuro
      'mj-cream':  '#081510',   // page bg → quase preto esverdeado
      'mj-beige':  '#FFE4A0',   // accent → dourado quente
      'mj-brown':  '#C84B0C',   // botões → vermelho natal
      'mj-taupe':  '#8FAF95',   // texto secundário → verde muted
      'mj-border': '#1A3D28',   // bordas → verde escuro
    },
  },
  {
    label: 'Dia das Mães',
    banner_bg: '#8B2060',
    banner_text_color: '#FFE8F5',
    hero_label: 'Dia das Mães',
    hero_title: 'Para ela, o melhor.',
    hero_subtitle: 'Uma joia para celebrar quem mais você ama.',
    colors: {
      'mj-black':  '#3D1830',   // texto → malva escuro (legível no claro)
      'mj-white':  '#FFF5FA',   // card bg → rosa muito suave
      'mj-cream':  '#FFF0F8',   // page bg → rosa clarinho
      'mj-beige':  '#D4608A',   // accent → rosa médio
      'mj-brown':  '#8B2060',   // botões → malva escuro
      'mj-taupe':  '#A06080',   // texto secundário → rosa muted
      'mj-border': '#F4C0D8',   // bordas → rosa claro
    },
  },
  {
    label: 'Padrão (sem tema)',
    banner_bg: '#1a0a0a',
    banner_text_color: '#f5e6d3',
    hero_label: '',
    hero_title: '',
    hero_subtitle: '',
    colors: {},
  },
]

interface Props {
  campaign?: CampaignType
}

export function CampaignForm({ campaign }: Props) {
  const router = useRouter()
  const isEditing = Boolean(campaign)

  const [name, setName] = useState(campaign?.name ?? '')
  const [slug, setSlug] = useState(campaign?.slug ?? '')
  const [active, setActive] = useState(campaign?.active ?? false)
  const [bannerText, setBannerText] = useState(campaign?.banner_text ?? '')
  const [bannerBg, setBannerBg] = useState(campaign?.banner_bg ?? '#1a0a0a')
  const [bannerTextColor, setBannerTextColor] = useState(campaign?.banner_text_color ?? '#f5e6d3')
  const [heroImage, setHeroImage] = useState(campaign?.hero_image ?? '')
  const [heroImageUploading, setHeroImageUploading] = useState(false)
  const heroImageRef = useRef<HTMLInputElement>(null)
  const [heroLabel, setHeroLabel] = useState(campaign?.hero_label ?? '')
  const [heroTitle, setHeroTitle] = useState(campaign?.hero_title ?? '')
  const [heroSubtitle, setHeroSubtitle] = useState(campaign?.hero_subtitle ?? '')
  const [colorsJson, setColorsJson] = useState(
    campaign ? JSON.stringify(campaign.colors, null, 2) : '{}'
  )
  const [jsonError, setJsonError] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => router.replace('/admin/campanhas'), 1500)
    return () => clearTimeout(t)
  }, [success, router])

  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeroImageUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `hero-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('campaign-images')
        .upload(path, file, { contentType: file.type, upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('campaign-images').getPublicUrl(data.path)
      setHeroImage(publicUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar imagem.')
    } finally {
      setHeroImageUploading(false)
      e.target.value = ''
    }
  }

  function applyPreset(idx: number) {
    const p = PRESETS[idx]
    setBannerBg(p.banner_bg)
    setBannerTextColor(p.banner_text_color)
    setHeroLabel(p.hero_label)
    setHeroTitle(p.hero_title)
    setHeroSubtitle(p.hero_subtitle)
    setColorsJson(JSON.stringify(p.colors, null, 2))
    setJsonError('')
  }

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    let colors: Record<string, string> = {}
    try {
      colors = JSON.parse(colorsJson)
    } catch {
      setJsonError('JSON de cores inválido.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const payload = {
        name: name.trim(),
        slug: slug.trim() || autoSlug(name),
        active,
        banner_text: bannerText.trim() || null,
        banner_bg: bannerBg,
        banner_text_color: bannerTextColor,
        hero_image: heroImage.trim() || null,
        hero_label: heroLabel.trim() || null,
        hero_title: heroTitle.trim() || null,
        hero_subtitle: heroSubtitle.trim() || null,
        colors,
        updated_at: new Date().toISOString(),
      }

      if (active) {
        // Only one campaign can be active at a time
        await supabase
          .from('campaigns')
          .update({ active: false })
          .neq('id', campaign?.id ?? '00000000-0000-0000-0000-000000000000')
      }

      if (isEditing && campaign) {
        const { error: err } = await supabase.from('campaigns').update(payload).eq('id', campaign.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('campaigns').insert(payload)
        if (err) throw err
      }

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar campanha.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16 max-w-2xl">
      {success && (
        <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          <CheckCircle2 size={16} />
          <span className="font-mulish text-sm font-medium">
            Campanha {isEditing ? 'atualizada' : 'criada'} com sucesso!
          </span>
        </div>
      )}
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 font-mulish text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Identidade */}
      <section className="border border-mj-border bg-mj-white p-6">
        <h2 className="mb-5 font-julius text-xl tracking-wider text-mj-black">Identidade</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!isEditing) setSlug(autoSlug(e.target.value))
                }}
                placeholder="Ex: Dia dos Namorados 2026"
                required
                className={inputClass}
              />
            </Field>
            <Field label="Slug (URL)" hint="Gerado automaticamente pelo nome">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dia-dos-namorados-2026"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Status">
            <button
              type="button"
              onClick={() => setActive((v) => !v)}
              className={`px-4 py-2 font-mulish text-sm font-medium transition-colors ${
                active
                  ? 'bg-emerald-500 text-white'
                  : 'border border-mj-border text-mj-taupe hover:border-mj-black hover:text-mj-black'
              }`}
            >
              {active ? 'Ativa' : 'Inativa'}
            </button>
          </Field>
        </div>
      </section>

      {/* Banner */}
      <section className="border border-mj-border bg-mj-white p-6">
        <h2 className="mb-5 font-julius text-xl tracking-wider text-mj-black">Banner</h2>
        <div className="space-y-4">
          <Field label="Texto do banner" hint="Deixe vazio para não exibir banner">
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="Ex: Frete grátis acima de R$ 200 hoje!"
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cor de fundo">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bannerBg}
                  onChange={(e) => setBannerBg(e.target.value)}
                  className="h-10 w-14 cursor-pointer border border-mj-border bg-transparent p-1"
                />
                <input
                  type="text"
                  value={bannerBg}
                  onChange={(e) => setBannerBg(e.target.value)}
                  className={`${inputClass} flex-1`}
                />
              </div>
            </Field>
            <Field label="Cor do texto">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bannerTextColor}
                  onChange={(e) => setBannerTextColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer border border-mj-border bg-transparent p-1"
                />
                <input
                  type="text"
                  value={bannerTextColor}
                  onChange={(e) => setBannerTextColor(e.target.value)}
                  className={`${inputClass} flex-1`}
                />
              </div>
            </Field>
          </div>

          {bannerText && (
            <div
              className="flex h-10 items-center justify-center px-4"
              style={{ backgroundColor: bannerBg, color: bannerTextColor }}
            >
              <p className="font-mulish text-[11px] uppercase tracking-[0.2em] text-center">
                {bannerText}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Texto do Hero */}
      <section className="border border-mj-border bg-mj-white p-6">
        <h2 className="mb-2 font-julius text-xl tracking-wider text-mj-black">Hero</h2>
        <p className="mb-5 font-mulish text-xs text-mj-taupe">
          Imagem de fundo e textos da seção principal da homepage. Deixe vazio para usar o padrão.
        </p>
        <div className="space-y-4">
          <Field label="Imagem de fundo" hint="Faça upload ou cole uma URL (JPG, PNG, WEBP)">
            <div className="space-y-3">
              {/* Preview */}
              {heroImage && (
                <div className="relative h-32 w-full overflow-hidden border border-mj-border bg-mj-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroImage} alt="Preview hero" className="h-full w-full object-cover object-center" />
                  <button
                    type="button"
                    onClick={() => setHeroImage('')}
                    className="absolute right-2 top-2 bg-black/60 p-1 text-white transition-colors hover:bg-black"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {/* Upload */}
              <label className="flex cursor-pointer items-center gap-3 border border-dashed border-mj-border bg-mj-cream/40 px-4 py-3 transition-colors hover:border-mj-black hover:bg-mj-cream">
                {heroImageUploading
                  ? <Loader2 size={16} className="animate-spin text-mj-taupe" />
                  : <Upload size={16} className="text-mj-taupe/60" />
                }
                <span className="font-mulish text-sm text-mj-taupe">
                  {heroImageUploading ? 'Enviando…' : 'Clique para fazer upload'}
                </span>
                <input
                  ref={heroImageRef}
                  type="file"
                  className="sr-only"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleHeroImageUpload}
                  disabled={heroImageUploading}
                />
              </label>
              {/* URL manual */}
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="Ou cole uma URL de imagem aqui"
                className={inputClass}
              />
            </div>
          </Field>
          <Field label="Etiqueta (ex: Dia dos Namorados)" hint='Pequeno label acima do título — ex: "Nova Coleção"'>
            <input
              type="text"
              value={heroLabel}
              onChange={(e) => setHeroLabel(e.target.value)}
              placeholder="Nova Coleção"
              className={inputClass}
            />
          </Field>
          <Field label="Título principal" hint="Aparece em destaque sobre a imagem do hero">
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Peças que ficam para sempre."
              className={inputClass}
            />
          </Field>
          <Field label="Subtítulo">
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Joias e semijoias escolhidas com cuidado para acompanhar cada momento especial."
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Tema de cores */}
      <section className="border border-mj-border bg-mj-white p-6">
        <h2 className="mb-2 font-julius text-xl tracking-wider text-mj-black">Tema de cores</h2>
        <p className="mb-5 font-mulish text-xs text-mj-taupe">
          Substitui as cores do site durante a campanha. Use os atalhos abaixo ou edite o JSON manualmente.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(i)}
              className="border border-mj-border px-3 py-1.5 font-mulish text-xs text-mj-black transition-colors hover:bg-mj-black hover:text-white"
            >
              {p.label}
            </button>
          ))}
        </div>

        <Field label="Cores (JSON)" hint='Chaves: "mj-black", "mj-brown", "mj-beige", "mj-taupe", "mj-cream", "mj-white", "mj-border"'>
          <textarea
            value={colorsJson}
            onChange={(e) => { setColorsJson(e.target.value); setJsonError('') }}
            rows={10}
            spellCheck={false}
            className={`${inputClass} resize-none font-mono text-xs`}
          />
          {jsonError && <p className="mt-1 font-mulish text-xs text-red-500">{jsonError}</p>}
        </Field>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || success}
          className="flex items-center gap-2 bg-mj-black px-6 py-3 font-mulish text-sm text-white transition-all hover:bg-mj-brown active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Salvando…' : isEditing ? 'Atualizar campanha' : 'Criar campanha'}
        </button>
      </div>
    </form>
  )
}
