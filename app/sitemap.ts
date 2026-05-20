import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { STORE } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('status', 'disponivel')

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${STORE.url}/produto/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: STORE.url,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${STORE.url}/catalogo`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ]
}
