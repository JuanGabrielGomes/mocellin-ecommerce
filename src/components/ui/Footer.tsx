import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-mj-border bg-mj-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Marca */}
          <div className="flex flex-col gap-3">
            <p className="font-julius text-sm tracking-[0.25em] text-mj-black">
              MOCELLIN JOIAS
            </p>
            <p className="font-mulish text-xs leading-relaxed text-mj-taupe max-w-xs">
              Joias e semijoias escolhidas com cuidado para acompanhar
              presentes, rituais e pequenos marcos do cotidiano.
            </p>
          </div>

          {/* Navegação */}
          <div className="flex flex-col gap-3">
            <p className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
              Navegação
            </p>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Início' },
                { href: '/catalogo', label: 'Catálogo' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-mulish text-sm text-mj-black/70 transition-colors hover:text-mj-black"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-3">
            <p className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
              Contato
            </p>
            <a
              href="https://wa.me/5554991379272"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mulish text-sm text-mj-black/70 transition-colors hover:text-mj-black"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/mocellinjoias"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mulish text-sm text-mj-black/70 transition-colors hover:text-mj-black"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-mj-border pt-8 sm:flex-row">
          <p className="font-mulish text-xs text-mj-taupe">
            © {new Date().getFullYear()} Mocellin Joias. Todos os direitos reservados.
          </p>
          <Link
            href="/admin"
            className="font-mulish text-[10px] text-mj-border transition-colors hover:text-mj-taupe"
          >
            Administração
          </Link>
        </div>
      </div>
    </footer>
  )
}
