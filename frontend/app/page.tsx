'use client'

import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import NewsCarousel from "@/components/home/news-carousel"
import EventCard from "@/components/home/event-card"
import NewsGrid from "@/components/home/news-grid"
import WeeklyLeaderboardHome from "@/components/home/weekly-leaderboard-home"
import AboutUs from "@/components/home/about-us"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import dynamic from "next/dynamic"

const WalletConnector = dynamic(() => import("@/components/web3/wallet-connector").then(mod => ({ default: mod.WalletConnector })), {
  ssr: false,
  loading: () => <div className="w-full max-w-md mx-auto p-6 border rounded-lg">Loading Wallet...</div>
})

export default function HomePage() {
  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Home" />}>
      <div className="flex-1 space-y-4 scrollable px-4 pb-4">
        <NewsCarousel />
        <EventCard />
        
        {/* Web3 Integration Section */}
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 p-6 rounded-lg border">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Artist Platform</h2>
            <p className="text-muted-foreground">
              Connect your wallet to create missions, manage rewards, and engage with fans on the blockchain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WalletConnector />
              <Link href="/artist">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Artist Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <NewsGrid />
        <WeeklyLeaderboardHome />
        <AboutUs />
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
