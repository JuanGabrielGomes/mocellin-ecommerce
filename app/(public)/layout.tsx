import type { ReactNode } from 'react'
import { Header } from '@/components/ui/Header'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col pt-14 sm:pt-16">{children}</div>
    </>
  )
}
