import type { Metadata } from 'next/types'
import { draftMode } from 'next/headers'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { cn } from '@/utilities/ui'
import './globals.css'

export const metadata: Metadata = {
  title: 'BLOG APP',
  description: 'A modern blog application built with Next.js and Payload CMS',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()

  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-gray-900 text-white')}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-900">{children}</main>
            <Footer />
          </div>
          {draft && <LivePreviewListener />}
        </Providers>
      </body>
    </html>
  )
}
