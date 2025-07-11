import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import FullLeaderboard from "@/components/leaderboard/full-leaderboard"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LeaderboardPage() {
  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Home" />}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <Link href="/" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-white">Classement des Fans</h1>
        </div>

        <div className="p-4">
          <FullLeaderboard />
          <div className="h-16" />
        </div>
      </div>
    </AppShell>
  )
}
