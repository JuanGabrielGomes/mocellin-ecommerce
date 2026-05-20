'use client'

import { useEffect } from 'react'

export default function AdminError({
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted">
        Erro no painel
      </p>
      <h2 className="font-julius text-2xl tracking-wider text-mj-text">
        ALGO DEU ERRADO
      </h2>
      <p className="font-mulish text-sm text-mj-text-muted max-w-xs">
        Ocorreu um erro inesperado. Tente novamente ou recarregue a página.
      </p>
      <button
        onClick={reset}
        className="mt-2 bg-mj-btn px-6 py-3 font-mulish text-xs uppercase tracking-[0.2em] text-mj-btn-text transition-all hover:bg-mj-btn-hover"
      >
        Tentar novamente
      </button>
    </div>
  )
}
