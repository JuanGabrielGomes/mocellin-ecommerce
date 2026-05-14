'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { CampaignType } from '@/types'

interface Props {
  campaign: CampaignType
}

export function CampaignBanner({ campaign }: Props) {
  const key = `banner-dismissed-${campaign.id}`
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(key)) setVisible(true)
  }, [key])

  function dismiss() {
    sessionStorage.setItem(key, '1')
    setVisible(false)
  }

  if (!visible || !campaign.banner_text) return null

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex h-10 items-center justify-center px-10"
      style={{ backgroundColor: campaign.banner_bg, color: campaign.banner_text_color }}
    >
      <p className="font-mulish text-[11px] uppercase tracking-[0.2em] text-center">
        {campaign.banner_text}
      </p>
      <button
        onClick={dismiss}
        aria-label="Fechar banner"
        className="absolute right-4 p-1 opacity-70 transition-opacity hover:opacity-100"
        style={{ color: campaign.banner_text_color }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
