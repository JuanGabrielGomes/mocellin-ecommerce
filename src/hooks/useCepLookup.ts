import { useState, useEffect } from 'react'

interface CepData {
  street: string
  neighborhood: string
  city: string
  state: string
}

interface UseCepLookupResult extends CepData {
  loading: boolean
  error: string | null
}

const EMPTY: CepData = { street: '', neighborhood: '', city: '', state: '' }

export function useCepLookup(cep: string): UseCepLookupResult {
  const [data, setData] = useState<CepData>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const digits = cep.replace(/\D/g, '')

  useEffect(() => {
    if (digits.length !== 8) {
      setData(EMPTY)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao consultar CEP.')
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        if (json.erro) {
          setError('CEP não encontrado.')
          setData(EMPTY)
        } else {
          setData({
            street: json.logradouro ?? '',
            neighborhood: json.bairro ?? '',
            city: json.localidade ?? '',
            state: json.uf ?? '',
          })
          setError(null)
        }
      })
      .catch(() => {
        if (cancelled) return
        setError('Não foi possível consultar o CEP.')
        setData(EMPTY)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [digits])

  return { ...data, loading, error }
}
