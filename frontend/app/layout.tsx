import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import "../styles/mobile-optimizations.css"
import { cn } from "@/lib/utils"
import { Web3Provider } from "@/components/providers/web3-provider"
import { InstallPrompt, IOSInstallPrompt } from "@/components/pwa/install-prompt"
import { OfflineDetector } from "@/components/pwa/offline-detector"
import { BackgroundSync } from "@/components/pwa/background-sync"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "BLACKPINK Fan App",
  description: "The ultimate mobile experience for BLINKs worldwide",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  themeColor: '#e91e63',
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BLACKPINK Fan App'
  },
  openGraph: {
    title: 'BLACKPINK Fan App',
    description: 'The ultimate mobile experience for BLINKs worldwide',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLACKPINK Fan App',
    description: 'The ultimate mobile experience for BLINKs worldwide'
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#e91e63" />
        <meta name="msapplication-TileColor" content="#e91e63" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BLACKPINK Fan App" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#e91e63" />
      </head>
      <body
        className={cn(
          "antialiased bg-gradient-to-b from-[#0a0f1b] to-[#02040a] text-gray-200 overflow-hidden touch-manipulation",
          poppins.className,
        )}
      >
        <Web3Provider>
          {children}
          <InstallPrompt />
          <IOSInstallPrompt />
          <OfflineDetector />
          <BackgroundSync />
        </Web3Provider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
