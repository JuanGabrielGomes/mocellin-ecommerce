'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Package, PlusCircle, LogOut, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/admin', label: 'Produtos', icon: Package },
  { href: '/admin/produtos/novo', label: 'Adicionar produto', icon: PlusCircle },
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
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-dm-sans text-sm transition-colors ${
                active
                  ? 'bg-mocellin-gold/10 text-mocellin-gold font-medium'
                  : 'text-mocellin-dark/60 hover:bg-mocellin-beige hover:text-mocellin-dark'
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
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-dm-sans text-sm text-mocellin-dark/50 transition-colors hover:bg-mocellin-beige hover:text-mocellin-dark"
    >
      <LogOut size={16} />
      Sair
    </button>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen w-56 shrink-0 flex-col border-r border-mocellin-beige bg-mocellin-white px-4 py-6 sticky top-0">
        <div className="mb-8 px-3">
          <p className="font-cormorant text-xl font-semibold tracking-widest text-mocellin-dark">
            MOCELLIN JOIAS
          </p>
          <p className="mt-0.5 font-dm-sans text-[10px] uppercase tracking-widest text-mocellin-dark/40">
            Painel admin
          </p>
        </div>

        <NavLinks />

        <div className="mt-auto">
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-mocellin-beige bg-mocellin-white px-4 py-3">
        <p className="font-cormorant text-lg font-semibold tracking-widest text-mocellin-dark">
          MOCELLIN JOIAS
        </p>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          className="rounded-lg p-1.5 text-mocellin-dark/60 transition-colors hover:bg-mocellin-beige"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[49px] z-30 border-b border-mocellin-beige bg-mocellin-white px-4 py-4 shadow-md">
          <NavLinks onClick={() => setMobileOpen(false)} />
          <div className="mt-4 border-t border-mocellin-beige pt-4">
            <SignOutButton onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
