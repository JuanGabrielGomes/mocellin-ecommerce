'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Package, PlusCircle, LogOut, Menu, X, Megaphone } from 'lucide-react'

const NAV_LINKS = [
  { href: '/admin', label: 'Produtos', icon: Package },
  { href: '/admin/produtos/novo', label: 'Adicionar produto', icon: PlusCircle },
  { href: '/admin/campanhas', label: 'Campanhas', icon: Megaphone },
]

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  function NavLinks({ onClick }: { onClick?: () => void }) {
    return (
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className={`flex items-center gap-3 px-3 py-2.5 font-mulish text-sm transition-colors ${
                active
                  ? 'bg-mj-black text-white'
                  : 'text-mj-taupe hover:bg-mj-border hover:text-mj-black'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
    )
  }

  const SignOutButton = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={() => { onClick?.(); handleSignOut() }}
      className="flex w-full items-center gap-3 px-3 py-2.5 font-mulish text-sm text-mj-taupe transition-colors hover:bg-mj-border hover:text-mj-black"
    >
      <LogOut size={16} />
      Sair
    </button>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen w-56 shrink-0 flex-col border-r border-mj-border bg-mj-white px-4 py-6 sticky top-0">
        <div className="mb-8 px-3">
          <p className="font-julius text-lg tracking-[0.2em] text-mj-black">MOCELLIN JOIAS</p>
          <p className="mt-0.5 font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
            Painel admin
          </p>
        </div>

        <NavLinks />

        <div className="mt-auto">
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-mj-border bg-mj-white px-4 py-3">
        <p className="font-julius text-base tracking-[0.2em] text-mj-black">MOCELLIN JOIAS</p>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          className="p-1.5 text-mj-taupe transition-colors hover:text-mj-black"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[49px] z-30 border-b border-mj-border bg-mj-white px-4 py-4 shadow-md">
          <NavLinks onClick={() => setMobileOpen(false)} />
          <div className="mt-4 border-t border-mj-border pt-4">
            <SignOutButton onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
