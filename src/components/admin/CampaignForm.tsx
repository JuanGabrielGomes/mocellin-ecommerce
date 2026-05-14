'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CampaignType } from '@/types'
import { CheckCircle2, Loader2 } from 'lucide-react'

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

const PRESETS = [
  {
    label: 'Dia dos Namorados',
    banner_bg: '#6B0F1A',
    banner_text_color: '#FFD6E0',
    colors: {
      'mj-black':  '#3D0010',
      'mj-brown':  '#A8003B',
      'mj-beige':  '#FFD6E0',
      'mj-taupe':  '#C06080',
      'mj-cream':  '#FFF0F5',
      'mj-white':  '#FFFAFB',
      'mj-border': '#F4C0CE',
    },
  },
  {
    label: 'Black Friday',
    banner_bg: '#0a0a0a',
    banner_text_color: '#F0A855',
    colors: {
      'mj-black':  '#0a0a0a',
      'mj-brown':  '#c17f24',
      'mj-beige':  '#F0A855',
      'mj-taupe':  '#888',
      'mj-cream':  '#141414',
      'mj-white':  '#1c1c1c',
      'mj-border': '#333',
    },
  },
  {
    label: 'Natal',
    banner_bg: '#1B4332',
    banner_text_color: '#FFE8A3',
    colors: {
      'mj-black':  '#0D2B1D',
      'mj-brown':  '#B5451B',
      'mj-beige':  '#FFE8A3',
      'mj-taupe':  '#6B8F71',
      'mj-cream':  '#F4FBF6',
      'mj-white':  '#FAFFF8',
      'mj-border': '#C8E6C9',
    },
  },
  {
    label: 'Padrão (sem tema)',
    banner_bg: '#1a0a0a',
    banner_text_color: '#f5e6d3',
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

  function applyPreset(idx: number) {
    const p = PRESETS[idx]
    setBannerBg(p.banner_bg)
    setBannerTextColor(p.banner_text_color)
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
