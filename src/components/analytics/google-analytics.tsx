'use client'

import Script from 'next/script'

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Default to denied
          gtag('consent', 'default', {
            'analytics_storage': 'denied'
          });

          // Check for saved consent
          const consent = localStorage.getItem('cookie-consent');
          if (consent === 'accepted') {
            gtag('consent', 'update', {
              'analytics_storage': 'granted'
            });
          }

          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  )
}