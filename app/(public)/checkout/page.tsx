'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import { buildWhatsAppUrl } from '@/lib/cart/whatsapp'
import { useFreteSimulator } from '@/hooks/useFreteSimulator'
import { useCepLookup } from '@/hooks/useCepLookup'
import type { CheckoutFormType, OrderPayloadType } from '@/types'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const INITIAL_FORM: CheckoutFormType = {
  name: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  delivery: 'envio',
  payment: 'pix',
}

type FormErrors = Partial<Record<keyof CheckoutFormType | 'frete', string>>

// ── helpers ────────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-lg border border-mocellin-beige bg-mocellin-white px-4 py-3 font-dm-sans text-sm text-mocellin-dark placeholder:text-mocellin-dark/30 focus:border-mocellin-gold focus:outline-none transition-colors'

const labelClass =
  'font-dm-sans text-xs uppercase tracking-widest text-mocellin-dark/50'

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            'flex-1 rounded-xl border py-3 font-dm-sans text-sm font-medium transition-colors',
            value === opt.value
              ? 'border-mocellin-gold bg-mocellin-gold text-white'
              : 'border-mocellin-beige text-mocellin-dark hover:border-mocellin-gold',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── page ───────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()

  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<CheckoutFormType>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedFreteId, setSelectedFreteId] = useState<unknown>(null)

  const { opcoes, loading: freteLoading, error: freteError } = useFreteSimulator(form.cep)
  const { street, neighborhood, city, state, loading: cepLoading, error: cepError } = useCepLookup(
    form.delivery === 'envio' ? form.cep : ''
  )

  useEffect(() => setMounted(true), [])

  // Auto-fill address when ViaCEP responds
  useEffect(() => {
    if (cepLoading || cepError) return
    if (!street && !neighborhood && !city && !state) return
    setForm((f) => ({
      ...f,
      street: street || f.street,
      neighborhood: neighborhood || f.neighborhood,
      city: city || f.city,
      state: state || f.state,
    }))
  }, [street, neighborhood, city, state, cepLoading, cepError])

  useEffect(() => {
    if (mounted && items.length === 0) router.replace('/catalogo')
  }, [mounted, items.length, router])

  // Limpa frete e endereço sempre que o CEP ou modalidade muda
  useEffect(() => {
    setSelectedFreteId(null)
    setErrors((e) => ({ ...e, frete: undefined }))
    setForm((f) => ({ ...f, street: '', neighborhood: '', city: '', state: '' }))
  }, [form.cep, form.delivery])

  if (!mounted || items.length === 0) return null

  const selectedFrete = opcoes.find((o) => o.id === selectedFreteId) ?? null
  const sub = subtotal()
  const shipping = form.delivery === 'retirada' ? null : (selectedFrete?.price ?? null)
  const total = sub + (shipping ?? 0)

  function setField(key: keyof CheckoutFormType, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = 'Nome obrigatório'
    if (!form.phone.trim()) errs.phone = 'Telefone obrigatório'
    if (form.delivery === 'envio') {
      const digits = form.cep.replace(/\D/g, '')
      if (!digits) errs.cep = 'CEP obrigatório para envio'
      else if (digits.length !== 8) errs.cep = 'CEP inválido'
      else if (!selectedFrete) errs.frete = 'Selecione uma opção de entrega'
      if (!form.street.trim()) errs.street = 'Rua obrigatória'
      if (!form.number.trim()) errs.number = 'Número obrigatório'
      if (!form.neighborhood.trim()) errs.neighborhood = 'Bairro obrigatório'
      if (!form.city.trim()) errs.city = 'Cidade obrigatória'
      if (!form.state.trim()) errs.state = 'Estado obrigatório'
    }
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const shippingName =
      form.delivery === 'retirada'
        ? 'Retirada no local'
        : selectedFrete ? `${selectedFrete.name} — ${selectedFrete.company}` : ''
    const payload: OrderPayloadType = { items, form, subtotal: sub, shipping, shippingName, total }
    const url = buildWhatsAppUrl(payload)

    window.open(url, '_blank', 'noopener,noreferrer')
    clearCart()
    router.replace('/catalogo')
  }

  const cepDigits = form.cep.replace(/\D/g, '')
  const showFreteSection = form.delivery === 'envio' && cepDigits.length === 8

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-cormorant text-4xl font-semibold text-mocellin-dark">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* ── Formulário ── */}
        <section className="flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome completo</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Seu nome"
              className={inputClass}
            />
            {errors.name && <p className="font-dm-sans text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Telefone / WhatsApp</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="(00) 00000-0000"
              className={inputClass}
            />
            {errors.phone && <p className="font-dm-sans text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Entrega</span>
            <PillGroup
              options={[
                { value: 'envio', label: 'Envio' },
                { value: 'retirada', label: 'Retirada no local' },
              ]}
              value={form.delivery}
              onChange={(v) => setField('delivery', v)}
            />
          </div>

          {form.delivery === 'envio' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>CEP</label>
                <input
                  type="text"
                  value={form.cep}
                  onChange={(e) => setField('cep', e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className={inputClass}
                />
                {errors.cep && <p className="font-dm-sans text-xs text-red-500">{errors.cep}</p>}
                {cepError && !errors.cep && (
                  <p className="font-dm-sans text-xs text-red-500">{cepError}</p>
                )}
                {freteError && !errors.cep && !cepError && (
                  <p className="font-dm-sans text-xs text-red-500">{freteError}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Rua
                  {cepLoading && <Loader2 size={11} className="ml-1.5 inline animate-spin" />}
                </label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => setField('street', e.target.value)}
                  placeholder="Nome da rua"
                  className={cepLoading ? `${inputClass} opacity-50` : inputClass}
                />
                {errors.street && <p className="font-dm-sans text-xs text-red-500">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Número</label>
                  <input
                    type="text"
                    value={form.number}
                    onChange={(e) => setField('number', e.target.value)}
                    placeholder="123"
                    className={inputClass}
                  />
                  {errors.number && <p className="font-dm-sans text-xs text-red-500">{errors.number}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Complemento</label>
                  <input
                    type="text"
                    value={form.complement}
                    onChange={(e) => setField('complement', e.target.value)}
                    placeholder="Apto, bloco…"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Bairro
                  {cepLoading && <Loader2 size={11} className="ml-1.5 inline animate-spin" />}
                </label>
                <input
                  type="text"
                  value={form.neighborhood}
                  onChange={(e) => setField('neighborhood', e.target.value)}
                  placeholder="Nome do bairro"
                  className={cepLoading ? `${inputClass} opacity-50` : inputClass}
                />
                {errors.neighborhood && <p className="font-dm-sans text-xs text-red-500">{errors.neighborhood}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Cidade
                    {cepLoading && <Loader2 size={11} className="ml-1.5 inline animate-spin" />}
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setField('city', e.target.value)}
                    placeholder="Cidade"
                    className={cepLoading ? `${inputClass} opacity-50` : inputClass}
                  />
                  {errors.city && <p className="font-dm-sans text-xs text-red-500">{errors.city}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    UF
                    {cepLoading && <Loader2 size={11} className="ml-1.5 inline animate-spin" />}
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setField('state', e.target.value)}
                    placeholder="RS"
                    maxLength={2}
                    className={cepLoading ? `${inputClass} opacity-50` : inputClass}
                  />
                  {errors.state && <p className="font-dm-sans text-xs text-red-500">{errors.state}</p>}
                </div>
              </div>
            </>
          )}

          {/* ── Opções de frete ── */}
          {showFreteSection && (
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Opções de frete</span>

              {freteLoading && (
                <div className="flex items-center gap-2 text-mocellin-dark/50">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="font-dm-sans text-sm">Calculando frete…</span>
                </div>
              )}

              {!freteLoading && !freteError && opcoes.length === 0 && (
                <p className="font-dm-sans text-sm text-mocellin-dark/50">
                  Nenhuma transportadora disponível para este CEP.
                </p>
              )}

              {!freteLoading && opcoes.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {opcoes.map((opcao) => {
                    const selected = selectedFreteId === opcao.id
                    return (
                      <li key={String(opcao.id)}>
                        <label
                          className={[
                            'flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors',
                            selected
                              ? 'border-mocellin-gold bg-mocellin-gold/5'
                              : 'border-mocellin-beige hover:border-mocellin-gold/50',
                          ].join(' ')}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="frete"
                              checked={selected}
                              onChange={() => {
                                setSelectedFreteId(opcao.id)
                                setErrors((e) => ({ ...e, frete: undefined }))
                              }}
                              className="accent-mocellin-gold"
                            />
                            <div>
                              <p className="font-dm-sans text-sm font-medium text-mocellin-dark">
                                {opcao.name} — {opcao.company}
                              </p>
                              <p className="font-dm-sans text-xs text-mocellin-dark/50">
                                {opcao.delivery_time} {opcao.delivery_time === 1 ? 'dia útil' : 'dias úteis'}
                              </p>
                            </div>
                          </div>
                          <span className="font-dm-sans text-sm font-semibold text-mocellin-dark">
                            {brl.format(opcao.price)}
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}

              {errors.frete && (
                <p className="font-dm-sans text-xs text-red-500">{errors.frete}</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Pagamento</span>
            <PillGroup
              options={[
                { value: 'pix', label: 'Pix' },
                { value: 'cartao', label: 'Cartão' },
                { value: 'dinheiro', label: 'Dinheiro' },
              ]}
              value={form.payment}
              onChange={(v) => setField('payment', v)}
            />
          </div>

        </section>

        {/* ── Resumo ── */}
        <section className="flex flex-col gap-4 rounded-2xl bg-mocellin-white p-6 h-fit lg:sticky lg:top-24">

          <h2 className="font-cormorant text-2xl font-semibold text-mocellin-dark">
            Resumo do pedido
          </h2>

          <ul className="flex flex-col divide-y divide-mocellin-beige">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-start justify-between gap-4 py-3">
                <span className="font-dm-sans text-sm leading-snug text-mocellin-dark">
                  {product.name}{' '}
                  <span className="text-mocellin-dark/40">×{quantity}</span>
                </span>
                <span className="shrink-0 font-dm-sans text-sm font-medium text-mocellin-dark">
                  {brl.format(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t border-mocellin-beige pt-4">
            <div className="flex justify-between font-dm-sans text-sm text-mocellin-dark/60">
              <span>Subtotal</span>
              <span>{brl.format(sub)}</span>
            </div>
            <div className="flex justify-between font-dm-sans text-sm text-mocellin-dark/60">
              <span>Frete</span>
              <span>
                {shipping === null && form.delivery === 'retirada' && 'Retirada no local'}
                {shipping === null && form.delivery === 'envio' && 'Selecione uma opção'}
                {shipping !== null && brl.format(shipping)}
              </span>
            </div>
            <div className="flex justify-between font-dm-sans text-base font-semibold text-mocellin-dark">
              <span>Total</span>
              <span>{brl.format(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-mocellin-gold py-3.5 font-dm-sans text-sm font-medium text-white transition-all hover:bg-mocellin-gold-light active:scale-[.98]"
          >
            Confirmar pedido via WhatsApp
          </button>

          <p className="text-center font-dm-sans text-xs text-mocellin-dark/40">
            Você será redirecionado para o WhatsApp para finalizar o pedido.
          </p>

        </section>
      </form>
    </main>
  )
}
