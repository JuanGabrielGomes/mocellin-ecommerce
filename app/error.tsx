'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-mj-page px-5 text-center">
      <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-muted">
        Algo deu errado
      </p>
      <h1 className="mt-4 font-julius text-4xl tracking-wider text-mj-text sm:text-5xl">
        ERRO INESPERADO
      </h1>
      <p className="mt-6 font-mulish text-sm leading-relaxed text-mj-text-muted max-w-xs">
        Ocorreu um erro ao carregar esta página. Por favor, tente novamente.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="bg-mj-btn px-8 py-3 font-mulish text-xs uppercase tracking-[0.2em] text-mj-btn-text transition-all hover:bg-mj-btn-hover"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="border border-mj-btn px-8 py-3 font-mulish text-xs uppercase tracking-[0.2em] text-mj-btn transition-all hover:bg-mj-btn hover:text-mj-btn-text"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
