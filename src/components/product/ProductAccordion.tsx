'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ProductAccordionProps {
  details: string
}

export function ProductAccordion({ details }: ProductAccordionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-mocellin-beige">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-dm-sans text-sm font-medium text-mocellin-dark">
          Detalhes do produto
        </span>
        <ChevronDown
          size={18}
          className={[
            'shrink-0 text-mocellin-dark/50 transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {open && (
        <p className="pb-5 font-dm-sans text-sm leading-relaxed text-mocellin-dark/70 whitespace-pre-line">
          {details}
        </p>
      )}
    </div>
  )
}
