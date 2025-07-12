import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { TokensProvider } from "@/lib/tokens-context"
import { Web3Provider } from "@/components/providers/web3-provider"
import { BlockchainProvider } from "@/lib/blockchain-context"
import { Toaster } from "sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "BLACKPINK Fan App",
  description: "The ultimate mobile experience for BLINKs.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "antialiased bg-gradient-to-b from-[#0a0f1b] to-[#02040a] text-gray-200 overflow-hidden",
          poppins.className,
        )}
      >
        <Web3Provider>
          <BlockchainProvider>
            <TokensProvider>
              {children}
              <Toaster
                position="top-center"
                richColors
                theme="dark"
                toastOptions={{
                  style: {
                    background: '#1a1f2c',
                    border: '1px solid #374151',
                    color: '#f3f4f6',
                  },
                }}
              />
            </TokensProvider>
          </BlockchainProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
