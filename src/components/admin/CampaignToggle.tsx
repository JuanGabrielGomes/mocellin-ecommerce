'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export function CampaignToggle({ id, active }: { id: string; active: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    if (!active) {
      // Deactivate all others before activating this one
      await supabase.from('campaigns').update({ active: false }).neq('id', id)
    }
    await supabase
      .from('campaigns')
      .update({ active: !active, updated_at: new Date().toISOString() })
      .eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1 font-mulish text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? 'bg-emerald-500 text-white'
          : 'border border-mj-border text-mj-taupe hover:border-mj-black hover:text-mj-black'
      }`}
    >
      {loading && <Loader2 size={12} className="animate-spin" />}
      {active ? 'Ativa' : 'Inativa'}
    </button>
  )
}
