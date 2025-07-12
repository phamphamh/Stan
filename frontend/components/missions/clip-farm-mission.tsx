import ClipFarmHeader from "@/components/clip-farm/clip-farm-header"
import ActiveChallenges from "@/components/clip-farm/active-challenges"
import MyClips from "@/components/clip-farm/my-clips"
import CreatorLeaderboard from "@/components/clip-farm/creator-leaderboard"

export default function ClipFarmMission() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Clip Farm</h1>
        <p className="text-gray-400">Create content and earn tokens</p>
      </div>
      <ClipFarmHeader />
      <ActiveChallenges />
      <MyClips />
      <CreatorLeaderboard />
    </div>
  )
}
