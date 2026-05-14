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

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer border border-mj-border bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-28 border border-mj-border bg-mj-cream px-3 py-2 font-mono text-xs text-mj-black focus:border-mj-black focus:outline-none"
        />
        {hint && <span className="font-mulish text-[10px] text-mj-taupe/60">{hint}</span>}
      </div>
    </div>
  )
}

type SemanticColors = {
  'mj-text': string
  'mj-text-muted': string
  'mj-text-accent': string
  'mj-surface': string
  'mj-page': string
  'mj-overlay': string
  'mj-btn': string
  'mj-btn-text': string
  'mj-btn-hover': string
  'mj-border': string
}

const DEFAULT_COLORS: SemanticColors = {
  'mj-text':        '#000000',
  'mj-text-muted':  '#968A7A',
  'mj-text-accent': '#D5B39A',
  'mj-surface':     '#FFFFFF',
  'mj-page':        '#FAFAF8',
  'mj-overlay':     '#000000',
  'mj-btn':         '#000000',
  'mj-btn-text':    '#FFFFFF',
  'mj-btn-hover':   '#7B4A34',
  'mj-border':      '#E8E0D8',
}

const PRESETS: {
  label: string
  banner_bg: string
  banner_text_color: string
  hero_label: string
  hero_title: string
  hero_subtitle: string
  colors: SemanticColors
}[] = [
  {
    label: 'Dia dos Namorados',
    banner_bg: '#6B0F1A',
    banner_text_color: '#FFB3C6',
    hero_label: 'Dia dos Namorados',
    hero_title: 'Para quem você ama.',
    hero_subtitle: 'Joias que guardam o momento mais especial — escolhidas com o coração.',
    colors: {
      'mj-text':        '#F5E0E8',
      'mj-text-muted':  '#C090A0',
      'mj-text-accent': '#FF4466',
      'mj-surface':     '#1A0010',
      'mj-page':        '#0D0008',
      'mj-overlay':     '#0D0008',
      'mj-btn':         '#E0003A',
      'mj-btn-text':    '#FFFFFF',
      'mj-btn-hover':   '#FF4466',
      'mj-border':      '#3D0018',
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
      'mj-text':        '#F5F5F0',
      'mj-text-muted':  '#888888',
      'mj-text-accent': '#FFD700',
      'mj-surface':     '#141414',
      'mj-page':        '#0A0A0A',
      'mj-overlay':     '#0A0A0A',
      'mj-btn':         '#C9922A',
      'mj-btn-text':    '#111111',
      'mj-btn-hover':   '#FFD700',
      'mj-border':      '#2A2A2A',
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
      'mj-text':        '#F5F0E0',
      'mj-text-muted':  '#8FAF95',
      'mj-text-accent': '#FFE4A0',
      'mj-surface':     '#0D2018',
      'mj-page':        '#081510',
      'mj-overlay':     '#081510',
      'mj-btn':         '#C84B0C',
      'mj-btn-text':    '#FFFFFF',
      'mj-btn-hover':   '#E0600F',
      'mj-border':      '#1A3D28',
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
      'mj-text':        '#3D1830',
      'mj-text-muted':  '#A06080',
      'mj-text-accent': '#D4608A',
      'mj-surface':     '#FFF5FA',
      'mj-page':        '#FFF0F8',
      'mj-overlay':     '#1A0010',
      'mj-btn':         '#8B2060',
      'mj-btn-text':    '#FFFFFF',
      'mj-btn-hover':   '#B82880',
      'mj-border':      '#F4C0D8',
    },
  },
  {
    label: 'Padrão (sem tema)',
    banner_bg: '#1a0a0a',
    banner_text_color: '#f5e6d3',
    hero_label: '',
    hero_title: '',
    hero_subtitle: '',
    colors: { ...DEFAULT_COLORS },
  },
]

