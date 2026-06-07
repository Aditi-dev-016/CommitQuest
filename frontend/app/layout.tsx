import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { ToastContainer } from '@/components/ui/toast-container'

export const metadata: Metadata = {
  title: 'ContribQuest — Level Up Through Open Source',
  description: 'A gamified platform to help developers discover and contribute to open-source projects.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
