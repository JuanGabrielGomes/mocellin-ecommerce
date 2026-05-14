'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  const inputClass =
    'w-full rounded-lg border border-mocellin-beige bg-mocellin-cream px-4 py-3 font-dm-sans text-sm text-mocellin-dark placeholder:text-mocellin-dark/30 focus:border-mocellin-gold focus:outline-none transition-colors'

  return (
    <main className="flex min-h-screen items-center justify-center bg-mocellin-cream px-4">
      <div className="w-full max-w-sm rounded-2xl bg-mocellin-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="font-cormorant text-2xl font-semibold tracking-widest text-mocellin-dark">
            MOCELLIN JOIAS
          </p>
          <p className="mt-1 font-dm-sans text-xs uppercase tracking-widest text-mocellin-dark/40">
            Área restrita
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-dm-sans text-xs uppercase tracking-widest text-mocellin-dark/50">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-dm-sans text-xs uppercase tracking-widest text-mocellin-dark/50">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="font-dm-sans text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-mocellin-gold py-3.5 font-dm-sans text-sm font-medium text-white transition-all hover:bg-mocellin-gold-light active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
