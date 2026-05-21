'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export function CatalogSearch() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get('busca') ?? '')

  /* debounce de 400ms → atualiza a URL sem spam de requests */
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('busca', value.trim())
      } else {
        params.delete('busca')
      }
      startTransition(() => {
        router.replace(`/catalogo?${params.toString()}`)
      })
    }, 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative w-full sm:w-64">
      <Search
        size={14}
        strokeWidth={1.5}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mj-text-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar produto…"
        className="w-full border border-mj-border bg-mj-surface py-2 pl-9 pr-8 font-mulish text-[11px] text-mj-text placeholder:text-mj-text-muted focus:border-mj-btn focus:outline-none"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          aria-label="Limpar busca"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mj-text-muted hover:text-mj-text"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
