'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
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

    router.push('/admin')
  }

  const inputClass =
    'w-full border border-mj-border bg-mj-cream px-4 py-3 font-mulish text-sm text-mj-black placeholder:text-mj-taupe/50 focus:border-mj-black focus:outline-none transition-colors'

  return (
    <main className="flex min-h-screen items-center justify-center bg-mj-cream px-4">
      <div className="w-full max-w-sm border border-mj-border bg-mj-white p-8">
        <div className="mb-8 text-center">
          <p className="font-julius text-xl tracking-[0.25em] text-mj-black">MOCELLIN JOIAS</p>
          <p className="mt-1 font-mulish text-[10px] uppercase tracking-[0.25em] text-mj-taupe">
            Área restrita
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
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
            <label className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe">
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
            <p className="font-mulish text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-mj-black py-3.5 font-mulish text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-mj-brown active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="font-mulish text-xs uppercase tracking-[0.15em] text-mj-taupe underline-offset-4 hover:underline hover:text-mj-black transition-colors"
          >
            ← Voltar à loja
          </a>
        </div>
      </div>
    </main>
  )
}
