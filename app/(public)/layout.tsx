import type { ReactNode } from 'react'
import { getActiveCampaign } from '@/lib/campaign'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
import { CampaignBanner } from '@/components/ui/CampaignBanner'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const campaign = await getActiveCampaign()

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
