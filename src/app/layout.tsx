import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { CookieConsent } from '@/components/ui/cookie-consent'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
// import { ErrorLogger } from './error-logger'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kylo - Create Stunning AI Videos',
  description: 'Generate professional AI videos from text prompts using advanced AI models.',
  keywords: 'AI video, text to video, video generation, Luma, Kling AI',
  authors: [{ name: 'Kylo' }],
  creator: 'Kylo',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/logo_sem_fundo.png', type: 'image/png' }
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico'
  },
  openGraph: {
    title: 'Kylo - Create Stunning AI Videos',
    description: 'Generate professional AI videos from text prompts using advanced AI models.',
    url: 'https://kylo.video',
    siteName: 'Kylo',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kylo - Create Stunning AI Videos',
    description: 'Generate professional AI videos from text prompts using advanced AI models.',
    creator: '@kylo',
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
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {/* {process.env.NODE_ENV === 'development' && <ErrorLogger />} */}
          {children}
          {/* <CookieConsent /> */}
        </Providers>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