function colorsFromCampaign(c: CampaignType | undefined): SemanticColors {
  if (!c?.colors) return { ...DEFAULT_COLORS }
  return {
    'mj-text':        String(c.colors['mj-text']        ?? DEFAULT_COLORS['mj-text']),
    'mj-text-muted':  String(c.colors['mj-text-muted']  ?? DEFAULT_COLORS['mj-text-muted']),
    'mj-text-accent': String(c.colors['mj-text-accent'] ?? DEFAULT_COLORS['mj-text-accent']),
    'mj-surface':     String(c.colors['mj-surface']     ?? DEFAULT_COLORS['mj-surface']),
    'mj-page':        String(c.colors['mj-page']        ?? DEFAULT_COLORS['mj-page']),
    'mj-overlay':     String(c.colors['mj-overlay']     ?? DEFAULT_COLORS['mj-overlay']),
    'mj-btn':         String(c.colors['mj-btn']         ?? DEFAULT_COLORS['mj-btn']),
    'mj-btn-text':    String(c.colors['mj-btn-text']    ?? DEFAULT_COLORS['mj-btn-text']),
    'mj-btn-hover':   String(c.colors['mj-btn-hover']   ?? DEFAULT_COLORS['mj-btn-hover']),
    'mj-border':      String(c.colors['mj-border']      ?? DEFAULT_COLORS['mj-border']),
  }
}

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
  const [colors, setColors] = useState<SemanticColors>(() => colorsFromCampaign(campaign))

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => router.replace('/admin/campanhas'), 1500)
    return () => clearTimeout(t)
  }, [success, router])

  function setColor(key: keyof SemanticColors, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }))
  }

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
    setColors(p.colors)
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
            <ColorField label="Fundo do banner" value={bannerBg} onChange={setBannerBg} />
            <ColorField label="Texto do banner" value={bannerTextColor} onChange={setBannerTextColor} />
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

      {/* Hero */}
      <section className="border border-mj-border bg-mj-white p-6">
        <h2 className="mb-2 font-julius text-xl tracking-wider text-mj-black">Hero</h2>
        <p className="mb-5 font-mulish text-xs text-mj-taupe">
          Imagem de fundo e textos da seção principal da homepage. Deixe vazio para usar o padrão.
        </p>
        <div className="space-y-4">
          <Field label="Imagem de fundo" hint="Faça upload ou cole uma URL (JPG, PNG, WEBP)">
            <div className="space-y-3">
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
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="Ou cole uma URL de imagem aqui"
                className={inputClass}
              />
            </div>
          </Field>
          <Field label='Etiqueta' hint='Pequeno label acima do título — ex: "Nova Coleção"'>
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
        <p className="mb-4 font-mulish text-xs text-mj-taupe">
          Define as cores do site durante a campanha. Use um atalho ou personalize abaixo.
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
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

        {/* Preview */}
        <div
          className="mb-6 flex items-center justify-between border px-5 py-4"
          style={{
            backgroundColor: colors['mj-surface'],
            borderColor: colors['mj-border'],
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-julius text-sm" style={{ color: colors['mj-text'] }}>
              MOCELLIN JOIAS
            </span>
            <span className="font-mulish text-[10px] uppercase tracking-widest" style={{ color: colors['mj-text-muted'] }}>
              Preview do tema
            </span>
          </div>
          <button
            type="button"
            className="px-4 py-2 font-mulish text-xs uppercase tracking-widest"
            style={{
              backgroundColor: colors['mj-btn'],
              color: colors['mj-btn-text'],
            }}
          >
            Adicionar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <ColorField label="Texto principal" value={colors['mj-text']} onChange={(v) => setColor('mj-text', v)} hint="títulos, preços" />
          <ColorField label="Texto secundário" value={colors['mj-text-muted']} onChange={(v) => setColor('mj-text-muted', v)} hint="categorias, legendas" />
          <ColorField label="Texto destaque" value={colors['mj-text-accent']} onChange={(v) => setColor('mj-text-accent', v)} hint="accent, italic" />
          <ColorField label="Superfície" value={colors['mj-surface']} onChange={(v) => setColor('mj-surface', v)} hint="fundo de cards" />
          <ColorField label="Fundo da página" value={colors['mj-page']} onChange={(v) => setColor('mj-page', v)} hint="fundo geral do site" />
          <ColorField label="Overlay do hero" value={colors['mj-overlay']} onChange={(v) => setColor('mj-overlay', v)} hint="gradiente sobre a foto" />
          <ColorField label="Botão — fundo" value={colors['mj-btn']} onChange={(v) => setColor('mj-btn', v)} />
          <ColorField label="Botão — texto" value={colors['mj-btn-text']} onChange={(v) => setColor('mj-btn-text', v)} />
          <ColorField label="Botão — hover" value={colors['mj-btn-hover']} onChange={(v) => setColor('mj-btn-hover', v)} />
          <ColorField label="Bordas" value={colors['mj-border']} onChange={(v) => setColor('mj-border', v)} />
        </div>
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
