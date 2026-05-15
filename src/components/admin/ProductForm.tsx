'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ProductType, ProductCategory, ProductStatus } from '@/types'
import { X, Upload, Play, CheckCircle2, Loader2, Search, Star } from 'lucide-react'

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'brincos',   label: 'Brincos' },
  { value: 'aneis',     label: 'Anéis' },
  { value: 'relogios',  label: 'Relógios' },
  { value: 'colares',   label: 'Colares' },
  { value: 'oculos',    label: 'Óculos' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'pulseiras', label: 'Pulseiras e Braceletes' },
  { value: 'berloques', label: 'Berloques' },
]

export interface RelatedOption {
  id: string
  name: string
}

interface Props {
  product?: ProductType
  allProducts: RelatedOption[]
}

const inputClass =
  'w-full border border-mj-border bg-mj-cream px-4 py-3 font-mulish text-sm text-mj-black placeholder:text-mj-taupe/50 focus:border-mj-black focus:outline-none transition-colors'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 font-mulish text-xs text-red-500">{error}</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-mj-border bg-mj-white p-6">
      <h2 className="mb-5 font-julius text-xl tracking-wider text-mj-black">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

// Ponto focal — grade 3x3 para escolher o recorte da imagem
const FOCAL_POSITIONS = [
  'top left',    'top center',    'top right',
  'center left', 'center',        'center right',
  'bottom left', 'bottom center', 'bottom right',
] as const

function FocalPoint({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div title="Ponto focal do corte" className="grid grid-cols-3 gap-0.5 p-0.5 bg-mj-border/30 w-fit">
      {FOCAL_POSITIONS.map((pos) => (
        <button
          key={pos}
          type="button"
          title={pos}
          onClick={() => onChange(pos)}
          className={`h-3 w-3 transition-colors ${
            value === pos ? 'bg-mj-brown' : 'bg-mj-border hover:bg-mj-taupe/60'
          }`}
        />
      ))}
    </div>
  )
}

// Preview inline de rich text (mesma lógica do RichText público)
function parseInline(line: string) {
  return line.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-mj-black">{part.slice(2, -2)}</strong>
      : part,
  )
}
function RichPreview({ text }: { text: string }) {
  return (
    <div className="font-mulish text-sm leading-relaxed text-mj-taupe">
      {text.split(/\n{2,}/).map((para, pi) => (
        <p key={pi} className={pi > 0 ? 'mt-2' : ''}>
          {para.split('\n').map((line, li) => (
            <span key={li}>{li > 0 && <br />}{parseInline(line)}</span>
          ))}
        </p>
      ))}
    </div>
  )
}

