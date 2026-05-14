import type { NextRequest } from 'next/server'

const SUPERFRETE_URL = 'https://api.superfrete.com/api/v0/calculator'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const cep_destino =
    body !== null && typeof body === 'object' && 'cep_destino' in body
      ? String((body as Record<string, unknown>).cep_destino).replace(/\D/g, '')
      : ''

  if (cep_destino.length !== 8) {
    return Response.json({ error: 'CEP inválido. Informe 8 dígitos.' }, { status: 422 })
  }

  const token = process.env.SUPERFRETE_TOKEN
  const cepOrigem = process.env.SUPERFRETE_CEP_ORIGEM?.replace(/\D/g, '')

  if (!token || !cepOrigem) {
    return Response.json({ error: 'Configuração de frete indisponível.' }, { status: 503 })
  }

  let res: Response
  try {
    res = await fetch(SUPERFRETE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'mocellin-ecommerce/1.0',
      },
      body: JSON.stringify({
        from: { postal_code: cepOrigem },
        to: { postal_code: cep_destino },
        package: { weight: 0.3, width: 12, height: 4, length: 17 },
        services: '1,2,3,4',
      }),
    })
  } catch {
    return Response.json({ error: 'Não foi possível consultar o frete.' }, { status: 502 })
  }

  const data = await res.json()

  if (!res.ok) {
    // CEP não encontrado na Superfrete retorna 422
    if (res.status === 422) {
      return Response.json({ error: 'CEP de destino não encontrado.' }, { status: 422 })
    }
    return Response.json({ error: 'Erro ao consultar transportadoras.' }, { status: res.status })
  }

  // Superfrete retorna array na raiz ou dentro de `data`
  const services: unknown[] = Array.isArray(data) ? data : (data?.data ?? [])

  const options = services
    .filter((s): s is Record<string, unknown> => s !== null && typeof s === 'object')
    .filter((s) => !s.error)
    .map((s) => ({
      id: s.id,
      name: s.name,
      company: (s.company as Record<string, unknown>)?.name ?? s.name,
      price: Number(s.price),
      delivery_time: Number(s.delivery_time),
    }))

  return Response.json({ options })
}
