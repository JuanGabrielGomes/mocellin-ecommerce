'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      alert('Erro ao excluir produto. Tente novamente.')
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      aria-label={`Excluir ${name}`}
      className="p-2 text-mj-taupe transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Trash2 size={16} />
    </button>
  )
}
