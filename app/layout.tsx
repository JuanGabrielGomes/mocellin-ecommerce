import type { Metadata } from 'next'
import { Julius_Sans_One, Mulish } from 'next/font/google'
import { STORE } from '@/lib/config'
import './globals.css'

const julius = Julius_Sans_One({
  variable: '--font-julius',
  subsets: ['latin'],
  weight: '400',
})

const mulish = Mulish({
  variable: '--font-mulish',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL(STORE.url),
  title: {
    template: '%s | Mocellin Joias',
    default: 'Mocellin Joias — Joias e Semijoias',
  },
  description: STORE.description,
  openGraph: {
    siteName: STORE.name,
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${julius.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mj-cream font-mulish">
        {children}
      </body>
    </html>
  )
}
