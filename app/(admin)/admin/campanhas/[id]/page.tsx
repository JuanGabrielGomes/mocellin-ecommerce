import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CampaignForm } from '@/components/admin/CampaignForm'
import type { CampaignType } from '@/types'

export const metadata: Metadata = { title: 'Editar Campanha | Admin — Mocellin Joias' }

type Params = Promise<{ id: string }>

export default async function EditarCampanhaPage({ params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('campaigns').select('*').eq('id', id).single()

  if (!data) notFound()

  return (
    <main className="flex-1 overflow-auto p-6 sm:p-8">
      <div className="mb-8">
        <Link
          href="/admin/campanhas"
          className="font-mulish text-[10px] uppercase tracking-[0.2em] text-mj-taupe hover:text-mj-black transition-colors"
        >
          ← Campanhas
        </Link>
        <h1 className="mt-3 font-julius text-3xl tracking-wider text-mj-black">EDITAR CAMPANHA</h1>
      </div>
      <CampaignForm campaign={data as CampaignType} />
    </main>
  )
}