export function ProductForm({ product, allProducts }: Props) {
  const router = useRouter()
  const isEditing = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [code, setCode] = useState(product?.code ?? '')
  const [description, setDescription] = useState<string>(product?.description ?? '')
  const [details, setDetails] = useState<string>(product?.details ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price != null ? String(product.compare_at_price) : '',
  )
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? 'brincos')
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? 'disponivel')
  const [featured, setFeatured] = useState<boolean>(product?.featured ?? false)

  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? [])
  const [existingPositions, setExistingPositions] = useState<string[]>(
    product?.images?.map((_, i) => product?.image_positions?.[i] ?? 'center') ?? [],
  )
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [newImagePositions, setNewImagePositions] = useState<string[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [existingVideos, setExistingVideos] = useState<string[]>(product?.videos ?? [])
  const [newVideoFiles, setNewVideoFiles] = useState<File[]>([])
  const videoInputRef = useRef<HTMLInputElement>(null)

  const [relatedIds, setRelatedIds] = useState<string[]>(product?.related_ids ?? [])
  const [relatedSearch, setRelatedSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => router.replace('/admin'), 1500)
    return () => clearTimeout(t)
  }, [success, router])

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Nome é obrigatório.'
    const p = parseFloat(price)
    if (!price.trim() || isNaN(p) || p <= 0) e.price = 'Preço deve ser maior que zero.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const previews = files.map((f) => URL.createObjectURL(f))
    setNewImageFiles((prev) => [...prev, ...files])
    setNewImagePreviews((prev) => [...prev, ...previews])
    setNewImagePositions((prev) => [...prev, ...files.map(() => 'center')])
    e.target.value = ''
  }

  function removeNewImage(i: number) {
    URL.revokeObjectURL(newImagePreviews[i])
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== i))
    setNewImagePreviews((prev) => prev.filter((_, idx) => idx !== i))
    setNewImagePositions((prev) => prev.filter((_, idx) => idx !== i))
  }

  function removeExistingImage(i: number) {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i))
    setExistingPositions((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setNewVideoFiles((prev) => [...prev, ...files])
    e.target.value = ''
  }

  async function uploadFiles(files: File[], bucket: string): Promise<string[]> {
    const supabase = createClient()
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop() ?? ''
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType: file.type })
      if (error) throw new Error(`Erro ao enviar "${file.name}": ${error.message}`)
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path)
      urls.push(publicUrl)
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const supabase = createClient()

      const newImageUrls = await uploadFiles(newImageFiles, 'product-images')
      const images = [...existingImages, ...newImageUrls]
      const image_positions = [...existingPositions, ...newImagePositions]

      const newVideoUrls = await uploadFiles(newVideoFiles, 'product-videos')
      const videos = [...existingVideos, ...newVideoUrls]

      const parsedCompare = parseFloat(compareAtPrice)
      const payload = {
        name: name.trim(),
        code: code.trim() || null,
        description: description.trim() || null,
        details: details.trim() || null,
        price: parseFloat(price),
        compare_at_price:
          compareAtPrice.trim() && !isNaN(parsedCompare) && parsedCompare > 0
            ? parsedCompare
            : null,
        category,
        status,
        featured,
        images,
        image_positions: image_positions.length > 0 ? image_positions : null,
        videos: videos.length > 0 ? videos : null,
        related_ids: relatedIds.length > 0 ? relatedIds : null,
        updated_at: new Date().toISOString(),
      }

      if (isEditing && product) {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
      }

      setSuccess(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar produto.'
      setErrors({ _global: msg })
      setLoading(false)
    }
  }

  const filteredRelated = relatedSearch.trim()
    ? allProducts
        .filter(
          (p) =>
            p.id !== product?.id &&
            !relatedIds.includes(p.id) &&
            p.name.toLowerCase().includes(relatedSearch.toLowerCase()),
        )
        .slice(0, 8)
    : []

  const selectedRelated = allProducts.filter((p) => relatedIds.includes(p.id))

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      {success && (
        <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          <CheckCircle2 size={16} />
          <span className="font-mulish text-sm font-medium">
            Produto {isEditing ? 'atualizado' : 'criado'} com sucesso! Redirecionando…
          </span>
        </div>
      )}

      {errors._global && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 font-mulish text-sm text-red-600">
          {errors._global}
        </div>
      )}

      {/* ── Informações básicas ─────────────────────────────── */}
      <Section title="Informações básicas">
        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
          <Field label="Nome" error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Brinco Dourado Gotas"
              className={inputClass}
            />
          </Field>

          <Field label="Código (SKU)">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: MJ-001"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Descrição">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descrição breve do produto…"
            className={`${inputClass} resize-none`}
          />
          <p className="mt-1.5 font-mulish text-[10px] text-mj-taupe/60">
            Formatação: <code className="bg-mj-border/40 px-1">**negrito**</code> · linha em branco = novo parágrafo
          </p>
          {description.trim() && (
            <div className="mt-2 border border-dashed border-mj-border bg-mj-cream/30 px-4 py-3">
              <p className="mb-1.5 font-mulish text-[9px] uppercase tracking-[0.2em] text-mj-taupe/50">Prévia</p>
              <RichPreview text={description} />
            </div>
          )}
        </Field>

        <Field label="Detalhes (materiais, cuidados)">
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            placeholder="Ex: Banhado a ouro 18k. Evite contato com água e perfumes…"
            className={`${inputClass} resize-none`}
          />
          <p className="mt-1.5 font-mulish text-[10px] text-mj-taupe/60">
            Formatação: <code className="bg-mj-border/40 px-1">**negrito**</code> · linha em branco = novo parágrafo
          </p>
          {details.trim() && (
            <div className="mt-2 border border-dashed border-mj-border bg-mj-cream/30 px-4 py-3">
              <p className="mb-1.5 font-mulish text-[9px] uppercase tracking-[0.2em] text-mj-taupe/50">Prévia</p>
              <RichPreview text={details} />
            </div>
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Preço (R$)" error={errors.price}>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className={inputClass}
            />
          </Field>

          <Field label="Preço original (R$)">
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="Deixe vazio se não houver"
              className={inputClass}
            />
          </Field>

          <Field label="Categoria">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className={inputClass}
            >
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Status">
          <div className="flex gap-2">
            {(['disponivel', 'esgotado'] as ProductStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-4 py-2 font-mulish text-sm font-medium transition-colors ${
                  status === s
                    ? s === 'disponivel'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'border border-mj-border text-mj-taupe hover:border-mj-black hover:text-mj-black'
                }`}
              >
                {s === 'disponivel' ? 'Disponível' : 'Esgotado'}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Destaque na home">
          <button
            type="button"
            onClick={() => setFeatured((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 font-mulish text-sm font-medium transition-colors ${
              featured
                ? 'bg-mj-brown text-white'
                : 'border border-mj-border text-mj-taupe hover:border-mj-black hover:text-mj-black'
            }`}
          >
            <Star size={14} fill={featured ? 'currentColor' : 'none'} />
            {featured ? 'Em destaque' : 'Não destacado'}
          </button>
        </Field>
      </Section>

      {/* ── Imagens ─────────────────────────────────────────── */}
      <Section title="Imagens">
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {existingImages.map((url, i) => (
              <div key={url} className="flex flex-col items-center gap-1.5">
                <div className="relative h-24 w-24 overflow-hidden border border-mj-border bg-mj-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ objectPosition: existingPositions[i] ?? 'center' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute right-1 top-1 bg-black/50 p-0.5 text-white transition-colors hover:bg-black/70"
                  >
                    <X size={12} />
                  </button>
                </div>
                <FocalPoint
                  value={existingPositions[i] ?? 'center'}
                  onChange={(pos) =>
                    setExistingPositions((prev) => prev.map((p, idx) => (idx === i ? pos : p)))
                  }
                />
              </div>
            ))}
          </div>
        )}

        {newImagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {newImagePreviews.map((src, i) => (
              <div key={src} className="flex flex-col items-center gap-1.5">
                <div className="relative h-24 w-24 overflow-hidden border-2 border-dashed border-mj-brown/50 bg-mj-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ objectPosition: newImagePositions[i] ?? 'center' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute right-1 top-1 bg-black/50 p-0.5 text-white transition-colors hover:bg-black/70"
                  >
                    <X size={12} />
                  </button>
                </div>
                <FocalPoint
                  value={newImagePositions[i] ?? 'center'}
                  onChange={(pos) =>
                    setNewImagePositions((prev) => prev.map((p, idx) => (idx === i ? pos : p)))
                  }
                />
              </div>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer flex-col items-center gap-2 border-2 border-dashed border-mj-border bg-mj-cream/40 py-8 transition-colors hover:border-mj-black hover:bg-mj-cream">
          <Upload size={22} className="text-mj-taupe/50" />
          <span className="font-mulish text-sm text-mj-taupe">
            Clique para adicionar imagens
          </span>
          <span className="font-mulish text-xs text-mj-taupe/50">JPG, PNG, WEBP</span>
          <input
            ref={imageInputRef}
            type="file"
            className="sr-only"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageChange}
          />
        </label>
      </Section>

      {/* ── Vídeos ──────────────────────────────────────────── */}
      <Section title="Vídeos">
        {existingVideos.length > 0 && (
          <ul className="space-y-2">
            {existingVideos.map((url, i) => (
              <li
                key={url}
                className="flex items-center justify-between gap-3 border border-mj-border bg-mj-cream/40 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-mj-border">
                    <Play size={14} className="text-mj-taupe" />
                  </div>
                  <span className="truncate font-mulish text-xs text-mj-taupe">
                    {url.split('/').pop()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setExistingVideos((prev) => prev.filter((_, idx) => idx !== i))}
                  className="shrink-0 p-1 text-mj-taupe/50 transition-colors hover:text-mj-black"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {newVideoFiles.length > 0 && (
          <ul className="space-y-2">
            {newVideoFiles.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-3 border-2 border-dashed border-mj-brown/40 bg-mj-cream/40 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-mj-brown/10">
                    <Play size={14} className="text-mj-brown" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-mulish text-xs font-medium text-mj-black">
                      {file.name}
                    </p>
                    <p className="font-mulish text-[10px] text-mj-taupe">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNewVideoFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="shrink-0 p-1 text-mj-taupe/50 transition-colors hover:text-mj-black"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="flex cursor-pointer flex-col items-center gap-2 border-2 border-dashed border-mj-border bg-mj-cream/40 py-8 transition-colors hover:border-mj-black hover:bg-mj-cream">
          <Upload size={22} className="text-mj-taupe/50" />
          <span className="font-mulish text-sm text-mj-taupe">
            Clique para adicionar vídeos
          </span>
          <span className="font-mulish text-xs text-mj-taupe/50">MP4, MOV, WEBM</span>
          <input
            ref={videoInputRef}
            type="file"
            className="sr-only"
            multiple
            accept=".mp4,.mov,.webm"
            onChange={handleVideoChange}
          />
        </label>
      </Section>

      {/* ── Produtos relacionados ────────────────────────────── */}
      <Section title="Produtos relacionados">
        {selectedRelated.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedRelated.map((p) => (
              <span
                key={p.id}
                className="flex items-center gap-1.5 border border-mj-border bg-mj-cream px-3 py-1 font-mulish text-xs text-mj-black"
              >
                {p.name}
                <button
                  type="button"
                  onClick={() => setRelatedIds((prev) => prev.filter((id) => id !== p.id))}
                  className="text-mj-taupe/50 transition-colors hover:text-mj-black"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-mj-taupe/50"
            />
            <input
              type="text"
              value={relatedSearch}
              onChange={(e) => {
                setRelatedSearch(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Buscar produto por nome…"
              className={`${inputClass} pl-9`}
            />
          </div>

          {showDropdown && filteredRelated.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full overflow-hidden border border-mj-border bg-mj-white shadow-md">
              {filteredRelated.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseDown={() => {
                      setRelatedIds((prev) => [...prev, p.id])
                      setRelatedSearch('')
                      setShowDropdown(false)
                    }}
                    className="w-full px-4 py-2.5 text-left font-mulish text-sm text-mj-black transition-colors hover:bg-mj-cream"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* ── Submit ───────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || success}
          className="flex items-center gap-2 bg-mj-black px-6 py-3 font-mulish text-sm text-white transition-all hover:bg-mj-brown active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Salvando…' : isEditing ? 'Atualizar produto' : 'Criar produto'}
        </button>
      </div>
    </form>
  )
}
