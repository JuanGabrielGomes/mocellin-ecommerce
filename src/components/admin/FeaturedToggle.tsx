'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

export function FeaturedToggle({ id, featured }: { id: string; featured: boolean }) {
  const [value, setValue] = useState(featured)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    const next = !value
    setValue(next)
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ featured: next, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) setValue(!next)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={value ? 'Remover destaque' : 'Marcar como destaque'}
      className={`p-2 transition-colors disabled:opacity-40 ${
        value ? 'text-mj-brown' : 'text-mj-border hover:text-mj-brown'
      }`}
    >
      <Star size={16} fill={value ? 'currentColor' : 'none'} />
    </button>
  )
}
