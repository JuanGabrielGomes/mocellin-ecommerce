import Link from 'next/link'
import { STORE } from '@/lib/config'

export function Footer() {
  return (
    <footer className="border-t border-mj-border bg-mj-surface">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Marca */}
          <div className="flex flex-col gap-3">
            <p className="font-julius text-sm tracking-[0.25em] text-mj-text">
              MOCELLIN JOIAS
            </p>
            <p className="font-mulish text-xs leading-relaxed text-mj-text-muted max-w-xs">
              Joias e semijoias escolhidas com cuidado para acompanhar
              presentes, rituais e pequenos marcos do cotidiano.
            </p>
          </div>

          {/* Navegação */}
          <div className="flex flex-col gap-3">
            <p className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted">
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
                  className="font-mulish text-sm text-mj-text-muted transition-colors hover:text-mj-text-accent"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-3">
            <p className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-text-muted">
              Contato
            </p>
            <a
              href={STORE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mulish text-sm text-mj-text-muted transition-colors hover:text-mj-text-accent"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${STORE.email}`}
              className="font-mulish text-sm text-mj-text-muted transition-colors hover:text-mj-text-accent"
            >
              {STORE.email}
            </a>
            <a
              href={STORE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mulish text-sm text-mj-text-muted transition-colors hover:text-mj-text-accent"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-mj-border pt-8 sm:flex-row">
          <p className="font-mulish text-xs text-mj-text-muted">
            © {new Date().getFullYear()} {STORE.name}. Todos os direitos reservados.
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
