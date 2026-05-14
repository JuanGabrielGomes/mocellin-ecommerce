'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-mocellin-beige">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-dm-sans text-sm font-medium text-mocellin-dark">{title}</span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={[
            'shrink-0 text-mocellin-dark/50 transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {/* Grid trick: anima grid-template-rows de 0fr → 1fr sem JS de medição */}
      <div
        className={[
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <div className="pb-4 font-dm-sans text-sm leading-relaxed text-mocellin-dark/70">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
