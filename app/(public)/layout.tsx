import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
import { CampaignBanner } from '@/components/ui/CampaignBanner'
import type { CampaignType } from '@/types'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('active', true)
    .maybeSingle()

  const campaign = data as CampaignType | null

  const colorOverrides = campaign
    ? Object.entries(campaign.colors)
        .map(([key, value]) => `--color-${key}: ${value};`)
        .join(' ')
    : ''

  const hasBanner = Boolean(campaign?.banner_text)

  return (
    <>
      {colorOverrides && (
        <style>{`:root { ${colorOverrides} }`}</style>
      )}
      {campaign && <CampaignBanner campaign={campaign} />}
      <Header hasBanner={hasBanner} />
      <div
        className="flex flex-1 flex-col"
        style={hasBanner ? { paddingTop: '40px' } : undefined}
      >
        {children}
      </div>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
