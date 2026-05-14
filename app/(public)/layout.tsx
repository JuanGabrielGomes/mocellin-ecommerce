import type { ReactNode } from 'react'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
