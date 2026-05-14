import type { Metadata } from 'next'
import Link from 'next/link'
import { CampaignForm } from '@/components/admin/CampaignForm'

export const metadata: Metadata = { title: 'Nova Campanha | Admin — Mocellin Joias' }

export default function NovaCampanhaPage() {
  return (
    <main className="flex-1 overflow-auto p-6 sm:p-8">
      <div className="mb-8">
        <Link
          href="/admin/campanhas"
          className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe hover:text-mj-black transition-colors"
        >
          ← Campanhas
        </Link>
        <h1 className="mt-3 font-julius text-3xl tracking-wider text-mj-black">NOVA CAMPANHA</h1>
      </div>
      <CampaignForm />
    </main>
  )
}
