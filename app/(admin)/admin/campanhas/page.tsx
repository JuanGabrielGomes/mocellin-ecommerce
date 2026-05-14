import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CampaignToggle } from '@/components/admin/CampaignToggle'
import type { CampaignType } from '@/types'

export const metadata: Metadata = { title: 'Campanhas | Admin — Mocellin Joias' }

export default async function CampanhasPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  const campaigns = (data ?? []) as CampaignType[]

  return (
    <main className="flex-1 overflow-auto p-6 sm:p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mulish text-[10px] uppercase tracking-[0.3em] text-mj-taupe">Admin</p>
          <h1 className="mt-1 font-julius text-3xl tracking-wider text-mj-black">CAMPANHAS</h1>
        </div>
        <Link
          href="/admin/campanhas/nova"
          className="bg-mj-black px-5 py-2.5 font-mulish text-xs uppercase tracking-[0.15em] text-white transition-colors hover:bg-mj-brown"
        >
          Nova campanha
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="border border-mj-border bg-mj-white p-12 text-center">
          <p className="font-mulish text-sm text-mj-taupe">Nenhuma campanha criada ainda.</p>
        </div>
      ) : (
        <div className="border border-mj-border bg-mj-white">
          <table className="w-full">
            <thead className="border-b border-mj-border">
              <tr>
                {['Nome', 'Slug', 'Status', 'Banner', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-taupe"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-mj-border last:border-0 hover:bg-mj-cream/30">
                  <td className="px-4 py-4 font-mulish text-sm font-medium text-mj-black">
                    {c.name}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-mj-taupe">{c.slug}</td>
                  <td className="px-4 py-4">
                    <CampaignToggle id={c.id} active={c.active} />
                  </td>
                  <td className="px-4 py-4">
                    {c.banner_text ? (
                      <span
                        className="inline-block max-w-[200px] truncate px-2 py-1 font-mulish text-[10px]"
                        style={{ backgroundColor: c.banner_bg, color: c.banner_text_color }}
                      >
                        {c.banner_text}
                      </span>
                    ) : (
                      <span className="font-mulish text-xs text-mj-taupe/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/campanhas/${c.id}`}
                      className="font-mulish text-xs text-mj-taupe underline-offset-2 hover:text-mj-black hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
