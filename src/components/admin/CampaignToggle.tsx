'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function CampaignToggle({ id, active }: { id: string; active: boolean }) {
  const [optimistic, setOptimistic] = useState(active)
  const [, startTransition] = useTransition()
  const router = useRouter()

  async function toggle() {
    const next = !optimistic
    setOptimistic(next)
    const supabase = createClient()
    if (next) {
      // Deactivate all others first (unique index only allows one active)
      await supabase.from('campaigns').update({ active: false }).neq('id', id)
    }
    await supabase.from('campaigns').update({ active: next, updated_at: new Date().toISOString() }).eq('id', id)
    startTransition(() => router.refresh())
  }

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1 font-mulish text-xs font-medium transition-colors ${
        optimistic
          ? 'bg-emerald-500 text-white'
          : 'border border-mj-border text-mj-taupe hover:border-mj-black hover:text-mj-black'
      }`}
    >
      {optimistic ? 'Ativa' : 'Inativa'}
    </button>
  )
}
