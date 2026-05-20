import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-mj-page px-5 text-center">
      <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-text-muted">
        Erro 404
      </p>
      <h1 className="mt-4 font-julius text-4xl tracking-wider text-mj-text sm:text-5xl">
        PÁGINA NÃO ENCONTRADA
      </h1>
      <p className="mt-6 font-mulish text-sm leading-relaxed text-mj-text-muted max-w-xs">
        O endereço que você acessou não existe ou foi removido.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="border border-mj-btn px-8 py-3 font-mulish text-xs uppercase tracking-[0.2em] text-mj-btn transition-all hover:bg-mj-btn hover:text-mj-btn-text"
        >
          Voltar ao início
        </Link>
        <Link
          href="/catalogo"
          className="bg-mj-btn px-8 py-3 font-mulish text-xs uppercase tracking-[0.2em] text-mj-btn-text transition-all hover:bg-mj-btn-hover"
        >
          Ver catálogo
        </Link>
      </div>
    </main>
  )
}
