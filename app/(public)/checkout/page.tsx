'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Clock } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import { buildWhatsAppUrl } from '@/lib/cart/whatsapp'
import { useFreteSimulator } from '@/hooks/useFreteSimulator'
import { useCepLookup } from '@/hooks/useCepLookup'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/config'
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

const inputClass =
  'w-full border border-mj-border bg-mj-surface px-4 py-3 font-mulish text-sm text-mj-text placeholder:text-mj-text-muted/50 focus:border-mj-btn focus:outline-none transition-colors'

const labelClass =
  'font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted'

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
            'flex-1 border py-3 font-mulish text-xs uppercase tracking-[0.1em] transition-colors',
            value === opt.value
              ? 'border-mj-btn bg-mj-btn text-mj-btn-text'
              : 'border-mj-border text-mj-text-muted hover:border-mj-btn hover:text-mj-btn',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()

  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<CheckoutFormType>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedFreteId, setSelectedFreteId] = useState<string | number | null>(null)

  const { opcoes, loading: freteLoading, error: freteError } = useFreteSimulator(form.cep)
  const { street, neighborhood, city, state, loading: cepLoading, error: cepError } = useCepLookup(
    form.delivery === 'envio' ? form.cep : ''
  )

  useEffect(() => setMounted(true), [])

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

  useEffect(() => {
    setSelectedFreteId(null)
    setErrors((e) => ({ ...e, frete: undefined }))
    setForm((f) => ({ ...f, street: '', neighborhood: '', city: '', state: '' }))
  }, [form.cep, form.delivery])

  if (!mounted || items.length === 0) return null

  const selectedFrete = opcoes.find((o) => o.id === selectedFreteId) ?? null
  const sub = subtotal()
  const freeShipping = form.delivery === 'envio' && sub >= FREE_SHIPPING_THRESHOLD
  const shipping = form.delivery === 'retirada' ? null : freeShipping ? 0 : (selectedFrete?.price ?? null)
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
      else if (!freeShipping && !selectedFrete) errs.frete = 'Selecione uma opção de entrega'
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
        : freeShipping
        ? 'Frete Grátis'
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
    <main className="pt-20 sm:pt-24">
      {/* Topo */}
      <div className="border-b border-mj-border bg-mj-surface px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-muted">Mocellin Joias</p>
          <h1 className="mt-2 font-julius text-3xl tracking-wider text-mj-text sm:text-4xl">CHECKOUT</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">

          {/* ── Formulário ── */}
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="font-julius text-lg tracking-wider text-mj-text">DADOS DE CONTATO</h2>
              <div className="mt-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Nome completo</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Seu nome"
                    className={inputClass}
                  />
                  {errors.name && <p className="font-mulish text-xs text-red-500">{errors.name}</p>}
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
                  {errors.phone && <p className="font-mulish text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-mj-border pt-6">
              <h2 className="font-julius text-lg tracking-wider text-mj-text">ENTREGA</h2>
              <div className="mt-5 flex flex-col gap-4">
                <PillGroup
                  options={[
                    { value: 'envio', label: 'Envio' },
                    { value: 'retirada', label: 'Retirada no local' },
                  ]}
                  value={form.delivery}
                  onChange={(v) => setField('delivery', v)}
                />

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
                      {errors.cep && <p className="font-mulish text-xs text-red-500">{errors.cep}</p>}
                      {cepError && !errors.cep && (
                        <p className="font-mulish text-xs text-red-500">{cepError}</p>
                      )}
                      {freteError && !errors.cep && !cepError && (
                        <p className="font-mulish text-xs text-red-500">{freteError}</p>
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
                      {errors.street && <p className="font-mulish text-xs text-red-500">{errors.street}</p>}
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
                        {errors.number && <p className="font-mulish text-xs text-red-500">{errors.number}</p>}
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
                      {errors.neighborhood && <p className="font-mulish text-xs text-red-500">{errors.neighborhood}</p>}
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
                        {errors.city && <p className="font-mulish text-xs text-red-500">{errors.city}</p>}
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
                        {errors.state && <p className="font-mulish text-xs text-red-500">{errors.state}</p>}
                      </div>
                    </div>
                  </>
                )}

                {/* Frete grátis */}
                {freeShipping && (
                  <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <span className="text-emerald-600">✓</span>
                    <div>
                      <p className="font-mulish text-xs font-semibold uppercase tracking-[0.1em] text-emerald-800">
                        Frete Grátis
                      </p>
                      <p className="font-mulish text-[11px] text-emerald-700">
                        Pedidos acima de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(FREE_SHIPPING_THRESHOLD)} têm frete grátis.
                      </p>
                    </div>
                  </div>
                )}

                {/* Opções de frete */}
                {!freeShipping && showFreteSection && (
                  <div className="flex flex-col gap-2">
                    <span className={labelClass}>Opções de frete</span>

                    {freteLoading && (
                      <div className="flex items-center gap-2 text-mj-text-muted">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="font-mulish text-sm">Calculando frete…</span>
                      </div>
                    )}

                    {!freteLoading && !freteError && opcoes.length === 0 && (
                      <p className="font-mulish text-sm text-mj-text-muted">
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
                                  'flex cursor-pointer items-center justify-between border p-4 transition-colors',
                                  selected
                                    ? 'border-mj-btn bg-mj-btn/5'
                                    : 'border-mj-border hover:border-mj-btn',
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
                                    className="accent-mj-btn"
                                  />
                                  <div>
                                    <p className="font-mulish text-sm font-medium text-mj-text">
                                      {opcao.name} — {opcao.company}
                                    </p>
                                    <p className="font-mulish text-xs text-mj-text-muted">
                                      {opcao.delivery_time} {opcao.delivery_time === 1 ? 'dia útil' : 'dias úteis'}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-mulish text-sm font-medium text-mj-black">
                                  {brl.format(opcao.price)}
                                </span>
                              </label>
                            </li>
                          )
                        })}
                      </ul>
                    )}

                    {errors.frete && (
                      <p className="font-mulish text-xs text-red-500">{errors.frete}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-mj-border pt-6">
              <h2 className="font-julius text-lg tracking-wider text-mj-text">PAGAMENTO</h2>
              <div className="mt-5">
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
            </div>
          </section>

          {/* ── Resumo ── */}
          <section className="flex flex-col gap-4 border border-mj-border bg-mj-surface p-6 h-fit lg:sticky lg:top-28">
            <h2 className="font-julius text-lg tracking-wider text-mj-text">RESUMO DO PEDIDO</h2>

            <ul className="flex flex-col divide-y divide-mj-border">
              {items.map(({ product, quantity, size }) => (
                <li key={product.id + (size ?? '')} className="flex items-start justify-between gap-4 py-3">
                  <span className="font-mulish text-sm leading-snug text-mj-text">
                    {product.name}
                    {size && (
                      <span className="text-mj-text-muted"> — {size}</span>
                    )}{' '}
                    <span className="text-mj-text-muted">×{quantity}</span>
                  </span>
                  <span className="shrink-0 font-mulish text-sm font-medium text-mj-text">
                    {brl.format(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 border-t border-mj-border pt-4">
              <div className="flex justify-between font-mulish text-sm text-mj-text-muted">
                <span>Subtotal</span>
                <span>{brl.format(sub)}</span>
              </div>
              <div className="flex justify-between font-mulish text-sm text-mj-text-muted">
                <span>Frete</span>
                <span className={freeShipping ? 'font-semibold text-emerald-600' : ''}>
                  {form.delivery === 'retirada' && 'Retirada no local'}
                  {form.delivery === 'envio' && freeShipping && 'Grátis'}
                  {form.delivery === 'envio' && !freeShipping && shipping === null && 'Selecione uma opção'}
                  {form.delivery === 'envio' && !freeShipping && shipping !== null && brl.format(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-mulish text-base font-semibold text-mj-text">
                <span>Total</span>
                <span>{brl.format(total)}</span>
              </div>
            </div>

            {/* Aviso de pré-venda */}
            {items.some((i) => i.product.status === 'pre_venda') && (
              <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3">
                <Clock size={13} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-mulish text-xs font-semibold uppercase tracking-[0.1em] text-amber-800">
                    Itens em Pré-venda
                  </p>
                  <p className="mt-0.5 font-mulish text-[11px] leading-relaxed text-amber-700">
                    {items.filter((i) => i.product.status === 'pre_venda').map((i) => i.product.name).join(', ')} — o prazo de entrega especial será combinado diretamente via WhatsApp.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full bg-mj-btn py-4 font-mulish text-xs uppercase tracking-[0.2em] text-mj-btn-text transition-all hover:bg-mj-btn-hover active:scale-[.98]"
            >
              Confirmar via WhatsApp
            </button>

            <p className="text-center font-mulish text-[11px] text-mj-text-muted">
              Você será redirecionado para o WhatsApp para finalizar.
            </p>
          </section>
        </div>
      </form>
    </main>
  )
}
