'use client'

import { useState } from 'react'
import { Ruler, X } from 'lucide-react'

const SIZES = Array.from({ length: 24 }, (_, i) => ({
  size: i + 10,
  cm: (5.0 + i * 0.1).toFixed(1),
}))

const STEPS = [
  'Envolva o dedo com um fio ou tira de papel fino no ponto onde o anel ficará.',
  'Marque o ponto onde as pontas se encontram e meça o comprimento com uma régua.',
  'Encontre a medida abaixo para descobrir o número correspondente.',
]

export function RingSizeGuide() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 font-mulish text-xs uppercase tracking-[0.15em] text-mj-text-muted underline underline-offset-4 hover:text-mj-text transition-colors"
      >
        <Ruler size={13} />
        Descobrir tamanho
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Guia de tamanhos de anel"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-mj-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-julius text-xl tracking-wider text-mj-text">
                DESCUBRA SEU TAMANHO
              </h2>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
                className="p-1 text-mj-text-muted hover:text-mj-text transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Passos */}
            <ol className="space-y-3 mb-6">
              {STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-mj-page font-mulish text-xs font-semibold text-mj-text">
                    {i + 1}
                  </span>
                  <p className="font-mulish text-sm leading-relaxed text-mj-text-muted">{step}</p>
                </li>
              ))}
            </ol>

            <hr className="border-mj-border mb-5" />

            {/* Tabela de tamanhos — 4 colunas: Tam | Medida | Tam | Medida */}
            <div className="overflow-hidden rounded-lg border border-mj-border">
              <div className="grid grid-cols-4">
                {/* Cabeçalho */}
                {['Tam.', 'Medida', 'Tam.', 'Medida'].map((h, i) => (
                  <div
                    key={i}
                    className="border-b border-mj-border bg-mj-page px-3 py-2 text-center font-mulish text-[10px] uppercase tracking-widest text-mj-text-muted"
                  >
                    {h}
                  </div>
                ))}

                {/* Linhas — 12 pares */}
                {Array.from({ length: 12 }, (_, row) => {
                  const a = SIZES[row * 2]
                  const b = SIZES[row * 2 + 1]
                  const isLast = row === 11
                  const base = isLast ? '' : 'border-b border-mj-border'
                  return [
                    <div key={`${a.size}-sz`} className={`${base} px-3 py-2.5 text-center font-mulish text-sm font-medium text-mj-text`}>{a.size}</div>,
                    <div key={`${a.size}-cm`} className={`${base} px-3 py-2.5 text-center font-mulish text-sm text-mj-text-muted`}>{a.cm} cm</div>,
                    <div key={`${b.size}-sz`} className={`${base} bg-mj-page/60 px-3 py-2.5 text-center font-mulish text-sm font-medium text-mj-text`}>{b.size}</div>,
                    <div key={`${b.size}-cm`} className={`${base} bg-mj-page/60 px-3 py-2.5 text-center font-mulish text-sm text-mj-text-muted`}>{b.cm} cm</div>,
                  ]
                })}
              </div>
            </div>

            <p className="mt-4 text-center font-mulish text-xs text-mj-text-muted">
              Dúvidas? Fale conosco pelo WhatsApp.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
