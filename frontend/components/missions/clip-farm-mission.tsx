import ClipFarmHeader from "@/components/clip-farm/clip-farm-header"
import ActiveChallenges from "@/components/clip-farm/active-challenges"
import MyClips from "@/components/clip-farm/my-clips"
import CreatorLeaderboard from "@/components/clip-farm/creator-leaderboard"
import { Clock } from "lucide-react"

export default function ClipFarmMission() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Content</h1>
        <p className="text-gray-400">Create content and earn tokens by sharing BLACKPINK love</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Clock className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-yellow-400">Coming Soon</span>
        </div>
      </div>

      {/* Contenu visible sans blur */}
      <div className="space-y-6">
        <ClipFarmHeader />
        <ActiveChallenges />
        <MyClips />
        <CreatorLeaderboard />
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          🎬 Content creation missions will be available soon! Get ready to show your BLACKPINK creativity.
        </p>
      </div>
    </div>
  )
}
