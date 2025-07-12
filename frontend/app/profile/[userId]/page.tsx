import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import UserProfile from "@/components/profile/user-profile"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ProfilePageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params
  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Home" />}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <Link href="/leaderboard" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-white">User Profile</h1>
        </div>

        <div className="p-4">
          <UserProfile userId={userId} />
          <div className="h-16" />
        </div>
      </div>
    </AppShell>
  )
}
