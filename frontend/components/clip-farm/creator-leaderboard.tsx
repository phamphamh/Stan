"use client"

import { Trophy, Medal, Award, Coins } from "lucide-react"
import Image from "next/image"
import { config } from "@/lib/config"

const mockCreators = [
  {
    id: "1",
    username: "EditMaster",
    avatar: "/placeholder.svg?height=40&width=40",
    tokensEarned: 1250,
    viralClips: 8,
    totalViews: "2.1M",
    rank: 1,
  },
  {
    id: "2",
    username: "DanceQueen",
    avatar: "/placeholder.svg?height=40&width=40",
    tokensEarned: 980,
    viralClips: 6,
    totalViews: "1.8M",
    rank: 2,
  },
  {
    id: "3",
    username: "TransitionPro",
    avatar: "/placeholder.svg?height=40&width=40",
    tokensEarned: 750,
    viralClips: 4,
    totalViews: "1.2M",
    rank: 3,
  },
  {
    id: "4",
    username: "AestheticEdit",
    avatar: "/placeholder.svg?height=40&width=40",
    tokensEarned: 620,
    viralClips: 3,
    totalViews: "890K",
    rank: 4,
  },
]

export default function CreatorLeaderboard() {
  const selectedGroup = config.group

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Top Créateurs</h2>
      </div>

      <div className="space-y-3">
        {mockCreators.map((creator) => (
          <div key={creator.id} className="flex items-center gap-4 rounded-lg bg-[#1a1f2c] p-3">
            <div className="flex w-8 justify-center">{getRankIcon(creator.rank)}</div>
            <Image
              src={creator.avatar || "/placeholder.svg"}
              alt={creator.username}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{creator.username}</p>
                <div className="flex items-center gap-1" style={{ color: config.group.theme.primary }}>
                  <Coins className="h-4 w-4" />
                  <span className="font-bold">{creator.tokensEarned}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>🔥 {creator.viralClips} clips viraux</span>
                <span>👁️ {creator.totalViews} vues</span>
              </div>
            </div>
            {creator.rank === 1 && (
              <div className="rounded-full bg-yellow-400/20 px-2 py-1 text-xs font-semibold text-yellow-400">
                👑 King
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
