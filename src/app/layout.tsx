import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KyloAI - Create Stunning AI Videos',
  description: 'Generate professional AI videos from text prompts using advanced AI models.',
  keywords: 'AI video, text to video, video generation, Luma, Kling AI',
  authors: [{ name: 'KyloAI' }],
  creator: 'KyloAI',
  openGraph: {
    title: 'KyloAI - Create Stunning AI Videos',
    description: 'Generate professional AI videos from text prompts using advanced AI models.',
    url: 'https://kyloai.com',
    siteName: 'KyloAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KyloAI - Create Stunning AI Videos',
    description: 'Generate professional AI videos from text prompts using advanced AI models.',
    creator: '@kyloai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
