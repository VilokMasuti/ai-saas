import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk',
})

export const metadata: Metadata = {
  title: 'AI Playground',
  description: 'Generate Ai',
  icons: {
    icon: '/ai.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
