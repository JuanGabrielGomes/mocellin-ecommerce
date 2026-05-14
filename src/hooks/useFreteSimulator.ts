import { useState, useEffect } from 'react'

interface FreteOption {
  id: unknown
  name: string
  company: string
  price: number
  delivery_time: number
}

interface UseFreteSimulatorResult {
  opcoes: FreteOption[]
  loading: boolean
  error: string | null
}

export function useFreteSimulator(cep: string): UseFreteSimulatorResult {
  const [opcoes, setOpcoes] = useState<FreteOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const digits = cep.replace(/\D/g, '')

  useEffect(() => {
    if (digits.length !== 8) {
      setOpcoes([])
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/frete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cep_destino: digits }),
        })

        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? 'Erro ao consultar frete.')
          setOpcoes([])
        } else {
          setOpcoes(json.options ?? [])
          setError(null)
        }
      } catch {
        setError('Não foi possível consultar o frete.')
        setOpcoes([])
      } finally {
        setLoading(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [digits])

  return { opcoes, loading, error }
}
