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
    <div className="border-b border-mj-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-mulish text-xs uppercase tracking-[0.15em] text-mj-text">{title}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={[
            'shrink-0 text-mj-text-muted transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {/* Grid trick: animates grid-template-rows from 0fr → 1fr without JS measurement */}
      <div
        className={[
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <div className="pb-4 font-mulish text-sm leading-relaxed text-mj-text-muted">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
