import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { CampaignType } from '@/types'

export const getActiveCampaign = cache(async (): Promise<CampaignType | null> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('active', true)
    .maybeSingle()
  return (data as CampaignType | null) ?? null
})
